import { JupyterLabPlugin } from '@jupyterlab/application';
import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
import { SettingsConnector } from '../util/settings';
export interface ITabSpace extends IDisposable {
    readonly model: ITabSpace.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace ITabSpace {
    interface IModel {
        readonly tabSpace: number;
        readonly settingConnector: SettingsConnector<{
            tabSize: number;
        }> | null;
    }
}
export declare const ITabSpace: Token<ITabSpace>;
export declare const tabSpaceItem: JupyterLabPlugin<ITabSpace>;
