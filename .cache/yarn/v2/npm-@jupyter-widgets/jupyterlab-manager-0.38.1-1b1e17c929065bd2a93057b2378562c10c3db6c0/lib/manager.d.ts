import * as Backbone from 'backbone';
import { ManagerBase, IClassicComm, IWidgetRegistryData, WidgetModel, WidgetView } from '@jupyter-widgets/base';
import { IDisposable } from '@phosphor/disposable';
import { Widget } from '@phosphor/widgets';
import { RenderMimeRegistry } from '@jupyterlab/rendermime';
import { Session } from '@jupyterlab/services';
import { DocumentRegistry } from '@jupyterlab/docregistry';
export declare class BackboneViewWrapper extends Widget {
    /**
     * Construct a new `Backbone` wrapper widget.
     *
     * @param view - The `Backbone.View` instance being wrapped.
     */
    constructor(view: Backbone.View<any>);
    onAfterAttach(msg: any): void;
    dispose(): void;
    private _view;
}
/**
 * A widget manager that returns phosphor widgets.
 */
export declare class WidgetManager extends ManagerBase<Widget> implements IDisposable {
    constructor(context: DocumentRegistry.IContext<DocumentRegistry.IModel>, rendermime: RenderMimeRegistry);
    /**
     * Register a new kernel
     */
    _handleKernelChanged({ oldValue, newValue }: Session.IKernelChangedArgs): void;
    /**
     * Return a phosphor widget representing the view
     */
    display_view(msg: any, view: Backbone.View<Backbone.Model>, options: any): Promise<Widget>;
    /**
     * Create a comm.
     */
    _create_comm(target_name: string, model_id: string, data?: any, metadata?: any, buffers?: ArrayBuffer[] | ArrayBufferView[]): Promise<IClassicComm>;
    /**
     * Get the currently-registered comms.
     */
    _get_comm_info(): Promise<any>;
    /**
     * Get whether the manager is disposed.
     *
     * #### Notes
     * This is a read-only property.
     */
    readonly isDisposed: boolean;
    /**
     * Dispose the resources held by the manager.
     */
    dispose(): void;
    /**
     * Resolve a URL relative to the current notebook location.
     */
    resolveUrl(url: string): Promise<string>;
    /**
     * Load a class and return a promise to the loaded object.
     */
    protected loadClass(className: string, moduleName: string, moduleVersion: string): Promise<typeof WidgetModel | typeof WidgetView>;
    readonly context: DocumentRegistry.IContext<DocumentRegistry.IModel>;
    readonly rendermime: RenderMimeRegistry;
    register(data: IWidgetRegistryData): void;
    private _handleCommOpen;
    private _context;
    private _registry;
    private _rendermime;
    _commRegistration: IDisposable;
}
