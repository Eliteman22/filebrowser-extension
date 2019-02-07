"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display and change the line and column number.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const text_1 = require("../component/text");
const notebook_1 = require("@jupyterlab/notebook");
const apputils_1 = require("@jupyterlab/apputils");
const fileeditor_1 = require("@jupyterlab/fileeditor");
const coreutils_1 = require("@phosphor/coreutils");
const contexts_1 = require("../contexts");
const hover_1 = require("../component/hover");
const manager_1 = require("./manager");
const statusBar_1 = require("../style/statusBar");
const lineForm_1 = require("../style/lineForm");
const lib_1 = require("typestyle/lib");
const console_1 = require("@jupyterlab/console");
class LineForm extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: '',
            hasFocus: false
        };
        this._handleChange = (event) => {
            this.setState({ value: event.currentTarget.value });
        };
        this._handleSubmit = (event) => {
            event.preventDefault();
            const value = parseInt(this._textInput.value, 10);
            if (!isNaN(value) &&
                isFinite(value) &&
                1 <= value &&
                value <= this.props.maxLine) {
                this.props.handleSubmit(value);
            }
            return false;
        };
        this._handleFocus = () => {
            this.setState({ hasFocus: true });
        };
        this._handleBlur = () => {
            this.setState({ hasFocus: false });
        };
        this._textInput = null;
    }
    componentDidMount() {
        this._textInput.focus();
    }
    render() {
        return (react_1.default.createElement("div", { className: lineForm_1.lineFormSearch },
            react_1.default.createElement("form", { name: "lineColumnForm", onSubmit: this._handleSubmit, noValidate: true },
                react_1.default.createElement("div", { className: lib_1.classes(lineForm_1.lineFormWrapper, 'p-lineForm-wrapper', this.state.hasFocus
                        ? lineForm_1.lineFormWrapperFocusWithin
                        : undefined) },
                    react_1.default.createElement("input", { type: "text", className: lineForm_1.lineFormInput, onChange: this._handleChange, onFocus: this._handleFocus, onBlur: this._handleBlur, value: this.state.value, ref: input => {
                            this._textInput = input;
                        } }),
                    react_1.default.createElement("input", { type: "submit", className: lib_1.classes(lineForm_1.lineFormButton, 'lineForm-enter-icon'), value: "" })),
                react_1.default.createElement("label", { className: lineForm_1.lineFormCaption },
                    "Go to line number between 1 and ",
                    this.props.maxLine))));
    }
}
// tslint:disable-next-line:variable-name
const LineColComponent = (props) => {
    return (react_1.default.createElement(text_1.TextItem, { onClick: props.handleClick, source: `Ln ${props.line}, Col ${props.column}` }));
};
class LineCol extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._handleClick = () => {
            if (this._popup) {
                this._popup.dispose();
            }
            const body = new apputils_1.ReactElementWidget((react_1.default.createElement(LineForm, { handleSubmit: this._handleSubmit, currentLine: this.model.line, maxLine: this.model.editor.lineCount })));
            this._popup = hover_1.showPopup({
                body: body,
                anchor: this,
                align: 'right'
            });
        };
        this._handleSubmit = (value) => {
            this.model.editor.setCursorPosition({ line: value - 1, column: 0 });
            this._popup.dispose();
            this.model.editor.focus();
        };
        this._onPromptCellCreated = (_console, cell) => {
            this.model.editor = cell.editor;
        };
        this._onActiveCellChange = (_tracker, cell) => {
            this.model.editor = cell && cell.editor;
        };
        this._onMainAreaCurrentChange = (shell, change) => {
            const { newValue, oldValue } = change;
            const editor = this._getFocusedEditor(newValue);
            this.model.editor = editor;
            if (newValue && this._consoleTracker.has(newValue)) {
                newValue.console.promptCellCreated.connect(this._onPromptCellCreated);
            }
            if (oldValue && this._consoleTracker.has(oldValue)) {
                oldValue.console.promptCellCreated.disconnect(this._onPromptCellCreated);
            }
        };
        this._popup = null;
        this._notebookTracker = opts.notebookTracker;
        this._editorTracker = opts.editorTracker;
        this._consoleTracker = opts.consoleTracker;
        this._shell = opts.shell;
        this._notebookTracker.activeCellChanged.connect(this._onActiveCellChange);
        this._shell.currentChanged.connect(this._onMainAreaCurrentChange);
        this.model = new LineCol.Model(this._getFocusedEditor(this._shell.currentWidget));
        this.node.title = 'Go to line number';
        this.addClass(statusBar_1.interactiveItem);
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            return (react_1.default.createElement(LineColComponent, { line: this.model.line, column: this.model.column, handleClick: this._handleClick }));
        }
    }
    dispose() {
        super.dispose();
        this._notebookTracker.activeCellChanged.disconnect(this._onActiveCellChange);
        this._shell.currentChanged.disconnect(this._onMainAreaCurrentChange);
    }
    onUpdateRequest(msg) {
        this.model.editor = this._getFocusedEditor(this._shell.currentWidget);
        super.onUpdateRequest(msg);
    }
    _getFocusedEditor(val) {
        if (val === null) {
            return null;
        }
        else {
            if (this._notebookTracker.has(val)) {
                const activeCell = val.content.activeCell;
                if (activeCell === null) {
                    return null;
                }
                else {
                    return activeCell.editor;
                }
            }
            else if (this._editorTracker.has(val)) {
                return val.content.editor;
            }
            else if (this._consoleTracker.has(val)) {
                const promptCell = val.console.promptCell;
                return promptCell && promptCell.editor;
            }
            else {
                return null;
            }
        }
    }
}
(function (LineCol) {
    class Model extends apputils_1.VDomModel {
        constructor(editor) {
            super();
            this._onSelectionChanged = () => {
                const oldState = this._getAllState();
                const pos = this.editor.getCursorPosition();
                this._line = pos.line + 1;
                this._column = pos.column + 1;
                this._triggerChange(oldState, this._getAllState());
            };
            this._line = 1;
            this._column = 1;
            this._editor = null;
            this.editor = editor;
        }
        get editor() {
            return this._editor;
        }
        set editor(editor) {
            const oldEditor = this._editor;
            if (oldEditor !== null) {
                oldEditor.model.selections.changed.disconnect(this._onSelectionChanged);
            }
            const oldState = this._getAllState();
            this._editor = editor;
            if (this._editor === null) {
                this._column = 1;
                this._line = 1;
            }
            else {
                this._editor.model.selections.changed.connect(this._onSelectionChanged);
                const pos = this._editor.getCursorPosition();
                this._column = pos.column + 1;
                this._line = pos.line + 1;
            }
            this._triggerChange(oldState, this._getAllState());
        }
        get line() {
            return this._line;
        }
        get column() {
            return this._column;
        }
        _getAllState() {
            return [this._line, this._column];
        }
        _triggerChange(oldState, newState) {
            if (oldState[0] !== newState[0] || oldState[1] !== newState[1]) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    LineCol.Model = Model;
})(LineCol || (LineCol = {}));
// tslint:disable-next-line:variable-name
exports.ILineCol = new coreutils_1.Token('@jupyterlab/statusbar:ILineCol');
exports.lineColItem = {
    id: '@jupyterlab/statusbar:line-col-item',
    autoStart: true,
    provides: exports.ILineCol,
    requires: [
        manager_1.IDefaultsManager,
        notebook_1.INotebookTracker,
        fileeditor_1.IEditorTracker,
        console_1.IConsoleTracker
    ],
    activate: (app, defaultsManager, notebookTracker, editorTracker, consoleTracker) => {
        let item = new LineCol({
            shell: app.shell,
            notebookTracker,
            editorTracker,
            consoleTracker
        });
        defaultsManager.addDefaultStatus('line-col-item', item, {
            align: 'right',
            priority: 2,
            isActive: contexts_1.IStatusContext.delegateActive(app.shell, [
                { tracker: notebookTracker },
                { tracker: editorTracker },
                { tracker: consoleTracker }
            ])
        });
        return item;
    }
};
