module.exports = [{
    id: '@flaviolici/filebrowser-extension',
    autoStart: true,
    activate: function(app) {
      console.log('JupyterLab extension @flaviolici/filebrowser-extension is activated!');
      console.log(app.commands);
    }
}];
