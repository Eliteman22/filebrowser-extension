import { JupyterLabPlugin } from '@jupyterlab/application';
import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
export interface IRunningSessions extends IDisposable {
    readonly model: IRunningSessions.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace IRunningSessions {
    interface IModel {
        readonly terminals: number;
        readonly kernels: number;
    }
}
export declare const IRunningSessions: Token<IRunningSessions>;
export declare const runningSessionsItem: JupyterLabPlugin<IRunningSessions>;
