import { JupyterLabPlugin } from '@jupyterlab/application';
import { IDisposable } from '@phosphor/disposable';
import { ISignal } from '@phosphor/signaling';
import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';
export interface IFilePath extends IDisposable {
    readonly model: IFilePath.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace IFilePath {
    interface IModel {
        readonly path: string;
        readonly name: string;
        readonly widget: Widget | null;
        readonly stateChanged: ISignal<this, void>;
    }
}
export declare const IFilePath: Token<IFilePath>;
export declare const filePathItem: JupyterLabPlugin<IFilePath>;
