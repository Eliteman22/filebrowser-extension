"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display if a cell is trusted in the notebook.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const notebook_1 = require("@jupyterlab/notebook");
const algorithm_1 = require("@phosphor/algorithm");
const manager_1 = require("./manager");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_1 = require("@phosphor/coreutils");
const icon_1 = require("../component/icon");
const contexts_1 = require("../contexts");
exports.cellStatus = (prop) => {
    if (prop.trustedCells === prop.totalCells) {
        return [
            `Notebook trusted: ${prop.trustedCells} of ${prop.totalCells} cells trusted.`,
            'trusted-item'
        ];
    }
    else if (prop.activeCellTrusted) {
        return [
            `Active cell trusted: ${prop.trustedCells} of ${prop.totalCells} cells trusted. `,
            'trusted-item'
        ];
    }
    else {
        return [
            `Notebook not trusted: ${prop.trustedCells} of ${prop.totalCells} cells trusted.`,
            'not-trusted-item'
        ];
    }
};
// tslint:disable-next-line:variable-name
const NotebookTrustComponent = (props) => {
    let source;
    source = exports.cellStatus(props)[1];
    return react_1.default.createElement(icon_1.IconItem, { source: source, offset: { x: 0, y: 2 } });
};
class NotebookTrust extends apputils_1.VDomRenderer {
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
        this.model = new NotebookTrust.Model(this._tracker.currentWidget && this._tracker.currentWidget.content);
        this.node.title = exports.cellStatus(this.model)[0];
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            this.node.title = exports.cellStatus(this.model)[0];
            return (react_1.default.createElement("div", null,
                react_1.default.createElement(NotebookTrustComponent, { allCellsTrusted: this.model.trustedCells === this.model.totalCells, activeCellTrusted: this.model.activeCellTrusted, totalCells: this.model.totalCells, trustedCells: this.model.trustedCells })));
        }
    }
    dispose() {
        super.dispose();
        this._tracker.currentChanged.disconnect(this._onNotebookChange);
    }
}
(function (NotebookTrust) {
    class Model extends apputils_1.VDomModel {
        constructor(notebook) {
            super();
            this._onModelChanged = (notebook) => {
                const oldState = this._getAllState();
                const { total, trusted } = this._deriveCellTrustState(notebook.model);
                this._totalCells = total;
                this._trustedCells = trusted;
                this._triggerChange(oldState, this._getAllState());
            };
            this._onActiveCellChanged = (model, cell) => {
                const oldState = this._getAllState();
                if (cell !== null && cell !== undefined) {
                    this._activeCellTrusted = cell.model.trusted;
                }
                else {
                    this._activeCellTrusted = false;
                }
                this._triggerChange(oldState, this._getAllState());
            };
            this._trustedCells = 0;
            this._totalCells = 0;
            this._activeCellTrusted = false;
            this._notebook = null;
            this.notebook = notebook;
        }
        get trustedCells() {
            return this._trustedCells;
        }
        get totalCells() {
            return this._totalCells;
        }
        get activeCellTrusted() {
            return this._activeCellTrusted;
        }
        get notebook() {
            return this._notebook;
        }
        set notebook(model) {
            const oldNotebook = this._notebook;
            if (oldNotebook !== null) {
                oldNotebook.activeCellChanged.disconnect(this._onActiveCellChanged);
                oldNotebook.modelContentChanged.disconnect(this._onModelChanged);
            }
            const oldState = this._getAllState();
            this._notebook = model;
            if (this._notebook === null) {
                this._trustedCells = 0;
                this._totalCells = 0;
                this._activeCellTrusted = false;
            }
            else {
                // Add listeners
                this._notebook.activeCellChanged.connect(this._onActiveCellChanged);
                this._notebook.modelContentChanged.connect(this._onModelChanged);
                // Derive values
                if (this._notebook.activeCell !== undefined) {
                    this._activeCellTrusted = this._notebook.activeCell.model.trusted;
                }
                else {
                    this._activeCellTrusted = false;
                }
                const { total, trusted } = this._deriveCellTrustState(this._notebook.model);
                this._totalCells = total;
                this._trustedCells = trusted;
            }
            this._triggerChange(oldState, this._getAllState());
        }
        _deriveCellTrustState(model) {
            let cells = algorithm_1.toArray(model.cells);
            let trusted = cells.reduce((accum, current) => {
                if (current.trusted) {
                    return accum + 1;
                }
                else {
                    return accum;
                }
            }, 0);
            let total = cells.length;
            return {
                total,
                trusted
            };
        }
        _getAllState() {
            return [
                this._trustedCells,
                this._totalCells,
                this.activeCellTrusted
            ];
        }
        _triggerChange(oldState, newState) {
            if (oldState[0] !== newState[0] ||
                oldState[1] !== newState[1] ||
                oldState[2] !== newState[2]) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    NotebookTrust.Model = Model;
})(NotebookTrust || (NotebookTrust = {}));
// tslint:disable-next-line:variable-name
exports.INotebookTrust = new coreutils_1.Token('@jupyterlab/statusbar:INotebookTrust');
exports.notebookTrustItem = {
    id: '@jupyterlab/statusbar:trusted-notebook-item',
    autoStart: true,
    provides: exports.INotebookTrust,
    requires: [manager_1.IDefaultsManager, notebook_1.INotebookTracker],
    activate: (app, manager, tracker) => {
        const item = new NotebookTrust({ tracker });
        manager.addDefaultStatus('notebook-trust-item', item, {
            align: 'right',
            priority: 3,
            isActive: contexts_1.IStatusContext.delegateActive(app.shell, [{ tracker }])
        });
        return item;
    }
};
