"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const disposable_1 = require("@phosphor/disposable");
const renderer_1 = require("./renderer");
const manager_1 = require("./manager");
const output_1 = require("./output");
const base = __importStar(require("@jupyter-widgets/base"));
const version_1 = require("@jupyter-widgets/controls/lib/version");
require("@jupyter-widgets/base/css/index.css");
require("@jupyter-widgets/controls/css/widgets-base.css");
const WIDGET_MIMETYPE = 'application/vnd.jupyter.widget-view+json';
class NBWidgetExtension {
    constructor() {
        this._registry = [];
    }
    /**
     * Create a new extension object.
     */
    createNew(nb, context) {
        let wManager = new manager_1.WidgetManager(context, nb.rendermime);
        this._registry.forEach(data => wManager.register(data));
        nb.rendermime.addFactory({
            safe: false,
            mimeTypes: [WIDGET_MIMETYPE],
            createRenderer: (options) => new renderer_1.WidgetRenderer(options, wManager)
        }, 0);
        return new disposable_1.DisposableDelegate(() => {
            if (nb.rendermime) {
                nb.rendermime.removeMimeType(WIDGET_MIMETYPE);
            }
            wManager.dispose();
        });
    }
    /**
     * Register a widget module.
     */
    registerWidget(data) {
        this._registry.push(data);
    }
}
exports.NBWidgetExtension = NBWidgetExtension;
/**
 * The widget manager provider.
 */
const widgetManagerProvider = {
    id: 'jupyter.extensions.nbWidgetManager',
    provides: base.IJupyterWidgetRegistry,
    activate: activateWidgetExtension,
    autoStart: true
};
exports.default = widgetManagerProvider;
/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app) {
    let extension = new NBWidgetExtension();
    extension.registerWidget({
        name: '@jupyter-widgets/base',
        version: base.JUPYTER_WIDGETS_VERSION,
        exports: {
            WidgetModel: base.WidgetModel,
            WidgetView: base.WidgetView,
            DOMWidgetView: base.DOMWidgetView,
            DOMWidgetModel: base.DOMWidgetModel,
            LayoutModel: base.LayoutModel,
            LayoutView: base.LayoutView,
            StyleModel: base.StyleModel,
            StyleView: base.StyleView
        }
    });
    extension.registerWidget({
        name: '@jupyter-widgets/controls',
        version: version_1.JUPYTER_CONTROLS_VERSION,
        exports: () => {
            return new Promise((resolve, reject) => {
                require.ensure(['@jupyter-widgets/controls'], (require) => {
                    resolve(require('@jupyter-widgets/controls'));
                }, (err) => {
                    reject(err);
                }, '@jupyter-widgets/controls');
            });
        }
    });
    extension.registerWidget({
        name: '@jupyter-widgets/output',
        version: output_1.OUTPUT_WIDGET_VERSION,
        exports: { OutputModel: output_1.OutputModel, OutputView: output_1.OutputView }
    });
    app.docRegistry.addWidgetExtension('Notebook', extension);
    return {
        registerWidget(data) {
            extension.registerWidget(data);
        }
    };
}
