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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var widget_core_1 = require("./widget_core");
var base_1 = require("@jupyter-widgets/base");
var _ = require("underscore");
var utils = require("./utils");
var ControllerButtonModel = /** @class */ (function (_super) {
    __extends(ControllerButtonModel, _super);
    function ControllerButtonModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerButtonModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), {
            _model_name: 'ControllerButtonModel',
            _view_name: 'ControllerButtonView',
            value: 0.0,
            pressed: false
        });
    };
    return ControllerButtonModel;
}(widget_core_1.CoreDOMWidgetModel));
exports.ControllerButtonModel = ControllerButtonModel;
/**
 * Very simple view for a gamepad button.
 */
var ControllerButtonView = /** @class */ (function (_super) {
    __extends(ControllerButtonView, _super);
    function ControllerButtonView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerButtonView.prototype.render = function () {
        this.el.classList.add('jupyter-widgets');
        this.el.classList.add('widget-controller-button');
        this.support = document.createElement('div');
        this.support.style.position = 'relative';
        this.support.style.margin = '1px';
        this.support.style.width = '16px';
        this.support.style.height = '16px';
        this.support.style.border = '1px solid black';
        this.support.style.background = 'lightgray';
        this.el.appendChild(this.support);
        this.bar = document.createElement('div');
        this.bar.style.position = 'absolute';
        this.bar.style.width = '100%';
        this.bar.style.bottom = '0px';
        this.bar.style.background = 'gray';
        this.support.appendChild(this.bar);
        this.update();
        this.label = document.createElement('div');
        this.label.textContent = this.model.get('description');
        this.label.style.textAlign = 'center';
        this.el.appendChild(this.label);
    };
    ControllerButtonView.prototype.update = function () {
        this.bar.style.height = (100 * this.model.get('value')) + '%';
    };
    return ControllerButtonView;
}(base_1.DOMWidgetView));
exports.ControllerButtonView = ControllerButtonView;
var ControllerAxisModel = /** @class */ (function (_super) {
    __extends(ControllerAxisModel, _super);
    function ControllerAxisModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerAxisModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), {
            _model_name: 'ControllerAxisModel',
            _view_name: 'ControllerAxisView',
            value: 0.0
        });
    };
    return ControllerAxisModel;
}(widget_core_1.CoreDOMWidgetModel));
exports.ControllerAxisModel = ControllerAxisModel;
/**
 * Very simple view for a gamepad axis.
 */
