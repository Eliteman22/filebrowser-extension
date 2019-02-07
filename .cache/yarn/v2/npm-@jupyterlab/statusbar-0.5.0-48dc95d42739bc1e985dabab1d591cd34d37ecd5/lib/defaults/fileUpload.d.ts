import { JupyterLabPlugin } from '@jupyterlab/application';
import { FileBrowserModel } from '@jupyterlab/filebrowser';
import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
export interface IFileUpload extends IDisposable {
    readonly model: IFileUpload.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare const IFileUpload: Token<IFileUpload>;
export declare namespace IFileUpload {
    interface IModel {
        readonly items: Array<IFileUpload.IItem>;
        readonly browserModel: FileBrowserModel | null;
    }
    interface IItem {
        path: string;
        progress: number;
        complete: boolean;
    }
}
export declare const fileUploadItem: JupyterLabPlugin<IFileUpload>;
