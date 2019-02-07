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
const base_1 = require("@jupyter-widgets/base");
const widgets_1 = require("@phosphor/widgets");
const semver_1 = require("semver");
const semvercache_1 = require("./semvercache");
/**
 * The class name added to an BackboneViewWrapper widget.
 */
const BACKBONEVIEWWRAPPER_CLASS = 'jp-BackboneViewWrapper';
class BackboneViewWrapper extends widgets_1.Widget {
    /**
     * Construct a new `Backbone` wrapper widget.
     *
     * @param view - The `Backbone.View` instance being wrapped.
     */
    constructor(view) {
        super();
        this._view = null;
        this._view = view;
        view.on('remove', () => {
            this.dispose();
        });
        this.addClass(BACKBONEVIEWWRAPPER_CLASS);
        this.node.appendChild(view.el);
    }
    onAfterAttach(msg) {
        this._view.trigger('displayed');
    }
    dispose() {
        this._view = null;
        super.dispose();
    }
}
exports.BackboneViewWrapper = BackboneViewWrapper;
/**
 * A widget manager that returns phosphor widgets.
 */
class WidgetManager extends base_1.ManagerBase {
    constructor(context, rendermime) {
        super();
        this._registry = new semvercache_1.SemVerCache();
        this._context = context;
        this._rendermime = rendermime;
        // Set _handleCommOpen so `this` is captured.
        this._handleCommOpen = (comm, msg) => __awaiter(this, void 0, void 0, function* () {
            let oldComm = new base_1.shims.services.Comm(comm);
            yield this.handle_comm_open(oldComm, msg);
        });
        context.session.kernelChanged.connect((sender, args) => {
            this._handleKernelChanged(args);
        });
        if (context.session.kernel) {
            this._handleKernelChanged({ oldValue: null, newValue: context.session.kernel });
        }
    }
    /**
     * Register a new kernel
     */
    _handleKernelChanged({ oldValue, newValue }) {
        if (oldValue) {
            oldValue.removeCommTarget(this.comm_target_name, this._handleCommOpen);
        }
        if (newValue) {
            newValue.registerCommTarget(this.comm_target_name, this._handleCommOpen);
        }
    }
    /**
     * Return a phosphor widget representing the view
     */
    display_view(msg, view, options) {
        let widget = view.pWidget ? view.pWidget : new BackboneViewWrapper(view);
        return Promise.resolve(widget);
    }
    /**
     * Create a comm.
     */
    _create_comm(target_name, model_id, data, metadata, buffers) {
        return __awaiter(this, void 0, void 0, function* () {
            let comm = yield this._context.session.kernel.connectToComm(target_name, model_id);
            if (data || metadata) {
                comm.open(data, metadata, buffers);
            }
            return Promise.resolve(new base_1.shims.services.Comm(comm));
        });
    }
    /**
     * Get the currently-registered comms.
     */
    _get_comm_info() {
        return this._context.session.kernel.requestCommInfo({ target: this.comm_target_name }).then(reply => reply.content.comms);
    }
    /**
     * Get whether the manager is disposed.
     *
     * #### Notes
     * This is a read-only property.
     */
    get isDisposed() {
        return this._context === null;
    }
    /**
     * Dispose the resources held by the manager.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        if (this._commRegistration) {
            this._commRegistration.dispose();
        }
        this._context = null;
    }
    /**
     * Resolve a URL relative to the current notebook location.
     */
    resolveUrl(url) {
        return this.context.urlResolver.resolveUrl(url).then((partial) => {
            return this.context.urlResolver.getDownloadUrl(partial);
        });
    }
    /**
     * Load a class and return a promise to the loaded object.
     */
    loadClass(className, moduleName, moduleVersion) {
        // Special-case the Jupyter base and controls packages. If we have just a
        // plain version, with no indication of the compatible range, prepend a ^ to
        // get all compatible versions. We may eventually apply this logic to all
        // widget modules. See issues #2006 and #2017 for more discussion.
        if ((moduleName === "@jupyter-widgets/base"
            || moduleName === "@jupyter-widgets/controls")
            && semver_1.valid(moduleVersion)) {
            moduleVersion = `^${moduleVersion}`;
        }
        let mod = this._registry.get(moduleName, moduleVersion);
        if (!mod) {
            return Promise.reject(`Module ${moduleName}, semver range ${moduleVersion} is not registered as a widget module`);
        }
        let modPromise;
        if (typeof mod === 'function') {
            modPromise = Promise.resolve(mod());
        }
        else {
            modPromise = Promise.resolve(mod);
        }
        return modPromise.then((mod) => {
            let cls = mod[className];
            if (!cls) {
                return Promise.reject(`Class ${className} not found in module ${moduleName}`);
            }
            return cls;
        });
    }
    get context() {
        return this._context;
    }
    get rendermime() {
        return this._rendermime;
    }
    register(data) {
        this._registry.set(data.name, data.version, data.exports);
    }
}
exports.WidgetManager = WidgetManager;
