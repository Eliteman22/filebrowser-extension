import { ISignal } from '@phosphor/signaling';
import { Token } from '@phosphor/coreutils';
import { JupyterLabPlugin } from '@jupyterlab/application';
import { CodeEditor } from '@jupyterlab/codeeditor';
export interface IEditorSyntax {
    readonly model: IEditorSyntax.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace IEditorSyntax {
    interface IModel {
        readonly mode: string;
        readonly editor: CodeEditor.IEditor | null;
    }
}
export declare const IEditorSyntax: Token<IEditorSyntax>;
export declare const editorSyntax: JupyterLabPlugin<IEditorSyntax>;
