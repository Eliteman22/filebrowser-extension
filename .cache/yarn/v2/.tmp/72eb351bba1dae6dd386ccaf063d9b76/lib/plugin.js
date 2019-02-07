module.exports = [{
    id: '@flaviolici/sandbox',
    autoStart: true,
    activate: function(app) {
       window.oncontextmenu = function ()
            {
                console.log('a')
                return false;     // cancel default menu
            }
    }
}];
