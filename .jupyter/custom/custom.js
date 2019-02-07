     define([
         'base/js/namespace',
         'base/js/promises'
     ], function(IPython, promises) {
         promises.app_initialized.then(function (appName) {
             console.log("We're IN")
         });
     });
