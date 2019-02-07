"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Local CSS must be loaded prior to loading other libs.
require("../style/index.css");
const statusBar_1 = require("./statusBar");
// Export default status bar items
const defaults_1 = require("./defaults");
exports.STATUSBAR_PLUGIN_ID = '@jupyterlab/statusbar:plugin';
/**
 * Initialization data for the statusbar extension.
 */
const statusBar = {
    id: exports.STATUSBAR_PLUGIN_ID,
    provides: statusBar_1.IStatusBar,
    autoStart: true,
    activate: (app) => {
        return new statusBar_1.StatusBar({ host: app.shell });
    }
};
const plugins = [
    statusBar,
    defaults_1.defaultsManager,
    defaults_1.lineColItem,
    defaults_1.notebookTrustItem,
    defaults_1.fileUploadItem,
    defaults_1.kernelStatusItem,
    defaults_1.commandEditItem,
    defaults_1.runningSessionsItem,
    defaults_1.filePathItem,
    defaults_1.tabSpaceItem,
    defaults_1.editorSyntax,
    defaults_1.memoryUsageItem,
    defaults_1.savingStatusItem
];
exports.default = plugins;
__export(require("./statusBar"));