var ControllerAxisView = /** @class */ (function (_super) {
    __extends(ControllerAxisView, _super);
    function ControllerAxisView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerAxisView.prototype.render = function () {
        this.el.classList.add('jupyter-widgets');
        this.el.classList.add('widget-controller-axis');
        this.el.style.width = '16px';
        this.el.style.padding = '4px';
        this.support = document.createElement('div');
        this.support.style.position = 'relative';
        this.support.style.margin = '1px';
        this.support.style.width = '4px';
        this.support.style.height = '64px';
        this.support.style.border = '1px solid black';
        this.support.style.background = 'lightgray';
        this.bullet = document.createElement('div');
        this.bullet.style.position = 'absolute';
        this.bullet.style.margin = '-4px';
        this.bullet.style.width = '10px';
        this.bullet.style.height = '10px';
        this.bullet.style.background = 'gray';
        this.label = document.createElement('div');
        this.label.textContent = this.model.get('description');
        this.label.style.textAlign = 'center';
        this.support.appendChild(this.bullet);
        this.el.appendChild(this.support);
        this.el.appendChild(this.label);
        this.update();
    };
    ControllerAxisView.prototype.update = function () {
        this.bullet.style.top = (50 * (this.model.get('value') + 1)) + '%';
    };
    return ControllerAxisView;
}(base_1.DOMWidgetView));
exports.ControllerAxisView = ControllerAxisView;
var ControllerModel = /** @class */ (function (_super) {
    __extends(ControllerModel, _super);
    function ControllerModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), {
            _model_name: 'ControllerModel',
            _view_name: 'ControllerView',
            index: 0,
            name: '',
            mapping: '',
            connected: false,
            timestamp: 0,
            buttons: [],
            axes: []
        });
    };
    ControllerModel.prototype.initialize = function (attributes, options) {
        _super.prototype.initialize.call(this, attributes, options);
        if (navigator.getGamepads === void 0) {
            // Checks if the browser supports the gamepad API
            this.readout = 'This browser does not support gamepads.';
            console.error(this.readout);
        }
        else {
            // Start the wait loop, and listen to updates of the only
            // user-provided attribute, the gamepad index.
            this.readout = 'Connect gamepad and press any button.';
            if (this.get('connected')) {
                // No need to re-create Button and Axis widgets, re-use
                // the models provided by the backend which may already
                // be wired to other things.
                this.update_loop();
            }
            else {
                // Wait for a gamepad to be connected.
                this.wait_loop();
            }
        }
    };
    /**
     * Waits for a gamepad to be connected at the provided index.
     * Once one is connected, it will start the update loop, which
     * populates the update of axes and button values.
     */
    ControllerModel.prototype.wait_loop = function () {
        var index = this.get('index');
        var pad = navigator.getGamepads()[index];
        if (pad) {
            var that_1 = this;
            this.setup(pad).then(function (controls) {
                that_1.set(controls);
                that_1.save_changes();
                window.requestAnimationFrame(that_1.update_loop.bind(that_1));
            });
        }
        else {
            window.requestAnimationFrame(this.wait_loop.bind(this));
        }
    };
    /**
     * Given a native gamepad object, returns a promise for a dictionary of
     * controls, of the form
     * {
     *     buttons: list of Button models,
     *     axes: list of Axis models,
     * }
     */
    ControllerModel.prototype.setup = function (pad) {
        // Set up the main gamepad attributes
        this.set({
            name: pad.id,
            mapping: pad.mapping,
            connected: pad.connected,
            timestamp: pad.timestamp
        });
        // Create buttons and axes. When done, start the update loop
        var that = this;
        return utils.resolvePromisesDict({
            buttons: Promise.all(pad.buttons.map(function (btn, index) {
                return that._create_button_model(index);
            })),
            axes: Promise.all(pad.axes.map(function (axis, index) {
                return that._create_axis_model(index);
            })),
        });
    };
    /**
     * Update axes and buttons values, until the gamepad is disconnected.
     * When the gamepad is disconnected, this.reset_gamepad is called.
     */
    ControllerModel.prototype.update_loop = function () {
        var index = this.get('index');
        var id = this.get('name');
        var pad = navigator.getGamepads()[index];
        if (pad && index === pad.index && id === pad.id) {
            this.set({
                timestamp: pad.timestamp,
                connected: pad.connected
            });
            this.save_changes();
            this.get('buttons').forEach(function (model, index) {
                model.set({
                    value: pad.buttons[index].value,
                    pressed: pad.buttons[index].pressed
                });
                model.save_changes();
            });
            this.get('axes').forEach(function (model, index) {
                model.set('value', pad.axes[index]);
                model.save_changes();
            });
            window.requestAnimationFrame(this.update_loop.bind(this));
        }
        else {
            this.reset_gamepad();
        }
    };
    /**
     * Resets the gamepad attributes, and start the wait_loop.
     */
    ControllerModel.prototype.reset_gamepad = function () {
        this.get('buttons').forEach(function (button) {
            button.close();
        });
        this.get('axes').forEach(function (axis) {
            axis.close();
        });
        this.set({
            name: '',
            mapping: '',
            connected: false,
            timestamp: 0.0,
            buttons: [],
            axes: []
        });
        this.save_changes();
        window.requestAnimationFrame(this.wait_loop.bind(this));
    };
    /**
     * Creates a gamepad button widget.
     */
    ControllerModel.prototype._create_button_model = function (index) {
        return this.widget_manager.new_widget({
            model_name: 'ControllerButtonModel',
            model_module: '@jupyter-widgets/controls',
            model_module_version: this.get('_model_module_version'),
            view_name: 'ControllerButtonView',
            view_module: '@jupyter-widgets/controls',
            view_module_version: this.get('_view_module_version'),
        }).then(function (model) {
            model.set('description', index);
            return model;
        });
    };
    /**
     * Creates a gamepad axis widget.
     */
    ControllerModel.prototype._create_axis_model = function (index) {
        return this.widget_manager.new_widget({
            model_name: 'ControllerAxisModel',
            model_module: '@jupyter-widgets/controls',
            model_module_version: this.get('_model_module_version'),
            view_name: 'ControllerAxisView',
            view_module: '@jupyter-widgets/controls',
            view_module_version: this.get('_view_module_version'),
        }).then(function (model) {
            model.set('description', index);
            return model;
        });
    };
    ControllerModel.serializers = __assign({}, widget_core_1.CoreDOMWidgetModel.serializers, { buttons: { deserialize: base_1.unpack_models }, axes: { deserialize: base_1.unpack_models } });
    return ControllerModel;
}(widget_core_1.CoreDOMWidgetModel));
exports.ControllerModel = ControllerModel;
/**
 * A simple view for a gamepad.
 */
