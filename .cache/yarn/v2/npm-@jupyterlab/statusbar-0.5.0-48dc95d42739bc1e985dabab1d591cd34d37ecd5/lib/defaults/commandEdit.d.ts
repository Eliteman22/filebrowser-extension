import { JupyterLabPlugin } from '@jupyterlab/application';
import { Notebook, NotebookMode } from '@jupyterlab/notebook';
import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
export interface ICommandEdit extends IDisposable {
    readonly model: ICommandEdit.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace ICommandEdit {
    interface IModel {
        readonly notebookMode: NotebookMode;
        readonly notebook: Notebook | null;
    }
}
export declare const ICommandEdit: Token<ICommandEdit>;
export declare const commandEditItem: JupyterLabPlugin<ICommandEdit>;
