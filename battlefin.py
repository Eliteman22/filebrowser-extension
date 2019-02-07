import sqlalchemy
import psycopg2
import simplejson
from sqlalchemy import create_engine
import pandas as pd
from dateutil.parser import parse
from datetime import datetime
from pyathena.util import as_pandas
from pyathena import connect
import dask.dataframe as dd
from dask.dataframe.utils import make_meta
import requests
import datetime
import time
import os
import subprocess
from subprocess import call
import boto3
from random import *
from datetime import datetime
import glob
from fastparquet import ParquetFile
from fastparquet import write


class BattleFin:
    def __init__(self):
        constantUrl = "http://34.200.243.71:3000/v1/sandbox/constants/1.0"
        constants = requests.get(constantUrl).json()
        
        self.rowCap = int(constants["rowCap"])
        self.cellCap = int(constants["cellCap"])
        
        credentialUrl = "http://34.200.243.71:3000/v1/warehouse/credentials/metadata"
        
        credentials = requests.get(credentialUrl).json()
        
        dbname = credentials["databaseName"]
        host = credentials["host"]
        port = credentials["port"]
        user = credentials["user"]
        password = credentials["password"]
        
        self.engine = psycopg2.connect(dbname=dbname,host=host,port=port, user=user, password=password);
        
        # Set up S3 bucket
        AWS_ACCESS_KEY_ID = constants["awsAccessKeyId"]
        AWS_SECRET_ACCESS_KEY = constants["awsSecretAccessKey"]
        
        mysession = boto3.session.Session(aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        self.s3_client=mysession.client("s3")

        
    
    def validate(self,date_text):
        try:
            datetime.datetime.strptime(date_text,'%Y-%m-%d')
            return True
        except ValueError:
            return False
                                            

    def getFullDataset(self, datasetName, returns='pandas'):
        metaUrl = "http://34.200.243.71:3000/v1/warehouse/datasets/getOne/" + datasetName
        metadata = requests.get(metaUrl).json()
        rowCount = int(metadata["rowCount"])
        columnCount = int(metadata["columnCount"])
        
        query = "SELECT * FROM " + datasetName + ";"
        
        print("Validating query ...")
        
        print("Estimated rows returned by query: " + str(rowCount))
        
        if rowCount > self.rowCap:
            print("The table you are trying to pull is too large, there are over a 1,000,000 rows.")
            print("Try using the get function to aggregate a smaller version of the dataset")
            return -1
        
        if (rowCount * columnCount) > self.cellCap:        
            cursor.execute(single_query)
            row = cursor.fetchone()
        
            print("The table you chose is too large, please try to query a smaller subset rather than pulling the entire table")
            return -1
                                            
       
        
        # Check the cache
        if datasetName == 'edison_competition':
        
            current_items = glob.glob("./.cache/*.parq")
            if ("./.cache/" + datasetName + ".parq") in current_items:
                # Already cached
                print("Getting cached data")
                df = ParquetFile("./.cache/" + datasetName + ".parq")

                if returns == 'pandas':
                    return df.to_pandas()
                    print("DataFrame Ready!")
                elif returns == 'dask':
                    return dd.from_pandas(df, npartitions=3)
                    print("DataFrame Ready!")
                else:
                    return "Not a valid return type."
        
        print("Pulling data ...")
        
        start = time.time()
        
        df = pd.read_sql_query(query, self.engine)
        
        stop = time.time()
        elapsed = stop - start
        
        # Log the query
        host_name = subprocess.check_output(["hostname"]).decode()
        host_name = self.fixEmail(host_name)
            
        body = {
            "query": query,
            "queryTime": elapsed
        }
        
        logQuery = requests.post("http://34.200.243.71:3000/v1/sandbox/newQuery/" + host_name.replace("\n", ""),data=body)
        
        print("Data pull took: " + str(elapsed) + " seconds.")
        
        # Cache the full dataset
        if datasetName == 'edison_competition':
        
            print("Caching data ...")

            write(("./.cache/" + datasetName + ".parq"), df)

            end = time.time()
            elapsed = end - start
            print("Dataset Cache took: " + str(elapsed) + " seconds")
        print("DataFrame Ready!")
        
        if returns == 'pandas':
            return df
        elif returns == 'dask':
            return dd.from_pandas(df, npartitions=3)
        else:
        	return "Not a valid return type."
        


    def get(self, datasetName,date_column=0,start_date=0, end_date=0, search_column=0, search_value=0, rows=0, returns='pandas'):
        query = 'SELECT * FROM ' + datasetName
        metaUrl = "http://34.200.243.71:3000/v1/warehouse/datasets/getOne/" + datasetName

        metadata = requests.get(metaUrl).json()
        columnCount = int(metadata["columnCount"])
        columns = metadata["columns"]

        count = 0

        if start_date != 0:
            if date_column not in columns:
                print("Please enter a valid date column.")
                return -1
            
            if (self.validate(start_date) == False):
                print("Please enter a valid start date in the YYYY-MM-DD format")
                return -1
            
            query += " WHERE " + date_column + " >= " + "'" + start_date + "'"
            count += 1

        if end_date != 0:
            
            if (self.validate(end_date) == False):
                print("Please enter a valid end date in the YYYY-MM-DD format")
                return -1
            
            if count > 0:
                query += " AND"
            else:
                query += " WHERE"
            query += " " + date_column + " <= " + "'" + end_date + "'"
            count += 1

        if search_column != 0 and search_value != 0:
            if search_column not in columns:
                print("Please enter a valid search column.")
                return -1
            if count > 0:
                query += " AND"
            else:
                query += " WHERE"

            query += " " + search_column + " = " + "'" + search_value + "'"
        
        isUnder = False
        if rows != 0:
           
            query += " LIMIT " + str(rows)
            if int(rows) > int(self.rowCap):
                print("Select a row limit under 100,000 rows.")
                return -1
            else:
                print("Estimated rows returned by this query: " + str(rows))
                isUnder = True

        query += ";"
        
        # LIMIT not set
        if (isUnder == False):    
            count_query = query.replace('SELECT * FROM ' + datasetName, 'SELECT COUNT(*) FROM ' + datasetName)

            print("Validating query...")

            cursor = self.engine.cursor()
            cursor.execute(count_query)
            rows = cursor.fetchone()[0]

            print("Estimated rows returned by this query: " + str(rows))
        
        if rows > self.rowCap:
            print("The table you are trying to pull is too large, there are over a million rows, please try aggregating a smaller table.")
            return -1
        if rows * columnCount > self.cellCap:
            print("The table you are trying to pull is too large, there are over 1,000,000,000 cells, please try aggregating a smaller table.")
            return -1
        print("Pulling data...")
        start = time.time()
        df = pd.read_sql_query(query, self.engine)
        end = time.time()
        total = end - start
        
        # Log the query
        host_name = subprocess.check_output(["hostname"]).decode()
        host_name = self.fixEmail(host_name)
            
        body = {
            "query": query,
            "queryTime": total
        }
        
        logQuery = requests.post("http://34.200.243.71:3000/v1/sandbox/newQuery/" + host_name.replace("\n", ""),data=body)
        
        print("Data pull took: " + str(total) + " seconds." )
        print("DataFrame ready!")
        if returns == 'pandas':
            return df
        elif returns == 'dask':
            return dd.from_pandas(df, npartitions=3)
        else:
            return "Not a valid return type."
        
        
    
    def fixEmail(self,email):
        email = email.replace("jupyter-","")
        email = email.replace("-40", "@")
        email = email.replace("-2e", ".")
        return email
    
    def submit(self,notebookName,final=False):
        path = os.getcwd() + "/" + notebookName + ".ipynb"
        print(path)
        print("Submitting notebook ...")
        try:
            # save notebook
            call(["jupyter","nbconvert","--to", "html", path])
            
            # Post to S3
            host_name = subprocess.check_output(["hostname"]).decode()
            host_name = self.fixEmail(host_name)
            appended_number = str(datetime.now())
            
            key = str(notebookName) + ".html"
            bucketName = "competition.battlefinensemble.com"
            outputName = "submissions" + "/" + str(host_name) + "/" + str(notebookName) + "_" + str(appended_number) + ".html"
            self.s3_client.upload_file(key, bucketName, outputName)
            
            submission_body = {
                "email": str(host_name).replace("\n", ""),
                "finalSubmission": final,
                "fileName": str(notebookName) + "_" + str(appended_number) + ".html"
            }
            
            res = requests.post("http://34.200.243.71:3000/v1/competition/submit",data=submission_body)                                            
            # remove notebook
            call(["rm",os.getcwd() + "/" + notebookName + ".html"])
            print("Notebook submitted!")
        except Exception as e:
            print(e)
            print("Unable to submit notebook.")
            return -1

    def getColumnNames(self,datasetName):
    	query = "SELECT * FROM " + datasetName + " WHERE false;"
    	df = pd.read_sql_query(query, self.engine)

    	return df.columns


