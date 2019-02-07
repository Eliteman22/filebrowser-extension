"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display the amount of total running kernel and terminal sessions.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const icon_1 = require("../component/icon");
const text_1 = require("../component/text");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_1 = require("@phosphor/coreutils");
const manager_1 = require("./manager");
const group_1 = require("../component/group");
const variables_1 = __importDefault(require("../style/variables"));
const statusBar_1 = require("../style/statusBar");
// tslint:disable-next-line:variable-name
const RunningSessionsComponent = (props) => {
    return (react_1.default.createElement(group_1.GroupItem, { spacing: variables_1.default.textIconHalfSpacing, onClick: props.handleClick },
        react_1.default.createElement(group_1.GroupItem, { spacing: variables_1.default.textIconHalfSpacing },
            react_1.default.createElement(text_1.TextItem, { source: props.terminals }),
            react_1.default.createElement(icon_1.IconItem, { source: 'terminal-item', offset: { x: 1, y: 3 } })),
        react_1.default.createElement(group_1.GroupItem, { spacing: variables_1.default.textIconHalfSpacing },
            react_1.default.createElement(text_1.TextItem, { source: props.kernels }),
            react_1.default.createElement(icon_1.IconItem, { source: 'kernel-item', offset: { x: 0, y: 2 } }))));
};
class RunningSessions extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._onKernelsRunningChanged = (manager, kernels) => {
            this.model.kernels = kernels.length;
        };
        this._onTerminalsRunningChanged = (manager, terminals) => {
            this.model.terminals = terminals.length;
        };
        this._handleItemClick = () => {
            this._host.expandLeft();
            this._host.activateById('jp-running-sessions');
        };
        this._serviceManager = opts.serviceManager;
        this._host = opts.host;
        this._serviceManager.sessions.runningChanged.connect(this._onKernelsRunningChanged);
        this._serviceManager.terminals.runningChanged.connect(this._onTerminalsRunningChanged);
        this.model = new RunningSessions.Model();
        this.addClass(statusBar_1.interactiveItem);
    }
    render() {
        this.node.title = `${this.model.terminals} Terminals, ${this.model.kernels} Kernels`;
        return (react_1.default.createElement(RunningSessionsComponent, { kernels: this.model.kernels, terminals: this.model.terminals, handleClick: this._handleItemClick }));
    }
    dispose() {
        super.dispose();
        this._serviceManager.sessions.runningChanged.disconnect(this._onKernelsRunningChanged);
        this._serviceManager.terminals.runningChanged.disconnect(this._onTerminalsRunningChanged);
    }
}
(function (RunningSessions) {
    class Model extends apputils_1.VDomModel {
        constructor() {
            super(...arguments);
            this._terminals = 0;
            this._kernels = 0;
        }
        get kernels() {
            return this._kernels;
        }
        set kernels(kernels) {
            const oldKernels = this._kernels;
            this._kernels = kernels;
            if (oldKernels !== this._kernels) {
                this.stateChanged.emit(void 0);
            }
        }
        get terminals() {
            return this._terminals;
        }
        set terminals(terminals) {
            const oldTerminals = this._terminals;
            this._terminals = terminals;
            if (oldTerminals !== this._terminals) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    RunningSessions.Model = Model;
})(RunningSessions || (RunningSessions = {}));
// tslint:disable-next-line:variable-name
exports.IRunningSessions = new coreutils_1.Token('@jupyterlab/statusbar:IRunningSessions');
/*
 * Initialization data for the statusbar extension.
 */
exports.runningSessionsItem = {
    id: '@jupyterlab/statusbar:running-sessions-item',
    autoStart: true,
    provides: exports.IRunningSessions,
    requires: [manager_1.IDefaultsManager],
    activate: (app, manager) => {
        const item = new RunningSessions({
            host: app.shell,
            serviceManager: app.serviceManager
        });
        manager.addDefaultStatus('running-sessions-item', item, {
            align: 'left',
            priority: 0
        });
        return item;
    }
};
