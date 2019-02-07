import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
import { JupyterLabPlugin } from '@jupyterlab/application';
export interface IMemoryUsage extends IDisposable {
    readonly model: IMemoryUsage.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace IMemoryUsage {
    interface IModel {
        readonly metricsAvailable: boolean;
        readonly currentMemory: number;
        readonly memoryLimit: number | null;
        readonly units: string;
    }
}
export declare const IMemoryUsage: Token<IMemoryUsage>;
export declare const memoryUsageItem: JupyterLabPlugin<IMemoryUsage>;
