import * as managerBase from './manager-base';
import * as Backbone from 'backbone';
import { NativeView } from './nativeview';
import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import { IClassicComm } from './services-shim';
/**
 * Replace model ids with models recursively.
 */
export declare function unpack_models(value: any, manager: any): Promise<any>;
/**
 * Type declaration for general widget serializers.
 */
export interface ISerializers {
    [key: string]: {
        deserialize?: (value?: any, manager?: managerBase.ManagerBase<any>) => any;
        serialize?: (value?: any, widget?: WidgetModel) => any;
    };
}
export declare class WidgetModel extends Backbone.Model {
    /**
     * The default attributes.
     */
    defaults(): {
        _model_module: string;
        _model_name: string;
        _model_module_version: string;
        _view_module: string;
        _view_name: any;
        _view_module_version: string;
        _view_count: any;
    };
    /**
     * Test to see if the model has been synced with the server.
     *
     * #### Notes
     * As of backbone 1.1, backbone ignores `patch` if it thinks the
     * model has never been pushed.
     */
    isNew(): boolean;
    /**
     * Constructor
     *
     * Initializes a WidgetModel instance. Called by the Backbone constructor.
     *
     * Parameters
     * ----------
     * widget_manager : WidgetManager instance
     * model_id : string
     *      An ID unique to this model.
     * comm : Comm instance (optional)
     */
    initialize(attributes: any, options: {
        model_id: string;
        comm?: any;
        widget_manager: any;
    }): void;
    comm_live: boolean;
    /**
     * Send a custom msg over the comm.
     */
    send(content: any, callbacks: any, buffers?: any): void;
    /**
     * Close model
     *
     * @param comm_closed - true if the comm is already being closed. If false, the comm will be closed.
     *
     * @returns - a promise that is fulfilled when all the associated views have been removed.
     */
    close(comm_closed?: boolean): Promise<void>;
    /**
     * Handle when a widget comm is closed.
     */
    _handle_comm_closed(msg: any): void;
    /**
     * Handle incoming comm msg.
     */
    _handle_comm_msg(msg: any): Promise<void>;
    /**
     * Handle when a widget is updated from the backend.
     *
     * This function is meant for internal use only. Values set here will not be propagated on a sync.
     */
    set_state(state: any): void;
    /**
     * Get the serializable state of the model.
     *
     * If drop_default is truthy, attributes that are equal to their default
     * values are dropped.
     */
    get_state(drop_defaults: any): any;
    /**
     * Handle status msgs.
     *
     * execution_state : ('busy', 'idle', 'starting')
     */
    _handle_status(msg: any): void;
    /**
     * Create msg callbacks for a comm msg.
     */
    callbacks(view?: WidgetView): {};
    /**
     * Set one or more values.
     *
     * We just call the super method, in which val and options are optional.
     * Handles both "key", value and {key: value} -style arguments.
     */
    set(key: any, val?: any, options?: any): any;
    /**
     * Handle sync to the back-end.  Called when a model.save() is called.
     *
     * Make sure a comm exists.
     *
     * Parameters
     * ----------
     * method : create, update, patch, delete, read
     *   create/update always send the full attribute set
     *   patch - only send attributes listed in options.attrs, and if we
     *   are queuing up messages, combine with previous messages that have
     *   not been sent yet
     * model : the model we are syncing
     *   will normally be the same as `this`
     * options : dict
     *   the `attrs` key, if it exists, gives an {attr: value} dict that
     *   should be synced, otherwise, sync all attributes.
     *
     */
    sync(method: string, model: WidgetModel, options?: any): any;
    /**
     * Serialize widget state.
     *
     * A serializer is a function which takes in a state attribute and a widget,
     * and synchronously returns a JSONable object. The returned object will
     * have toJSON called if possible, and the final result should be a
     * primitive object that is a snapshot of the widget state that may have
     * binary array buffers.
     */
    serialize(state: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    /**
     * Send a sync message to the kernel.
     */
    send_sync_message(state: any, callbacks?: any): void;
    /**
     * Push this model's state to the back-end
     *
     * This invokes a Backbone.Sync.
     */
    save_changes(callbacks?: any): void;
    /**
     * on_some_change(['key1', 'key2'], foo, context) differs from
     * on('change:key1 change:key2', foo, context).
     * If the widget attributes key1 and key2 are both modified,
     * the second form will result in foo being called twice
     * while the first will call foo only once.
     */
    on_some_change(keys: any, callback: any, context: any): void;
    /**
     * Serialize the model.  See the deserialization function at the top of this file
     * and the kernel-side serializer/deserializer.
     */
    toJSON(options: any): string;
    /**
     * Returns a promise for the deserialized state. The second argument
     * is an instance of widget manager, which is required for the
     * deserialization of widget models.
     */
    static _deserialize_state(state: any, manager: any): Promise<any>;
    static serializers: ISerializers;
    widget_manager: managerBase.ManagerBase<any>;
    model_id: string;
    views: {
        [key: string]: Promise<WidgetView>;
    };
    state_change: Promise<any>;
    comm: IClassicComm;
    name: string;
    module: string;
    private _comm_live;
    private _closed;
    private _state_lock;
    private _buffered_state_diff;
    private _msg_buffer;
    private _msg_buffer_callbacks;
    private _pending_msgs;
}
export declare class DOMWidgetModel extends WidgetModel {
    static serializers: ISerializers;
    defaults(): any;
}
export declare class WidgetView extends NativeView<WidgetModel> {
    /**
     * Public constructor.
     */
    constructor(options?: Backbone.ViewOptions<WidgetModel> & {
        options?: any;
    });
    /**
     * Initializer, called at the end of the constructor.
     */
    initialize(parameters: any): void;
    /**
     * Triggered on model change.
     *
     * Update view to be consistent with this.model
     */
    update(options?: any): void;
    /**
     * Render a view
     *
     * @returns the view or a promise to the view.
     */
    render(): any;
    /**
     * Create and promise that resolves to a child view of a given model
     */
    create_child_view(child_model: any, options?: {}): Promise<WidgetView>;
    /**
     * Create msg callbacks for a comm msg.
     */
    callbacks(): {};
    /**
     * Send a custom msg associated with this view.
     */
    send(content: any, buffers?: any): void;
    touch(): void;
    remove(): any;
    options: any;
    /**
     * A promise that resolves to the parent view when a child view is displayed.
     */
    displayed: Promise<WidgetView>;
}
export declare namespace JupyterPhosphorWidget {
    interface IOptions {
        view: DOMWidgetView;
    }
}
export declare class JupyterPhosphorWidget extends Widget {
    constructor(options: Widget.IOptions & JupyterPhosphorWidget.IOptions);
    /**
     * Dispose the widget.
     *
     * This causes the view to be destroyed as well with 'remove'
     */
    dispose(): void;
    /**
     * Process the phosphor message.
     *
     * Any custom phosphor widget used inside a Jupyter widget should override
     * the processMessage function like this.
     */
    processMessage(msg: Message): void;
    private _view;
}
export declare class DOMWidgetView extends WidgetView {
    /**
     * Public constructor
     */
    initialize(parameters: any): void;
    setLayout(layout: any, oldLayout?: any): void;
    setStyle(style: any, oldStyle?: any): void;
    /**
     * Update the DOM classes applied to an element, default to this.el.
     */
    update_classes(old_classes: any, new_classes: any, el?: any): void;
    /**
     * Update the DOM classes applied to the widget based on a single
     * trait's value.
     *
     * Given a trait value classes map, this function automatically
     * handles applying the appropriate classes to the widget element
     * and removing classes that are no longer valid.
     *
     * Parameters
     * ----------
     * class_map: dictionary
     *  Dictionary of trait values to class lists.
     *  Example:
     *      {
     *          success: ['alert', 'alert-success'],
     *          info: ['alert', 'alert-info'],
     *          warning: ['alert', 'alert-warning'],
     *          danger: ['alert', 'alert-danger']
     *      };
     * trait_name: string
     *  Name of the trait to check the value of.
     * el: optional DOM element handle, defaults to this.el
     *  Element that the classes are applied to.
     */
    update_mapped_classes(class_map: any, trait_name: any, el?: any): void;
    set_mapped_classes(class_map: any, trait_name: any, el?: any): void;
    _setElement(el: HTMLElement): void;
    remove(): any;
    processPhosphorMessage(msg: Message): void;
    private _comm_live_update;
    '$el': any;
    pWidget: Widget;
    layoutPromise: Promise<any>;
    stylePromise: Promise<any>;
}
