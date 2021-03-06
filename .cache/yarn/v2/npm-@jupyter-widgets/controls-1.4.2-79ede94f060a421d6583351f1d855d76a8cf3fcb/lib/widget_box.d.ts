import { DOMWidgetView, unpack_models, ViewList, JupyterPhosphorWidget } from '@jupyter-widgets/base';
import { CoreDOMWidgetModel } from './widget_core';
import { Message } from '@phosphor/messaging';
import { Panel } from '@phosphor/widgets';
export declare class JupyterPhosphorPanelWidget extends Panel {
    constructor(options: JupyterPhosphorWidget.IOptions & Panel.IOptions);
    /**
     * Process the phosphor message.
     *
     * Any custom phosphor widget used inside a Jupyter widget should override
     * the processMessage function like this.
     */
    processMessage(msg: Message): void;
    /**
     * Dispose the widget.
     *
     * This causes the view to be destroyed as well with 'remove'
     */
    dispose(): void;
    private _view;
}
export declare class BoxModel extends CoreDOMWidgetModel {
    defaults(): any;
    static serializers: {
        children: {
            deserialize: typeof unpack_models;
        };
    };
}
export declare class HBoxModel extends BoxModel {
    defaults(): any;
}
export declare class VBoxModel extends BoxModel {
    defaults(): any;
}
export declare class BoxView extends DOMWidgetView {
    _createElement(tagName: string): HTMLElement;
    _setElement(el: HTMLElement): void;
    /**
     * Public constructor
     */
    initialize(parameters: any): void;
    /**
     * Called when view is rendered.
     */
    render(): void;
    update_children(): void;
    update_box_style(): void;
    set_box_style(): void;
    add_child_model(model: any): Promise<DOMWidgetView>;
    remove(): void;
    children_views: ViewList<DOMWidgetView>;
    pWidget: JupyterPhosphorPanelWidget;
    static class_map: {
        success: string[];
        info: string[];
        warning: string[];
        danger: string[];
    };
}
export declare class HBoxView extends BoxView {
    /**
     * Public constructor
     */
    initialize(parameters: any): void;
}
export declare class VBoxView extends BoxView {
    /**
     * Public constructor
     */
    initialize(parameters: any): void;
}
export declare class GridBoxView extends BoxView {
    /**
     * Public constructor
     */
    initialize(parameters: any): void;
}
export declare class GridBoxModel extends BoxModel {
    defaults(): any;
}
