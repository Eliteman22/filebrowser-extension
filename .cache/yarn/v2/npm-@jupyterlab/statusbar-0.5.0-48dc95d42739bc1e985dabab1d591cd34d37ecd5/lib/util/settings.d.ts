import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { JSONValue } from '@phosphor/coreutils';
export declare class SettingsConnector<I extends JSONValue> implements IDisposable {
    constructor(opts: SettingsConnector.IOptions);
    readonly pluginId: string;
    readonly registry: ISettingRegistry;
    readonly changed: ISignal<this, SettingsConnector.IChangedArgs<I>>;
    currentValue: I | null;
    readonly isDisposed: boolean;
    private _onSettingsUpdated;
    dispose(): void;
    private _isDisposed;
    private _changed;
    private _registry;
    private _settings;
    private _pluginId;
    private _settingKey;
    private _value;
}
export declare namespace SettingsConnector {
    interface IOptions {
        registry: ISettingRegistry;
        pluginId: string;
        settingKey: string;
    }
    interface IChangedArgs<I> {
        newValue: I | null;
        oldValue: I | null;
    }
}
