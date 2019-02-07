"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const widgets_1 = require("@phosphor/widgets");
/**
 * A renderer for widgets.
 */
class WidgetRenderer extends widgets_1.Panel {
    constructor(options, manager) {
        super();
        this.mimeType = options.mimeType;
        this._manager = manager;
    }
    renderModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = model.data[this.mimeType];
            // If there is no model id, the view was removed, so hide the node.
            if (source.model_id === '') {
                this.hide();
                return Promise.resolve();
            }
            const modelPromise = this._manager.get_model(source.model_id);
            if (modelPromise) {
                try {
                    let wModel = yield modelPromise;
                    let widget = yield this._manager.display_model(void 0, wModel, void 0);
                    this.addWidget(widget);
                    // If the widget is disposed, hide this container and make sure we
                    // change the output model to reflect the view was closed.
                    widget.disposed.connect(() => {
                        this.hide();
                        source.model_id = '';
                    });
                }
                catch (err) {
                    console.log('Error displaying widget');
                    console.log(err);
                    this.node.textContent = 'Error displaying widget';
                    this.addClass('jupyter-widgets');
                }
            }
            else {
                this.node.textContent = 'Error creating widget: could not find model';
                this.addClass('jupyter-widgets');
                return Promise.resolve();
            }
        });
    }
    /**
     * Get whether the manager is disposed.
     *
     * #### Notes
     * This is a read-only property.
     */
    get isDisposed() {
        return this._manager === null;
    }
    /**
     * Dispose the resources held by the manager.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        super.dispose();
        this._manager = null;
    }
}
exports.WidgetRenderer = WidgetRenderer;
