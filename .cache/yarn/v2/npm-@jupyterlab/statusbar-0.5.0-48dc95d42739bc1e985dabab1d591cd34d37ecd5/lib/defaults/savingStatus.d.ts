import { JupyterLabPlugin } from '@jupyterlab/application';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable } from '@phosphor/disposable';
import { ISignal } from '@phosphor/signaling';
import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';
export interface ISavingStatus extends IDisposable {
    readonly model: ISavingStatus.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace ISavingStatus {
    interface IModel {
        readonly status: DocumentRegistry.SaveState;
        readonly widget: Widget | null;
        readonly stateChanged: ISignal<this, void>;
    }
}
export declare const ISavingStatus: Token<ISavingStatus>;
export declare const savingStatusItem: JupyterLabPlugin<ISavingStatus>;
