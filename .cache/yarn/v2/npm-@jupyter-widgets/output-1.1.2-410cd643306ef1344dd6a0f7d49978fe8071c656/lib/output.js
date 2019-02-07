"use strict";
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("@jupyter-widgets/base");
exports.OUTPUT_WIDGET_VERSION = '1.0.0';
var OutputModel = /** @class */ (function (_super) {
    __extends(OutputModel, _super);
    function OutputModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OutputModel.prototype.defaults = function () {
        return __assign({}, _super.prototype.defaults.call(this), { _model_name: 'OutputModel', _view_name: 'OutputView', _model_module: '@jupyter-widgets/output', _view_module: '@jupyter-widgets/output', _model_module_version: exports.OUTPUT_WIDGET_VERSION, _view_module_version: exports.OUTPUT_WIDGET_VERSION });
    };
    return OutputModel;
}(base_1.DOMWidgetModel));
exports.OutputModel = OutputModel;
var OutputView = /** @class */ (function (_super) {
    __extends(OutputView, _super);
    function OutputView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OutputView;
}(base_1.DOMWidgetView));
exports.OutputView = OutputView;
