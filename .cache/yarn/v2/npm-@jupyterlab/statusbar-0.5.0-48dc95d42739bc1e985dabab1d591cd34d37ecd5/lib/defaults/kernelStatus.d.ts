import { JupyterLabPlugin } from '@jupyterlab/application';
import { IClientSession } from '@jupyterlab/apputils';
import { ISignal } from '@phosphor/signaling';
import { Token } from '@phosphor/coreutils';
import { IDisposable } from '@phosphor/disposable';
import { Kernel } from '@jupyterlab/services';
export interface IKernelStatus extends IDisposable {
    readonly model: IKernelStatus.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace IKernelStatus {
    interface IModel {
        readonly name: string;
        readonly status: Kernel.Status;
        readonly type: string | null;
        readonly session: IClientSession | null;
    }
}
export declare const IKernelStatus: Token<IKernelStatus>;
export declare const kernelStatusItem: JupyterLabPlugin<IKernelStatus>;
