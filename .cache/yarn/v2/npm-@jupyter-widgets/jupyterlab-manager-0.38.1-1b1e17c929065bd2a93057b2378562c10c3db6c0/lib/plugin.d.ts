import { DocumentRegistry } from '@jupyterlab/docregistry';
import { INotebookModel } from '@jupyterlab/notebook';
import { NotebookPanel } from '@jupyterlab/notebook';
import { JupyterLabPlugin } from '@jupyterlab/application';
import { IDisposable } from '@phosphor/disposable';
import * as base from '@jupyter-widgets/base';
import '@jupyter-widgets/base/css/index.css';
import '@jupyter-widgets/controls/css/widgets-base.css';
export declare type INBWidgetExtension = DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>;
export declare class NBWidgetExtension implements INBWidgetExtension {
    /**
     * Create a new extension object.
     */
    createNew(nb: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable;
    /**
     * Register a widget module.
     */
    registerWidget(data: base.IWidgetRegistryData): void;
    private _registry;
}
/**
 * The widget manager provider.
 */
declare const widgetManagerProvider: JupyterLabPlugin<base.IJupyterWidgetRegistry>;
export default widgetManagerProvider;
