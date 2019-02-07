"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const manager_1 = require("./manager");
const text_1 = require("../component/text");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_1 = require("@phosphor/coreutils");
const docmanager_1 = require("@jupyterlab/docmanager");
// tslint:disable-next-line:variable-name
const SavingStatusComponent = (props) => {
    return react_1.default.createElement(text_1.TextItem, { source: `Saving ${props.fileStatus}` });
};
const SAVING_COMPLETE_MESSAGE_MILLIS = 2000;
class SavingStatus extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._onShellCurrentChanged = (shell, change) => {
            this.model.widget = change.newValue;
        };
        this._shell = opts.shell;
        this._docManager = opts.docManager;
        this._shell.currentChanged.connect(this._onShellCurrentChanged);
        this.model = new SavingStatus.Model(this._shell.currentWidget, this._docManager);
    }
    render() {
        if (this.model === null || this.model.status === null) {
            return null;
        }
        else {
            return react_1.default.createElement(SavingStatusComponent, { fileStatus: this.model.status });
        }
    }
    dispose() {
        super.dispose();
        this._shell.currentChanged.disconnect(this._onShellCurrentChanged);
    }
}
(function (SavingStatus) {
    class Model extends apputils_1.VDomModel {
        constructor(widget, docManager) {
            super();
            this._onStatusChange = (_documentModel, newStatus) => {
                this._status = newStatus;
                if (this._status === 'completed') {
                    setTimeout(() => {
                        this._status = null;
                        this.stateChanged.emit(void 0);
                    }, SAVING_COMPLETE_MESSAGE_MILLIS);
                    this.stateChanged.emit(void 0);
                }
                else {
                    this.stateChanged.emit(void 0);
                }
            };
            this._widget = null;
            this._status = null;
            this.widget = widget;
            this._docManager = docManager;
        }
        get status() {
            return this._status;
        }
        get widget() {
            return this._widget;
        }
        set widget(widget) {
            const oldWidget = this._widget;
            if (oldWidget !== null) {
                const oldContext = this._docManager.contextForWidget(oldWidget);
                if (oldContext) {
                    oldContext.saveState.disconnect(this._onStatusChange);
                }
            }
            this._widget = widget;
            if (this._widget === null) {
                this._status = null;
            }
            else {
                const widgetContext = this._docManager.contextForWidget(this._widget);
                if (widgetContext) {
                    widgetContext.saveState.connect(this._onStatusChange);
                }
            }
        }
    }
    SavingStatus.Model = Model;
})(SavingStatus || (SavingStatus = {}));
// tslint:disable-next-line:variable-name
exports.ISavingStatus = new coreutils_1.Token('@jupyterlab/statusbar:ISavingStatus');
exports.savingStatusItem = {
    id: '@jupyterlab/statusbar:saving-status-item',
    autoStart: true,
    provides: exports.ISavingStatus,
    requires: [manager_1.IDefaultsManager, docmanager_1.IDocumentManager],
    activate: (app, manager, docManager) => {
        let item = new SavingStatus({ shell: app.shell, docManager });
        manager.addDefaultStatus('saving-status-item', item, {
            align: 'middle',
            isActive: () => {
                return true;
            },
            stateChanged: item.model.stateChanged
        });
        return item;
    }
};
