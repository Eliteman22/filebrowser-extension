import { JupyterLabPlugin } from '@jupyterlab/application';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { ISignal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
export interface ILineCol extends IDisposable {
    readonly model: ILineCol.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace ILineCol {
    interface IModel {
        readonly line: number;
        readonly column: number;
        readonly editor: CodeEditor.IEditor | null;
    }
}
export declare const ILineCol: Token<ILineCol>;
export declare const lineColItem: JupyterLabPlugin<ILineCol>;