var ControllerView = /** @class */ (function (_super) {
    __extends(ControllerView, _super);
    function ControllerView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerView.prototype.initialize = function (parameters) {
        _super.prototype.initialize.call(this, parameters);
        this.button_views = new base_1.ViewList(this.add_button, null, this);
        this.listenTo(this.model, 'change:buttons', function (model, value) {
            this.button_views.update(value);
        });
        this.axis_views = new base_1.ViewList(this.add_axis, null, this);
        this.listenTo(this.model, 'change:axes', function (model, value) {
            this.axis_views.update(value);
        });
        this.listenTo(this.model, 'change:name', this.update_label);
    };
    ControllerView.prototype.render = function () {
        this.el.classList.add('jupyter-widgets');
        this.el.classList.add('widget-controller');
        this.box = this.el;
        this.label = document.createElement('div');
        this.box.appendChild(this.label);
        this.axis_box = document.createElement('div');
        this.axis_box.style.display = 'flex';
        this.box.appendChild(this.axis_box);
        this.button_box = document.createElement('div');
        this.button_box.style.display = 'flex';
        this.box.appendChild(this.button_box);
        this.button_views.update(this.model.get('buttons'));
        this.axis_views.update(this.model.get('axes'));
        this.update_label();
    };
    ControllerView.prototype.update_label = function () {
        this.label.textContent = this.model.get('name') || this.model.readout;
    };
    ControllerView.prototype.add_button = function (model) {
        var that = this;
        var dummy = document.createElement('div');
        that.button_box.appendChild(dummy);
        return this.create_child_view(model).then(function (view) {
            that.button_box.replaceChild(view.el, dummy);
            that.displayed.then(function () {
                view.trigger('displayed', that);
            });
            return view;
        }).catch(utils.reject('Could not add button view', true));
    };
    ControllerView.prototype.add_axis = function (model) {
        var that = this;
        var dummy = document.createElement('div');
        that.axis_box.appendChild(dummy);
        return this.create_child_view(model).then(function (view) {
            that.axis_box.replaceChild(view.el, dummy);
            that.displayed.then(function () {
                view.trigger('displayed', that);
            });
            return view;
        }).catch(utils.reject('Could not add axis view', true));
    };
    ControllerView.prototype.remove = function () {
        _super.prototype.remove.call(this);
        this.button_views.remove();
        this.axis_views.remove();
    };
    return ControllerView;
}(base_1.DOMWidgetView));
exports.ControllerView = ControllerView;
