"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var version_1 = require("./version");
var PROTOCOL_MAJOR_VERSION = version_1.PROTOCOL_VERSION.split('.', 1)[0];
/**
 * Manager abstract base class
 */
var ManagerBase = /** @class */ (function () {
    function ManagerBase() {
        /**
         * The comm target name to register
         */
        this.comm_target_name = 'jupyter.widget';
        /**
         * Dictionary of model ids and model instance promises
         */
        this._models = Object.create(null);
    }
    /**
     * Display a view for a particular model.
     */
    ManagerBase.prototype.display_model = function (msg, model, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return this.create_view(model, options).then(function (view) { return _this.display_view(msg, view, options); }).catch(utils.reject('Could not create view', true));
    };
    /**
     * Modifies view options. Generally overloaded in custom widget manager
     * implementations.
     */
    ManagerBase.prototype.setViewOptions = function (options) {
        if (options === void 0) { options = {}; }
        return options;
    };
    /**
     * Creates a promise for a view of a given model
     *
     * Make sure the view creation is not out of order with
     * any state updates.
     */
    ManagerBase.prototype.create_view = function (model, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var viewPromise = model.state_change = model.state_change.then(function () {
            return _this.loadClass(model.get('_view_name'), model.get('_view_module'), model.get('_view_module_version')).then(function (ViewType) {
                var view = new ViewType({
                    model: model,
                    options: _this.setViewOptions(options)
                });
                view.listenTo(model, 'destroy', view.remove);
                return Promise.resolve(view.render()).then(function () { return view; });
            }).catch(utils.reject('Could not create a view for model id ' + model.model_id, true));
        });
        var id = utils.uuid();
        model.views[id] = viewPromise;
        viewPromise.then(function (view) {
            view.once('remove', function () { delete view.model.views[id]; }, _this);
        });
        return model.state_change;
    };
    /**
     * callback handlers specific to a view
     */
    ManagerBase.prototype.callbacks = function (view) {
        return {};
    };
    /**
     * Get a promise for a model by model id.
     */
    ManagerBase.prototype.get_model = function (model_id) {
        // TODO: Perhaps we should return a Promise.reject if the model is not
        // found. Right now this isn't a true async function because it doesn't
        // always return a promise.
        return this._models[model_id];
    };
    /**
     * Handle when a comm is opened.
     */
    ManagerBase.prototype.handle_comm_open = function (comm, msg) {
        var protocolVersion = (msg.metadata || {}).version || '';
        if (protocolVersion.split('.', 1)[0] !== PROTOCOL_MAJOR_VERSION) {
            var error = "Wrong widget protocol version: received protocol version '" + protocolVersion + "', but was expecting major version '" + PROTOCOL_MAJOR_VERSION + "'";
            console.error(error);
            return Promise.reject(error);
        }
        var data = msg.content.data;
        var buffer_paths = data.buffer_paths || [];
        // Make sure the buffers are DataViews
        var buffers = (msg.buffers || []).map(function (b) {
            if (b instanceof DataView) {
                return b;
            }
            else {
                return new DataView(b instanceof ArrayBuffer ? b : b.buffer);
            }
        });
        utils.put_buffers(data.state, buffer_paths, buffers);
        return this.new_model({
            model_name: data.state['_model_name'],
            model_module: data.state['_model_module'],
            model_module_version: data.state['_model_module_version'],
            comm: comm
        }, data.state).catch(utils.reject('Could not create a model.', true));
    };
    /**
     * Create a comm and new widget model.
     * @param  options - same options as new_model but comm is not
     *                          required and additional options are available.
     * @param  serialized_state - serialized model attributes.
     */
    ManagerBase.prototype.new_widget = function (options, serialized_state) {
        var _this = this;
        if (serialized_state === void 0) { serialized_state = {}; }
        var commPromise;
        // we check to make sure the view information is provided, to help catch
        // backwards incompatibility errors.
        if (options.view_name === undefined
            || options.view_module === undefined
            || options.view_module_version === undefined) {
            return Promise.reject('new_widget(...) must be given view information in the options.');
        }
        // If no comm is provided, a new comm is opened for the jupyter.widget
        // target.
        if (options.comm) {
            commPromise = Promise.resolve(options.comm);
        }
        else {
            commPromise = this._create_comm(this.comm_target_name, options.model_id, {
                state: {
                    _model_module: options.model_module,
                    _model_module_version: options.model_module_version,
                    _model_name: options.model_name,
                    _view_module: options.view_module,
                    _view_module_version: options.view_module_version,
                    _view_name: options.view_name
                },
            }, { version: version_1.PROTOCOL_VERSION });
        }
        // The options dictionary is copied since data will be added to it.
        var options_clone = __assign({}, options);
        // Create the model. In the case where the comm promise is rejected a
        // comm-less model is still created with the required model id.
        return commPromise.then(function (comm) {
            // Comm Promise Resolved.
            options_clone.comm = comm;
            var widget_model = _this.new_model(options_clone, serialized_state);
            return widget_model.then(function (model) {
                model.sync('create', model);
                return model;
            });
        }, function () {
            // Comm Promise Rejected.
            if (!options_clone.model_id) {
                options_clone.model_id = utils.uuid();
            }
            return _this.new_model(options_clone, serialized_state);
        });
    };
    ManagerBase.prototype.register_model = function (model_id, modelPromise) {
        var _this = this;
        this._models[model_id] = modelPromise;
        modelPromise.then(function (model) {
            model.once('comm:close', function () {
                delete _this._models[model_id];
            });
        });
    };
    /**
     * Create and return a promise for a new widget model
     *
     * @param options - the options for creating the model.
     * @param serialized_state - attribute values for the model.
     *
     * @example
     * widget_manager.new_model({
     *      model_name: 'IntSlider',
     *      model_module: '@jupyter-widgets/controls',
     *      model_module_version: '1.0.0',
     *      model_id: 'u-u-i-d'
     * }).then((model) => { console.log('Create success!', model); },
     *  (err) => {console.error(err)});
     *
     */
    ManagerBase.prototype.new_model = function (options, serialized_state) {
        if (serialized_state === void 0) { serialized_state = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var model_id, modelPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (options.model_id) {
                            model_id = options.model_id;
                        }
                        else if (options.comm) {
                            model_id = options.model_id = options.comm.comm_id;
                        }
                        else {
                            throw new Error('Neither comm nor model_id provided in options object. At least one must exist.');
                        }
                        modelPromise = this._make_model(options, serialized_state);
                        // this call needs to happen before the first `await`, see note in `set_state`:
                        this.register_model(model_id, modelPromise);
                        return [4 /*yield*/, modelPromise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ManagerBase.prototype._make_model = function (options, serialized_state) {
        if (serialized_state === void 0) { serialized_state = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var model_id, model_promise, ModelType, error_1, attributes, modelOptions, widget_model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model_id = options.model_id;
                        model_promise = this.loadClass(options.model_name, options.model_module, options.model_module_version);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, model_promise];
                    case 2:
                        ModelType = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Could not instantiate widget');
                        throw error_1;
                    case 4:
                        if (!ModelType) {
                            throw new Error("Cannot find model module " + options.model_module + "@" + options.model_module_version + ", " + options.model_name);
                        }
                        return [4 /*yield*/, ModelType._deserialize_state(serialized_state, this)];
                    case 5:
                        attributes = _a.sent();
                        modelOptions = {
                            widget_manager: this,
                            model_id: model_id,
                            comm: options.comm,
                        };
                        widget_model = new ModelType(attributes, modelOptions);
                        widget_model.name = options.model_name;
                        widget_model.module = options.model_module;
                        return [2 /*return*/, widget_model];
                }
            });
        });
    };
    /**
     * Close all widgets and empty the widget state.
     * @return Promise that resolves when the widget state is cleared.
     */
    ManagerBase.prototype.clear_state = function () {
        var _this = this;
        return utils.resolvePromisesDict(this._models).then(function (models) {
            Object.keys(models).forEach(function (id) { return models[id].close(); });
            _this._models = {};
        });
    };
    /**
     * Asynchronously get the state of the widget manager.
     *
     * This includes all of the widget models, and follows the format given in
     * the @jupyter-widgets/schema package.
     *
     * @param options - The options for what state to return.
     * @returns Promise for a state dictionary
     */
    ManagerBase.prototype.get_state = function (options) {
        if (options === void 0) { options = {}; }
        return utils.resolvePromisesDict(this._models).then(function (models) {
            var state = {};
            Object.keys(models).forEach(function (model_id) {
                var model = models[model_id];
                var split = utils.remove_buffers(model.serialize(model.get_state(options.drop_defaults)));
                var buffers = split.buffers.map(function (buffer, index) {
                    return { data: utils.bufferToBase64(buffer), path: split.buffer_paths[index], encoding: 'base64' };
                });
                state[model_id] = {
                    model_name: model.name,
                    model_module: model.module,
                    model_module_version: model.get('_model_module_version'),
                    state: split.state
                };
                // To save space, only include the buffer key if we have buffers
                if (buffers.length > 0) {
                    state[model_id].buffers = buffers;
                }
            });
            return { version_major: 2, version_minor: 0, state: state };
        });
    };
    /**
     * Set the widget manager state.
     *
     * @param state - a Javascript object conforming to the application/vnd.jupyter.widget-state+json spec.
     *
     * Reconstructs all of the widget models in the state, merges that with the
     * current manager state, and then attempts to redisplay the widgets in the
     * state.
     */
    ManagerBase.prototype.set_state = function (state) {
        var _this = this;
        // Check to make sure that it's the same version we are parsing.
        if (!(state.version_major && state.version_major <= 2)) {
            throw 'Unsupported widget state format';
        }
        var models = state.state;
        // Recreate all the widget models for the given widget manager state.
        var all_models = this._get_comm_info().then(function (live_comms) {
            /* Note: It is currently safe to just loop over the models in any order,
               given that the following holds (does at the time of writing):
               1: any call to `new_model` with state registers the model promise (e.g. with `register_model`)
                  synchronously (before it's first `await` statement).
               2: any calls to a model constructor or the `set_state` method on a model,
                  happens asynchronously (in a `then` clause, or after an `await` statement).

              Without these assumptions, one risks trying to set model state with a reference
              to another model that doesn't exist yet!
            */
            return Promise.all(Object.keys(models).map(function (model_id) {
                // First put back the binary buffers
                var decode = { 'base64': utils.base64ToBuffer, 'hex': utils.hexToBuffer };
                var model = models[model_id];
                var modelState = model.state;
                if (model.buffers) {
                    var bufferPaths = model.buffers.map(function (b) { return b.path; });
                    // put_buffers expects buffers to be DataViews
                    var buffers = model.buffers.map(function (b) { return new DataView(decode[b.encoding](b.data)); });
                    utils.put_buffers(model.state, bufferPaths, buffers);
                }
                // If the model has already been created, set its state and then
                // return it.
                if (_this._models[model_id]) {
                    return _this._models[model_id].then(function (model) {
                        // deserialize state
                        return model.constructor._deserialize_state(modelState || {}, _this).then(function (attributes) {
                            model.set_state(attributes); // case 2
                            return model;
                        });
                    });
                }
                var modelCreate = {
                    model_id: model_id,
                    model_name: model.model_name,
                    model_module: model.model_module,
                    model_module_version: model.model_module_version
                };
                if (live_comms.hasOwnProperty(model_id)) { // live comm
                    // This connects to an existing comm if it exists, and
                    // should *not* send a comm open message.
                    return _this._create_comm(_this.comm_target_name, model_id).then(function (comm) {
                        modelCreate.comm = comm;
                        return _this.new_model(modelCreate); // No state, so safe wrt. case 1
                    });
                }
                else {
                    return _this.new_model(modelCreate, modelState); // case 1
                }
            }));
        });
        return all_models;
    };
    /**
     * Disconnect the widget manager from the kernel, setting each model's comm
     * as dead.
     */
    ManagerBase.prototype.disconnect = function () {
        var _this = this;
        Object.keys(this._models).forEach(function (i) {
            _this._models[i].then(function (model) { model.comm_live = false; });
        });
    };
    /**
     * Resolve a URL relative to the current notebook location.
     *
     * The default implementation just returns the original url.
     */
    ManagerBase.prototype.resolveUrl = function (url) {
        return Promise.resolve(url);
    };
    return ManagerBase;
}());
exports.ManagerBase = ManagerBase;
