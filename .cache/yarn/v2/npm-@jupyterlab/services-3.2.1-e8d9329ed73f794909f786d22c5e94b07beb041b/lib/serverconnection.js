"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
Object.defineProperty(exports, "__esModule", { value: true });
const coreutils_1 = require("@jupyterlab/coreutils");
let FETCH;
let HEADERS;
let REQUEST;
let WEBSOCKET;
if (typeof window === 'undefined') {
    // Mangle the require statements so it does not get picked up in the
    // browser assets.
    /* tslint:disable */
    let fetchMod = eval('require')('node-fetch');
    FETCH = global.fetch || fetchMod;
    REQUEST = global.Request || fetchMod.Request;
    HEADERS = global.Headers || fetchMod.Headers;
    WEBSOCKET = global.WebSocket || eval('require')('ws');
    /* tslint:enable */
}
else {
    FETCH = fetch;
    REQUEST = Request;
    HEADERS = Headers;
    WEBSOCKET = WebSocket;
}
/**
 * The namespace for ServerConnection functions.
 *
 * #### Notes
 * This is only intended to manage communication with the Jupyter server.
 *
 * The default values can be used in a JupyterLab or Jupyter Notebook context.
 *
 * We use `token` authentication if available, falling back on an XSRF
 * cookie if one has been provided on the `document`.
 *
 * A content type of `'application/json'` is added when using authentication
 * and there is no body data to allow the server to prevent malicious forms.
 */
var ServerConnection;
(function (ServerConnection) {
    /**
     * Create a settings object given a subset of options.
     *
     * @param options - An optional partial set of options.
     *
     * @returns The full settings object.
     */
    function makeSettings(options) {
        return Private.makeSettings(options);
    }
    ServerConnection.makeSettings = makeSettings;
    /**
     * Make an request to the notebook server.
     *
     * @param url - The url for the request.
     *
     * @param init - The initialization options for the request.
     *
     * @param settings - The server settings to apply to the request.
     *
     * @returns a Promise that resolves with the response.
     *
     * @throws If the url of the request is not a notebook server url.
     *
     * #### Notes
     * The `url` must start with `settings.baseUrl`.  The `init` settings are
     * merged with `settings.init`, with `init` taking precedence.
     * The headers in the two objects are not merged.
     * If there is no body data, we set the content type to `application/json`
     * because it is required by the Notebook server.
     */
    function makeRequest(url, init, settings) {
        return Private.handleRequest(url, init, settings);
    }
    ServerConnection.makeRequest = makeRequest;
    /**
     * A wrapped error for a fetch response.
     */
    class ResponseError extends Error {
        /**
         * Create a new response error.
         */
        constructor(response, message) {
            message =
                message ||
                    `Invalid response: ${response.status} ${response.statusText}`;
            super(message);
            this.response = response;
        }
    }
    ServerConnection.ResponseError = ResponseError;
    /**
     * A wrapped error for a network error.
     */
    class NetworkError extends TypeError {
        /**
         * Create a new network error.
         */
        constructor(original) {
            super(original.message);
            this.stack = original.stack;
        }
    }
    ServerConnection.NetworkError = NetworkError;
    /**
     * The default settings.
     */
    ServerConnection.defaultSettings = {
        baseUrl: coreutils_1.PageConfig.getBaseUrl(),
        pageUrl: coreutils_1.PageConfig.getOption('pageUrl'),
        wsUrl: coreutils_1.PageConfig.getWsUrl(),
        token: coreutils_1.PageConfig.getToken(),
        init: { cache: 'no-store', credentials: 'same-origin' },
        fetch: FETCH,
        Headers: HEADERS,
        Request: REQUEST,
        WebSocket: WEBSOCKET
    };
})(ServerConnection = exports.ServerConnection || (exports.ServerConnection = {}));
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * Handle the server connection settings, returning a new value.
     */
    function makeSettings(options = {}) {
        const defaultSettings = ServerConnection.defaultSettings;
        const baseUrl = coreutils_1.URLExt.normalize(options.baseUrl) || defaultSettings.baseUrl;
        let wsUrl = options.wsUrl;
        // Prefer the default wsUrl if we are using the default baseUrl.
        if (!wsUrl && baseUrl === defaultSettings.baseUrl) {
            wsUrl = defaultSettings.wsUrl;
        }
        // Otherwise convert the baseUrl to a wsUrl if possible.
        if (!wsUrl && baseUrl.indexOf('http') === 0) {
            wsUrl = 'ws' + baseUrl.slice(4);
        }
        // Otherwise fall back on the default wsUrl.
        wsUrl = wsUrl || defaultSettings.wsUrl;
        return Object.assign({}, defaultSettings, options, { wsUrl });
    }
    Private.makeSettings = makeSettings;
    /**
     * Handle a request.
     *
     * @param url - The url for the request.
     *
     * @param init - The overrides for the request init.
     *
     * @param settings - The settings object for the request.
     *
     * #### Notes
     * The `url` must start with `settings.baseUrl`.  The `init` settings
     * take precedence over `settings.init`.
     */
    function handleRequest(url, init, settings) {
        // Handle notebook server requests.
        if (url.indexOf(settings.baseUrl) !== 0) {
            throw new Error('Can only be used for notebook server requests');
        }
        // Use explicit cache buster when `no-store` is set since
        // not all browsers use it properly.
        let cache = init.cache || settings.init.cache;
        if (cache === 'no-store') {
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
            url += (/\?/.test(url) ? '&' : '?') + new Date().getTime();
        }
        let request = new settings.Request(url, Object.assign({}, settings.init, init));
        // Handle authentication.
        let authenticated = false;
        if (settings.token) {
            authenticated = true;
            request.headers.append('Authorization', `token ${settings.token}`);
        }
        else if (typeof document !== 'undefined' && document.cookie) {
            let xsrfToken = getCookie('_xsrf');
            if (xsrfToken !== void 0) {
                authenticated = true;
                request.headers.append('X-XSRFToken', xsrfToken);
            }
        }
        // Set the content type if there is no given data and we are
        // using an authenticated connection.
        if (!request.bodyUsed && authenticated) {
            request.headers.set('Content-Type', 'application/json');
        }
        // Use `call` to avoid a `TypeError` in the browser.
        return settings.fetch.call(null, request).catch((e) => {
            // Convert the TypeError into a more specific error.
            throw new ServerConnection.NetworkError(e);
        });
    }
    Private.handleRequest = handleRequest;
    /**
     * Get a cookie from the document.
     */
    function getCookie(name) {
        // from tornado docs: http://www.tornadoweb.org/en/stable/guide/security.html
        let r = document.cookie.match('\\b' + name + '=([^;]*)\\b');
        return r ? r[1] : void 0;
    }
})(Private || (Private = {}));
