"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disposable_1 = require("@phosphor/disposable");
const apputils_1 = require("@jupyterlab/apputils");
const notebook_1 = require("@jupyterlab/notebook");
/**
 * The plugin registration information.
 */
const plugin = {
    activate,
    id: 'my-extension-name:buttonPlugin',
    autoStart: true
};
/**
 * A notebook widget extension that adds a button to the toolbar.
 */
class ButtonExtension {
    /**
     * Create a new extension object.
     */
    createNew(panel, context) {
        let callback = () => {
            notebook_1.NotebookActions.runAll(panel.content, context.session);
        };
        let button = new apputils_1.ToolbarButton({
            className: 'myButton',
            iconClassName: 'fa fa-fast-forward',
            onClick: callback,
            tooltip: 'Run All'
        });
        panel.toolbar.insertItem(0, 'runAll', button);
        return new disposable_1.DisposableDelegate(() => {
            button.dispose();
        });
    }
}
exports.ButtonExtension = ButtonExtension;
/**
 * Activate the extension.
 */
function activate(app) {
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
}
;
/**
 * Export the plugin as default.
 */
exports.default = plugin;
