module.exports = [{
    id: '@battlefin/filemanager-extension',
    autoStart: true,
    activate: function(app) {
      console.log('JupyterLab extension @battlefin/filemanager-extension is activated!');
      console.log(app.commands);
    }
}];
