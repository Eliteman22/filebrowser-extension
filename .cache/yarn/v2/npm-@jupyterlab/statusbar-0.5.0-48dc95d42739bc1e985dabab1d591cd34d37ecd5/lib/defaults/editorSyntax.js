"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to change the language syntax highlighting of the file editor.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const component_1 = require("../component");
const coreutils_1 = require("@phosphor/coreutils");
const manager_1 = require("./manager");
const fileeditor_1 = require("@jupyterlab/fileeditor");
const contexts_1 = require("../contexts");
const apputils_1 = require("@jupyterlab/apputils");
const codemirror_1 = require("@jupyterlab/codemirror");
const widgets_1 = require("@phosphor/widgets");
const hover_1 = require("../component/hover");
const statusBar_1 = require("../style/statusBar");
// tslint:disable-next-line:variable-name
const EditorSyntaxComponent = (props) => {
    return react_1.default.createElement(component_1.TextItem, { source: props.mode, onClick: props.handleClick });
};
class EditorSyntax extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._handleClick = () => {
            const modeMenu = new widgets_1.Menu({ commands: this._commands });
            let command = 'codemirror:change-mode';
            if (this._popup) {
                this._popup.dispose();
            }
            codemirror_1.Mode.getModeInfo()
                .sort((a, b) => {
                let aName = a.name || '';
                let bName = b.name || '';
                return aName.localeCompare(bName);
            })
                .forEach(spec => {
                if (spec.mode.indexOf('brainf') === 0) {
                    return;
                }
                let args = {
                    insertSpaces: true,
                    name: spec.name
                };
                modeMenu.addItem({
                    command,
                    args
                });
            });
            this._popup = hover_1.showPopup({
                body: modeMenu,
                anchor: this,
                align: 'left'
            });
        };
        this._onEditorChange = (tracker, editor) => {
            this.model.editor = editor && editor.content.editor;
        };
        this._popup = null;
        this._tracker = opts.tracker;
        this._commands = opts.commands;
        this._tracker.currentChanged.connect(this._onEditorChange);
        this.model = new EditorSyntax.Model(this._tracker.currentWidget &&
            this._tracker.currentWidget.content.editor);
        this.addClass(statusBar_1.interactiveItem);
        this.node.title = 'Change text editor syntax highlighting';
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            return (react_1.default.createElement(EditorSyntaxComponent, { mode: this.model.mode, handleClick: this._handleClick }));
        }
    }
    dispose() {
        super.dispose();
        this._tracker.currentChanged.disconnect(this._onEditorChange);
    }
}
(function (EditorSyntax) {
    class Model extends apputils_1.VDomModel {
        constructor(editor) {
            super();
            this._onMIMETypeChange = (mode, change) => {
                const oldState = this._getAllState();
                const spec = codemirror_1.Mode.findByMIME(change.newValue);
                this._mode = spec.name || spec.mode;
                this._triggerChange(oldState, this._getAllState());
            };
            this._mode = '';
            this._editor = null;
            this.editor = editor;
        }
        get mode() {
            return this._mode;
        }
        get editor() {
            return this._editor;
        }
        set editor(editor) {
            const oldEditor = this._editor;
            if (oldEditor !== null) {
                oldEditor.model.mimeTypeChanged.disconnect(this._onMIMETypeChange);
            }
            const oldState = this._getAllState();
            this._editor = editor;
            if (this._editor === null) {
                this._mode = '';
            }
            else {
                const spec = codemirror_1.Mode.findByMIME(this._editor.model.mimeType);
                this._mode = spec.name || spec.mode;
                this._editor.model.mimeTypeChanged.connect(this._onMIMETypeChange);
            }
            this._triggerChange(oldState, this._getAllState());
        }
        _getAllState() {
            return this._mode;
        }
        _triggerChange(oldState, newState) {
            if (oldState !== newState) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    EditorSyntax.Model = Model;
})(EditorSyntax || (EditorSyntax = {}));
// tslint:disable-next-line:variable-name
exports.IEditorSyntax = new coreutils_1.Token('@jupyterlab/statusbar:IEditorSyntax');
exports.editorSyntax = {
    id: '@jupyterlab/statusbar:editor-syntax-item',
    autoStart: true,
    provides: exports.IEditorSyntax,
    requires: [manager_1.IDefaultsManager, fileeditor_1.IEditorTracker],
    activate: (app, manager, tracker) => {
        let item = new EditorSyntax({ tracker, commands: app.commands });
        manager.addDefaultStatus('editor-syntax-item', item, {
            align: 'left',
            priority: 0,
            isActive: contexts_1.IStatusContext.delegateActive(app.shell, [{ tracker }])
        });
        return item;
    }
};
