import { DOMWidgetView } from '@jupyter-widgets/base';
import { CoreDOMWidgetModel } from './widget_core';
export declare class AudioModel extends CoreDOMWidgetModel {
    defaults(): any;
    static serializers: {
        value: {
            serialize: (value: any, manager: any) => DataView;
        };
    };
}
export declare class AudioView extends DOMWidgetView {
    render(): void;
    update(): void;
    remove(): void;
    /**
     * The default tag name.
     *
     * #### Notes
     * This is a read-only attribute.
     */
    readonly tagName: string;
    el: HTMLAudioElement;
}
