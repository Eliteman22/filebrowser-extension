/**
 * Default item to display if a cell is trusted in the notebook.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
import React from 'react';
import { JupyterLabPlugin } from '@jupyterlab/application';
import { INotebookTracker, Notebook } from '@jupyterlab/notebook';
import { VDomRenderer, VDomModel } from '@jupyterlab/apputils';
import { IDisposable } from '@phosphor/disposable';
import { ISignal } from '@phosphor/signaling';
import { Token } from '@phosphor/coreutils';
export declare const cellStatus: (prop: NotebookTrustComponent.IProps | NotebookTrust.Model) => string[];
declare const NotebookTrustComponent: (props: NotebookTrustComponent.IProps) => React.ReactElement<NotebookTrustComponent.IProps>;
declare namespace NotebookTrustComponent {
    interface IProps {
        allCellsTrusted: boolean;
        activeCellTrusted: boolean;
        totalCells: number;
        trustedCells: number;
    }
}
declare class NotebookTrust extends VDomRenderer<NotebookTrust.Model> implements INotebookTrust {
    constructor(opts: NotebookTrust.IOptions);
    private _onNotebookChange;
    render(): JSX.Element | null;
    dispose(): void;
    private _tracker;
}
declare namespace NotebookTrust {
    class Model extends VDomModel implements INotebookTrust.IModel {
        constructor(notebook: Notebook | null);
        readonly trustedCells: number;
        readonly totalCells: number;
        readonly activeCellTrusted: boolean;
        notebook: Notebook | null;
        private _onModelChanged;
        private _onActiveCellChanged;
        private _deriveCellTrustState;
        private _getAllState;
        private _triggerChange;
        private _trustedCells;
        private _totalCells;
        private _activeCellTrusted;
        private _notebook;
    }
    interface IOptions {
        tracker: INotebookTracker;
    }
}
export interface INotebookTrust extends IDisposable {
    readonly model: INotebookTrust.IModel | null;
    readonly modelChanged: ISignal<this, void>;
}
export declare namespace INotebookTrust {
    interface IModel {
        readonly trustedCells: number;
        readonly totalCells: number;
        readonly activeCellTrusted: boolean;
        readonly notebook: Notebook | null;
    }
}
export declare const INotebookTrust: Token<INotebookTrust>;
export declare const notebookTrustItem: JupyterLabPlugin<INotebookTrust>;
export {};
