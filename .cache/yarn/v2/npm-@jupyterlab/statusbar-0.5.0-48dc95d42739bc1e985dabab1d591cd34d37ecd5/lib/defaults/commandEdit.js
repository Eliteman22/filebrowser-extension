"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display which notebook mode user is in.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const React = __importStar(require("react"));
const notebook_1 = require("@jupyterlab/notebook");
const manager_1 = require("./manager");
const text_1 = require("../component/text");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_1 = require("@phosphor/coreutils");
const contexts_1 = require("../contexts");
const text_2 = require("../util/text");
// tslint:disable-next-line:variable-name
const CommandEditComponent = (props) => {
    return (React.createElement(text_1.TextItem, { source: `Mode: ${text_2.TextExt.titleCase(props.notebookMode)}` }));
};
class CommandEdit extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._onNotebookChange = (tracker, notebook) => {
            if (notebook === null) {
                this.model.notebook = null;
            }
            else {
                this.model.notebook = notebook.content;
            }
        };
        this._tracker = opts.tracker;
        this._tracker.currentChanged.connect(this._onNotebookChange);
        this.model = new CommandEdit.Model(this._tracker.currentWidget && this._tracker.currentWidget.content);
        this.node.title = `Notebook is in ${this.model.notebookMode} mode`;
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            this.node.title = `Notebook is in ${this.model.notebookMode} mode`;
            return (React.createElement(CommandEditComponent, { notebookMode: this.model.notebookMode }));
        }
    }
    dispose() {
        super.dispose();
        this._tracker.currentChanged.disconnect(this._onNotebookChange);
    }
}
(function (CommandEdit) {
    class Model extends apputils_1.VDomModel {
        constructor(notebook) {
            super();
            this._onChanged = (_notebook) => {
                const oldState = this._getAllState();
                if (_notebook !== null && _notebook !== undefined) {
                    this._notebookMode = _notebook.mode;
                }
                else {
                    this._notebookMode = 'command';
                }
                this._triggerChange(oldState, this._getAllState());
            };
            this._notebookMode = 'command';
            this._notebook = null;
            this.notebook = notebook;
        }
        get notebookMode() {
            return this._notebookMode;
        }
        set notebookMode(notebookMode) {
            this._notebookMode = notebookMode;
        }
        set notebook(notebook) {
            const oldNotebook = this._notebook;
            if (oldNotebook !== null) {
                oldNotebook.stateChanged.disconnect(this._onChanged);
                oldNotebook.activeCellChanged.disconnect(this._onChanged);
                oldNotebook.modelContentChanged.disconnect(this._onChanged);
            }
            const oldState = this._getAllState();
            this._notebook = notebook;
            if (this._notebook === null) {
                this._notebookMode = 'command';
            }
            else {
                this._notebookMode = this._notebook.mode;
                this._notebook.stateChanged.connect(this._onChanged);
                this._notebook.activeCellChanged.connect(this._onChanged);
                this._notebook.modelContentChanged.connect(this._onChanged);
            }
            this._triggerChange(oldState, this._getAllState());
        }
        _getAllState() {
            return this._notebookMode;
        }
        _triggerChange(oldState, newState) {
            if (oldState !== newState) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    CommandEdit.Model = Model;
})(CommandEdit || (CommandEdit = {}));
// tslint:disable-next-line:variable-name
exports.ICommandEdit = new coreutils_1.Token('@jupyterlab/statusbar:ICommandEdit');
exports.commandEditItem = {
    id: '@jupyterlab/statusbar:command-edit-item',
    autoStart: true,
    provides: exports.ICommandEdit,
    requires: [manager_1.IDefaultsManager, notebook_1.INotebookTracker],
    activate: (app, manager, tracker) => {
        const item = new CommandEdit({
            tracker
        });
        manager.addDefaultStatus('command-edit-item', item, {
            align: 'right',
            priority: 4,
            isActive: contexts_1.IStatusContext.delegateActive(app.shell, [{ tracker }])
        });
        return item;
    }
};
