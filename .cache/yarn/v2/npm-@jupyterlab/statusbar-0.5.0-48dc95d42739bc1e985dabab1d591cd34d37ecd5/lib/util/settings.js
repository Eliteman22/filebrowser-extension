"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signaling_1 = require("@phosphor/signaling");
class SettingsConnector {
    constructor(opts) {
        this._onSettingsUpdated = (settings) => {
            let rawSetting = settings.get(this._settingKey).composite;
            if (rawSetting === null) {
                rawSetting = settings.default(this._settingKey);
            }
            const oldValue = this._value;
            this._value = rawSetting;
            this._changed.emit({
                newValue: this._value,
                oldValue
            });
        };
        this._isDisposed = false;
        this._changed = new signaling_1.Signal(this);
        this._settings = null;
        this._value = null;
        this._registry = opts.registry;
        this._pluginId = opts.pluginId;
        this._settingKey = opts.settingKey;
        this._registry
            .load(this._pluginId)
            .then(settings => {
            this._settings = settings;
            settings.changed.connect(this._onSettingsUpdated);
            this._onSettingsUpdated(settings);
        })
            .catch((reason) => {
            console.error(reason.message);
        });
    }
    get pluginId() {
        return this._pluginId;
    }
    get registry() {
        return this._registry;
    }
    get changed() {
        return this._changed;
    }
    get currentValue() {
        return this._value;
    }
    set currentValue(value) {
        if (this._settings) {
            this._settings.set(this._settingKey, value);
        }
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        signaling_1.Signal.clearData(this);
        if (this._settings) {
            this._settings.changed.disconnect(this._onSettingsUpdated);
        }
        this._isDisposed = true;
    }
}
exports.SettingsConnector = SettingsConnector;
