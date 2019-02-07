"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display the status of the kernel of the active notbeook or console.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const text_1 = require("../component/text");
const notebook_1 = require("@jupyterlab/notebook");
const manager_1 = require("./manager");
const console_1 = require("@jupyterlab/console");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_1 = require("@phosphor/coreutils");
const contexts_1 = require("../contexts");
const text_2 = require("../util/text");
const statusBar_1 = require("../style/statusBar");
const filePath_1 = require("./filePath");
// tslint:disable-next-line:variable-name
const KernelStatusComponent = (props) => {
    return (react_1.default.createElement(text_1.TextItem, { onClick: props.handleClick, source: `${text_2.TextExt.titleCase(props.name)} | ${text_2.TextExt.titleCase(props.status)}` }));
};
class KernelStatus extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._handleClick = () => {
            if (this.model.type === 'notebook') {
                this._commands.execute('notebook:change-kernel');
            }
        };
        this._onFilePathChange = () => {
            if (this.model.type === 'notebook') {
                this.node.title = `Change active kernel for ${this._filePath.model.name}`;
            }
            else {
                this.node.title = `Active kernel type for ${this._filePath.model.name}`;
            }
        };
        this._onMainAreaCurrentChange = (shell, change) => {
            const { newValue } = change;
            const editor = this._getFocusedSession(newValue);
            this.model.session = editor;
            if (this.model.type === 'notebook') {
                this.addClass(statusBar_1.interactiveItem);
            }
            else {
                this.removeClass(statusBar_1.interactiveItem);
            }
        };
        this._notebookTracker = opts.notebookTracker;
        this._consoleTracker = opts.consoleTracker;
        this._commands = opts.commands;
        this._shell = opts.shell;
        this._filePath = opts.filePath;
        this._shell.currentChanged.connect(this._onMainAreaCurrentChange);
        this._filePath.model.stateChanged.connect(this._onFilePathChange);
        this.model = new KernelStatus.Model(this._getFocusedSession(this._shell.currentWidget));
        if (this.model.type === 'notebook') {
            this.addClass(statusBar_1.interactiveItem);
        }
        this._onFilePathChange();
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            return (react_1.default.createElement(KernelStatusComponent, { status: this.model.status, name: this.model.name, handleClick: this._handleClick }));
        }
    }
    dispose() {
        super.dispose();
        this._shell.currentChanged.disconnect(this._onMainAreaCurrentChange);
    }
    onUpdateRequest(msg) {
        this.model.session = this._getFocusedSession(this._shell.currentWidget);
        if (this.model.type === 'notebook') {
            this.addClass(statusBar_1.interactiveItem);
        }
        else {
            this.removeClass(statusBar_1.interactiveItem);
        }
        super.onUpdateRequest(msg);
    }
    _getFocusedSession(val) {
        if (val === null) {
            return null;
        }
        else {
            if (this._notebookTracker.has(val)) {
                return val.session;
            }
            else if (this._consoleTracker.has(val)) {
                return val.session;
            }
            else {
                return null;
            }
        }
    }
}
(function (KernelStatus) {
    class Model extends apputils_1.VDomModel {
        constructor(session) {
            super();
            this._onKernelStatusChanged = (_session, status) => {
                this._kernelStatus = status;
                this.stateChanged.emit(void 0);
            };
            this._onKernelChanged = (_session, change) => {
                const oldState = this._getAllState();
                const { newValue } = change;
                if (newValue !== null) {
                    this._kernelStatus = newValue.status;
                    this._kernelName = newValue.model.name.toLowerCase();
                }
                else {
                    this._kernelStatus = 'unknown';
                    this._kernelName = 'unknown';
                }
                this._triggerChange(oldState, this._getAllState());
            };
            this._kernelName = 'unknown';
            this._kernelStatus = 'unknown';
            this._session = null;
            this.session = session;
        }
        get name() {
            return this._kernelName;
        }
        get status() {
            return this._kernelStatus;
        }
        get type() {
            return this._session && this._session.type;
        }
        get session() {
            return this._session;
        }
        set session(session) {
            const oldSession = this._session;
            if (oldSession !== null) {
                oldSession.statusChanged.disconnect(this._onKernelStatusChanged);
                oldSession.kernelChanged.disconnect(this._onKernelChanged);
            }
            const oldState = this._getAllState();
            this._session = session;
            if (this._session === null) {
                this._kernelStatus = 'unknown';
                this._kernelName = 'unknown';
            }
            else {
                this._kernelStatus = this._session.status;
                this._kernelName = this._session.kernelDisplayName.toLowerCase();
                this._session.statusChanged.connect(this._onKernelStatusChanged);
                this._session.kernelChanged.connect(this._onKernelChanged);
            }
            this._triggerChange(oldState, this._getAllState());
        }
        _getAllState() {
            return [this._kernelName, this._kernelStatus];
        }
        _triggerChange(oldState, newState) {
            if (oldState[0] !== newState[0] || oldState[1] !== newState[1]) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    KernelStatus.Model = Model;
})(KernelStatus || (KernelStatus = {}));
// tslint:disable-next-line:variable-name
exports.IKernelStatus = new coreutils_1.Token('@jupyterlab/statusbar:IKernelStatus');
exports.kernelStatusItem = {
    id: '@jupyterlab/statusbar:kernel-status-item',
    autoStart: true,
    requires: [manager_1.IDefaultsManager, notebook_1.INotebookTracker, console_1.IConsoleTracker, filePath_1.IFilePath],
    activate: (app, manager, notebookTracker, consoleTracker, filePath) => {
        const item = new KernelStatus({
            shell: app.shell,
            notebookTracker,
            consoleTracker,
            commands: app.commands,
            filePath
        });
        manager.addDefaultStatus('kernel-status-item', item, {
            align: 'left',
            priority: 1,
            isActive: contexts_1.IStatusContext.delegateActive(app.shell, [
                { tracker: notebookTracker },
                { tracker: consoleTracker }
            ])
        });
        return item;
    }
};
