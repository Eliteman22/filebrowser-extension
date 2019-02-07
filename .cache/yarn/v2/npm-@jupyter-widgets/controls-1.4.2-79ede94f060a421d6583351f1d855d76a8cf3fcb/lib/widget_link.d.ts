import { WidgetModel, unpack_models } from '@jupyter-widgets/base';
import { CoreWidgetModel } from './widget_core';
export declare class DirectionalLinkModel extends CoreWidgetModel {
    static serializers: {
        target: {
            deserialize: typeof unpack_models;
        };
        source: {
            deserialize: typeof unpack_models;
        };
    };
    defaults(): any;
    initialize(attributes: any, options: any): void;
    updateValue(sourceModel: any, sourceAttr: any, targetModel: any, targetAttr: any): void;
    updateBindings(): void;
    cleanup(): void;
    sourceModel: WidgetModel;
    sourceAttr: string;
    targetModel: WidgetModel;
    targetAttr: string;
    private _updating;
}
export declare class LinkModel extends DirectionalLinkModel {
    defaults(): any;
    updateBindings(): void;
    cleanup(): void;
}
