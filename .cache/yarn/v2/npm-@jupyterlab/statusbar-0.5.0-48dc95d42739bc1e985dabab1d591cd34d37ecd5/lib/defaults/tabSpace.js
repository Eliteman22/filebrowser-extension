"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to change the tab spacing for the active document.
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
const manager_1 = require("./manager");
const contexts_1 = require("../contexts");
const widgets_1 = require("@phosphor/widgets");
const hover_1 = require("../component/hover");
const statusBar_1 = require("../style/statusBar");
const console_1 = require("@jupyterlab/console");
const coreutils_2 = require("@jupyterlab/coreutils");
const settings_1 = require("../util/settings");
// tslint:disable-next-line:variable-name
const TabSpaceComponent = (props) => {
    const description = props.isSpaces ? 'Spaces' : 'Tab Size';
    return (react_1.default.createElement(text_1.TextItem, { onClick: props.handleClick, source: `${description}: ${props.tabSpace}` }));
};
class TabSpace extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._handleClick = () => {
            const provider = this._getFocusedSettingProvider(this._shell.currentWidget);
            if (!provider) {
                return;
            }
            const { menu } = this._settingsProviderData[provider];
            menu.aboutToClose.connect(this._menuClosed);
            if (this._popup) {
                this._popup.dispose();
            }
            this._popup = hover_1.showPopup({
                body: menu,
                anchor: this,
                align: 'right'
            });
            menu.aboutToClose.connect(this._onClickMenuDispose);
        };
        this._onClickMenuDispose = (sender) => {
            sender.node.focus();
            this._popup.dispose();
            sender.aboutToClose.connect(this._onClickMenuDispose);
        };
        this._menuClosed = () => {
            this.removeClass(statusBar_1.clickedItem);
        };
        this._onActiveCellChange = (_tracker, cell) => {
            let settingsConnector;
            if (cell !== null) {
                if (cell.model.type === 'code') {
                    settingsConnector = this._settingsProviderData['notebookCode']
                        .connector;
                }
                else if (cell.model.type === 'raw') {
                    settingsConnector = this._settingsProviderData['notebookRaw']
                        .connector;
                }
                else {
                    settingsConnector = null;
                }
            }
            else {
                settingsConnector = this._settingsProviderData['notebookMarkdown']
                    .connector;
            }
            this.model.settingConnector = settingsConnector;
        };
        this._onMainAreaCurrentChange = (shell, change) => {
            const { newValue } = change;
            const provider = this._getFocusedSettingProvider(newValue);
            this.model.settingConnector =
                provider && this._settingsProviderData[provider].connector;
        };
        this._popup = null;
        this._notebookTracker = opts.notebookTracker;
        this._editorTracker = opts.editorTracker;
        this._consoleTracker = opts.consoleTracker;
        this._shell = opts.shell;
        this._settingsProviderData = opts.settingsProviderData;
        this._notebookTracker.activeCellChanged.connect(this._onActiveCellChange);
        this._shell.currentChanged.connect(this._onMainAreaCurrentChange);
        const provider = this._getFocusedSettingProvider(this._shell.currentWidget);
        this.model = new TabSpace.Model(provider && this._settingsProviderData[provider].connector);
        this.node.title = 'Change tab spacing';
        this.addClass(statusBar_1.interactiveItem);
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            const provider = this._getFocusedSettingProvider(this._shell.currentWidget);
            const currentValue = provider &&
                this._settingsProviderData[provider].connector.currentValue;
            if (!currentValue) {
                return null;
            }
            return (react_1.default.createElement(TabSpaceComponent, { isSpaces: currentValue.insertSpaces, tabSpace: this.model.tabSpace, handleClick: this._handleClick }));
        }
    }
    dispose() {
        super.dispose();
        this._notebookTracker.activeCellChanged.disconnect(this._onActiveCellChange);
        this._shell.currentChanged.disconnect(this._onMainAreaCurrentChange);
    }
    onUpdateRequest(msg) {
        const provider = this._getFocusedSettingProvider(this._shell.currentWidget);
        this.model.settingConnector =
            provider && this._settingsProviderData[provider].connector;
        super.onUpdateRequest(msg);
    }
    _getFocusedSettingProvider(val) {
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
                    if (activeCell.model.type === 'code') {
                        return 'notebookCode';
                    }
                    else if (activeCell.model.type === 'raw') {
                        return 'notebookRaw';
                    }
                    else {
                        return 'notebookMarkdown';
                    }
                }
            }
            else if (this._editorTracker.has(val)) {
                return 'editor';
            }
            else if (this._consoleTracker.has(val)) {
                const prompt = val.console.promptCell;
                if (prompt !== null) {
                    return 'notebookCode';
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
    }
}
var Private;
(function (Private) {
    function initNotebookConnectorAndMenu(app, settings, pluginId, settingKey, commandId, tracker) {
        const connector = new settings_1.SettingsConnector({
            registry: settings,
            pluginId,
            settingKey
        });
        app.commands.addCommand(commandId, {
            label: args => args['name'],
            execute: args => {
                connector.currentValue = {
                    tabSize: args['size'] || 4,
                    insertSpaces: !!args['insertSpaces']
                };
            },
            isEnabled: contexts_1.IStatusContext.delegateActive(app.shell, [{ tracker }]),
            isToggled: args => {
                const insertSpaces = !!args['insertSpaces'];
                const size = args['size'] || 4;
                const { currentValue } = connector;
                return (!!currentValue &&
                    currentValue.insertSpaces === insertSpaces &&
                    currentValue.tabSize === size);
            }
        });
        const menu = new widgets_1.Menu({ commands: app.commands });
        const args = {
            insertSpaces: false,
            size: 4,
            name: 'Indent with Tab'
        };
        menu.addItem({ command: commandId, args });
        for (let size of [1, 2, 4, 8]) {
            let args = {
                insertSpaces: true,
                size,
                name: `Spaces: ${size}`
            };
            menu.addItem({ command: commandId, args });
        }
        return [connector, menu];
    }
    Private.initNotebookConnectorAndMenu = initNotebookConnectorAndMenu;
})(Private || (Private = {}));
(function (TabSpace) {
    class Model extends apputils_1.VDomModel {
        constructor(settingConnector) {
            super();
            this._onTabSizeChanged = () => {
                const oldTabSpace = this._tabSpace;
                const currentValue = this.settingConnector.currentValue;
                if (currentValue && currentValue.tabSize) {
                    this._tabSpace = currentValue.tabSize;
                }
                else {
                    this._tabSpace = 4;
                }
                this._triggerChange(oldTabSpace, this._tabSpace);
            };
            this._tabSpace = 4;
            this._settingConnector = null;
            this.settingConnector = settingConnector;
        }
        get settingConnector() {
            return this._settingConnector;
        }
        set settingConnector(settingConnector) {
            const oldTabSpace = this._tabSpace;
            const oldSettingConnector = this._settingConnector;
            if (oldSettingConnector !== null) {
                oldSettingConnector.changed.disconnect(this._onTabSizeChanged);
            }
            this._settingConnector = settingConnector;
            if (this._settingConnector === null) {
                this._tabSpace = 4;
            }
            else {
                this._settingConnector.changed.connect(this._onTabSizeChanged);
                this._tabSpace = this._settingConnector.currentValue.tabSize;
            }
            if ((oldSettingConnector === null &&
                this._settingConnector !== null) ||
                (oldSettingConnector !== null &&
                    this._settingConnector === null)) {
                this.stateChanged.emit(void 0);
            }
            else {
                this._triggerChange(oldTabSpace, this._tabSpace);
            }
        }
        get tabSpace() {
            return this._tabSpace;
        }
        _triggerChange(oldValue, newValue) {
            if (oldValue !== newValue) {
                this.stateChanged.emit(void 0);
            }
        }
    }
    TabSpace.Model = Model;
})(TabSpace || (TabSpace = {}));
// tslint:disable-next-line:variable-name
exports.ITabSpace = new coreutils_1.Token('@jupyterlab/statusbar:ITabSpace');
exports.tabSpaceItem = {
    id: '@jupyterlab/statusbar:tab-space-item',
    autoStart: true,
    provides: exports.ITabSpace,
    requires: [
        manager_1.IDefaultsManager,
        notebook_1.INotebookTracker,
        fileeditor_1.IEditorTracker,
        console_1.IConsoleTracker,
        coreutils_2.ISettingRegistry
    ],
    activate: (app, defaultsManager, notebookTracker, editorTracker, consoleTracker, settings) => {
        const [notebookMarkdownConnector, markdownMenu] = Private.initNotebookConnectorAndMenu(app, settings, '@jupyterlab/notebook-extension:tracker', 'markdownCellConfig', CommandIDs.changeTabsNotebookMarkdown, notebookTracker);
        const [notebookCodeConnector, codeMenu] = Private.initNotebookConnectorAndMenu(app, settings, '@jupyterlab/notebook-extension:tracker', 'codeCellConfig', CommandIDs.changeTabsNotebookCode, notebookTracker);
        const [notebookRawConnector, rawMenu] = Private.initNotebookConnectorAndMenu(app, settings, '@jupyterlab/notebook-extension:tracker', 'rawCellConfig', CommandIDs.changeTabsNotebookRaw, notebookTracker);
        const editorConnector = new settings_1.SettingsConnector({
            registry: settings,
            pluginId: '@jupyterlab/fileeditor-extension:plugin',
            settingKey: 'editorConfig'
        });
        const editorMenu = new widgets_1.Menu({ commands: app.commands });
        editorMenu.addClass('p-Menu');
        const args = {
            insertSpaces: false,
            size: 4,
            name: 'Indent with Tab'
        };
        editorMenu.addItem({ command: CommandIDs.changeTabsEditor, args });
        for (let size of [1, 2, 4, 8]) {
            let args = {
                insertSpaces: true,
                size,
                name: `Spaces: ${size}`
            };
            editorMenu.addItem({ command: CommandIDs.changeTabsEditor, args });
        }
        const settingsProviderData = {
            notebookCode: {
                connector: notebookCodeConnector,
                menu: codeMenu
            },
            notebookMarkdown: {
                connector: notebookMarkdownConnector,
                menu: markdownMenu
            },
            notebookRaw: {
                connector: notebookRawConnector,
                menu: rawMenu
            },
            editor: {
                connector: editorConnector,
                menu: editorMenu
            }
        };
        const item = new TabSpace({
            shell: app.shell,
            notebookTracker,
            editorTracker,
            consoleTracker,
            commands: app.commands,
            settings,
            settingsProviderData
        });
        defaultsManager.addDefaultStatus('tab-space-item', item, {
            align: 'right',
            priority: 1,
            isActive: contexts_1.IStatusContext.delegateActive(app.shell, [
                { tracker: notebookTracker },
                { tracker: editorTracker },
                { tracker: consoleTracker }
            ])
        });
        return item;
    }
};
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.changeTabsNotebookMarkdown = 'notebook:markdown-change-tabs';
    CommandIDs.changeTabsNotebookCode = 'notebook:code-change-tabs';
    CommandIDs.changeTabsNotebookRaw = 'notebook:raw-change-tabs';
    CommandIDs.changeTabsEditor = 'fileeditor:change-tabs';
})(CommandIDs || (CommandIDs = {}));
