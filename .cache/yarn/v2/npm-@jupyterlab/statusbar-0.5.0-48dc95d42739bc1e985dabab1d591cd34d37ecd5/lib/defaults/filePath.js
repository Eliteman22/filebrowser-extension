"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display the file path of the active document.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const manager_1 = require("./manager");
const text_1 = require("../component/text");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_1 = require("@phosphor/coreutils");
const coreutils_2 = require("@jupyterlab/coreutils");
const docmanager_1 = require("@jupyterlab/docmanager");
// tslint:disable-next-line:variable-name
const FilePathComponent = (props) => {
    return react_1.default.createElement(text_1.TextItem, { source: props.name });
};
class FilePath extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._onShellCurrentChanged = (shell, change) => {
            this.model.widget = change.newValue;
        };
        this._shell = opts.shell;
        this._docManager = opts.docManager;
        this._shell.currentChanged.connect(this._onShellCurrentChanged);
        this.model = new FilePath.Model(this._shell.currentWidget, this._docManager);
        this.node.title = this.model.path;
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            this.node.title = this.model.path;
            return (react_1.default.createElement(FilePathComponent, { fullPath: this.model.path, name: this.model.name }));
        }
    }
    dispose() {
        super.dispose();
        this._shell.currentChanged.disconnect(this._onShellCurrentChanged);
    }
}
(function (FilePath) {
    class Model extends apputils_1.VDomModel {
        constructor(widget, docManager) {
            super();
            this._onTitleChange = (title) => {
                const oldState = this._getAllState();
                this._name = title.label;
                this._triggerChange(oldState, this._getAllState());
            };
            this._onPathChange = (_documentModel, newPath) => {
                const oldState = this._getAllState();
                this._path = newPath;
                this._name = coreutils_2.PathExt.basename(newPath);
                this._triggerChange(oldState, this._getAllState());
            };
            this._path = '';
            this._name = '';
            this._widget = null;
            this.widget = widget;
            this._docManager = docManager;
        }
        get path() {
            return this._path;
        }
        get name() {
            return this._name;
        }
        get widget() {
            return this._widget;
        }
        set widget(widget) {
            const oldWidget = this._widget;
            if (oldWidget !== null) {
                const oldContext = this._docManager.contextForWidget(oldWidget);
                if (oldContext) {
                    oldContext.pathChanged.disconnect(this._onPathChange);
                }
                else {
                    oldWidget.title.changed.disconnect(this._onTitleChange);
                }
            }
            const oldState = this._getAllState();
            this._widget = widget;
            if (this._widget === null) {
                this._path = '';
                this._name = '';
            }
            else {
                const widgetContext = this._docManager.contextForWidget(this._widget);
                if (widgetContext) {
                    this._path = widgetContext.path;
                    this._name = coreutils_2.PathExt.basename(widgetContext.path);
                    widgetContext.pathChanged.connect(this._onPathChange);
                }
                else {
                    this._path = '';
                    this._name = this._widget.title.label;
                    this._widget.title.changed.connect(this._onTitleChange);
                }
            }
            this._triggerChange(oldState, this._getAllState());
        }
        _getAllState() {
            return [this._path, this._name];
        }
        _triggerChange(oldState, newState) {
            if (oldState[0] !== newState[0] || oldState[1] !== newState[1]) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    FilePath.Model = Model;
})(FilePath || (FilePath = {}));
// tslint:disable-next-line:variable-name
exports.IFilePath = new coreutils_1.Token('@jupyterlab/statusbar:IFilePath');
exports.filePathItem = {
    id: '@jupyterlab/statusbar:file-path-item',
    autoStart: true,
    provides: exports.IFilePath,
    requires: [manager_1.IDefaultsManager, docmanager_1.IDocumentManager],
    activate: (app, manager, docManager) => {
        let item = new FilePath({ shell: app.shell, docManager });
        manager.addDefaultStatus('file-path-item', item, {
            align: 'right',
            priority: 0,
            isActive: () => {
                return true;
            }
        });
        return item;
    }
};
