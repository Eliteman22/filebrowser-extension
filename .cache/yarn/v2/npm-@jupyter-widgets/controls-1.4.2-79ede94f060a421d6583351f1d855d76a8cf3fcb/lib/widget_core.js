"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// widget_core implements some common patterns for the core widget collection
// that are not to be used directly by third-party widget authors.
var base_1 = require("@jupyter-widgets/base");
var widget_description_1 = require("./widget_description");
var version_1 = require("./version");
var _ = require("underscore");
var CoreWidgetModel = /** @class */ (function (_super) {
    __extends(CoreWidgetModel, _super);
    function CoreWidgetModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CoreWidgetModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), {
            _model_name: 'CoreWidgetModel',
            _view_module: '@jupyter-widgets/controls',
            _model_module: '@jupyter-widgets/controls',
            _view_module_version: version_1.JUPYTER_CONTROLS_VERSION,
            _model_module_version: version_1.JUPYTER_CONTROLS_VERSION,
        });
    };
    return CoreWidgetModel;
}(base_1.WidgetModel));
exports.CoreWidgetModel = CoreWidgetModel;
var CoreDOMWidgetModel = /** @class */ (function (_super) {
    __extends(CoreDOMWidgetModel, _super);
    function CoreDOMWidgetModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CoreDOMWidgetModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), {
            _model_name: 'CoreDOMWidgetModel',
            _view_module: '@jupyter-widgets/controls',
            _model_module: '@jupyter-widgets/controls',
            _view_module_version: version_1.JUPYTER_CONTROLS_VERSION,
            _model_module_version: version_1.JUPYTER_CONTROLS_VERSION,
        });
    };
    return CoreDOMWidgetModel;
}(base_1.DOMWidgetModel));
exports.CoreDOMWidgetModel = CoreDOMWidgetModel;
var CoreDescriptionModel = /** @class */ (function (_super) {
    __extends(CoreDescriptionModel, _super);
    function CoreDescriptionModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CoreDescriptionModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), {
            _model_name: 'CoreDescriptionModel',
            _view_module: '@jupyter-widgets/controls',
            _model_module: '@jupyter-widgets/controls',
            _view_module_version: version_1.JUPYTER_CONTROLS_VERSION,
            _model_module_version: version_1.JUPYTER_CONTROLS_VERSION,
        });
    };
    return CoreDescriptionModel;
}(widget_description_1.DescriptionModel));
exports.CoreDescriptionModel = CoreDescriptionModel;
