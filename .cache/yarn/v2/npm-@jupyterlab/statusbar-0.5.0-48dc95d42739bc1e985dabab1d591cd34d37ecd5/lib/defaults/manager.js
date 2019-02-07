"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coreutils_1 = require("@phosphor/coreutils");
const coreutils_2 = require("@jupyterlab/coreutils");
const statusBar_1 = require("../statusBar");
const __1 = require("..");
const set_1 = require("../util/set");
const signaling_1 = require("@phosphor/signaling");
const signal_1 = require("../util/signal");
const settings_1 = require("../util/settings");
// tslint:disable-next-line:variable-name
exports.IDefaultsManager = new coreutils_1.Token('@jupyterlab/statusbar:IDefaultStatusesManager');
class DefaultsManager {
    constructor(opts) {
        this._onSettingsUpdated = (connector, change) => {
            let rawEnabledItems = change.newValue !== null ? change.newValue : [];
            let newEnabledItems = new Set(rawEnabledItems);
            let idsToRemove = set_1.SetExt.difference(this._enabledStatusIds, newEnabledItems);
            let idsToAdd = set_1.SetExt.difference(newEnabledItems, this._enabledStatusIds);
            set_1.SetExt.deleteAll(this._enabledStatusIds, [...idsToRemove]);
            set_1.SetExt.addAll(this._enabledStatusIds, [...idsToAdd]);
            [...idsToAdd, ...idsToRemove].forEach(val => {
                const statusItem = this._allDefaultStatusItems.get(val);
                if (statusItem !== undefined) {
                    statusItem.stateChanged.emit(void 0);
                }
            });
        };
        this._allDefaultStatusItems = new Map();
        this._enabledStatusIds = new Set();
        this._isDisposed = false;
        this._statusBar = opts.statusBar;
        this._settingsConnector = new settings_1.SettingsConnector({
            pluginId: __1.STATUSBAR_PLUGIN_ID,
            registry: opts.settings,
            settingKey: 'enabledDefaultItems'
        });
        this._settingsConnector.changed.connect(this._onSettingsUpdated);
    }
    addDefaultStatus(id, item, opts) {
        // Combine settings and provided isActive function
        if (opts.isActive === undefined) {
            opts.isActive = () => {
                return this._enabledStatusIds.has(id);
            };
        }
        else {
            const prevIsActive = opts.isActive;
            opts.isActive = () => {
                return prevIsActive() && this._enabledStatusIds.has(id);
            };
        }
        // Combine stateChanged of settings with provided stateChanged
        const stateChanged = new signal_1.SignalExt.CombinedSignal(this);
        if (opts.stateChanged === undefined) {
            opts.stateChanged = stateChanged;
        }
        else {
            opts.stateChanged = new signal_1.SignalExt.CombinedSignal(this, opts.stateChanged, stateChanged);
        }
        const defaultItem = {
            id,
            item,
            opts,
            stateChanged
        };
        this._statusBar.registerStatusItem(id, item, opts);
        this._allDefaultStatusItems.set(id, defaultItem);
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        signaling_1.Signal.clearData(this);
        this._settingsConnector.dispose();
        this._allDefaultStatusItems.forEach(item => {
            item.stateChanged.dispose();
        });
        this._isDisposed = true;
    }
}
/**
 * Initialization data for the statusbar extension.
 */
exports.defaultsManager = {
    id: '@jupyterlab/statusbar:defaults-manager',
    provides: exports.IDefaultsManager,
    autoStart: true,
    requires: [coreutils_2.ISettingRegistry, statusBar_1.IStatusBar],
    activate: (_app, settings, statusBar) => {
        return new DefaultsManager({ settings, statusBar });
    }
};
