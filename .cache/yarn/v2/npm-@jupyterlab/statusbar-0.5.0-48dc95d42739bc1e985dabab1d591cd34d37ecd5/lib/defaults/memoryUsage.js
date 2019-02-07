"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display the memory usage of the current process.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const coreutils_1 = require("@phosphor/coreutils");
const manager_1 = require("./manager");
const apputils_1 = require("@jupyterlab/apputils");
const services_1 = require("@jupyterlab/services");
const coreutils_2 = require("@jupyterlab/coreutils");
const component_1 = require("../component");
class MemoryUsage extends apputils_1.VDomRenderer {
    constructor() {
        super();
        this.model = new MemoryUsage.Model({
            refreshRate: 5000
        });
    }
    render() {
        if (this.model === null) {
            return null;
        }
        else {
            let text;
            if (this.model.memoryLimit === null) {
                text = `Mem: ${this.model.currentMemory.toFixed(Private.DECIMAL_PLACES)} ${this.model.units}`;
            }
            else {
                text = `Mem: ${this.model.currentMemory.toFixed(Private.DECIMAL_PLACES)} / ${this.model.memoryLimit.toFixed(Private.DECIMAL_PLACES)} ${this.model.units}`;
            }
            return react_1.default.createElement(component_1.TextItem, { title: "Current memory usage", source: text });
        }
    }
}
(function (MemoryUsage) {
    class Model extends apputils_1.VDomModel {
        constructor({ refreshRate }) {
            super();
            this._makeMetricRequest = () => {
                const requestResult = Private.makeMetricsRequest();
                requestResult
                    .then(response => {
                    if (response.ok) {
                        try {
                            return response.json();
                        }
                        catch (err) {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                })
                    .then(this._updateMetricsValues)
                    .catch(err => {
                    const oldMetricsAvailable = this._metricsAvailable;
                    this._metricsAvailable = false;
                    this._currentMemory = 0;
                    this._memoryLimit = null;
                    this._units = 'B';
                    clearInterval(this._intervalId);
                    if (oldMetricsAvailable) {
                        this.stateChanged.emit(void 0);
                    }
                });
            };
            this._updateMetricsValues = (value) => {
                const oldMetricsAvailable = this._metricsAvailable;
                const oldCurrentMemory = this._currentMemory;
                const oldMemoryLimit = this._memoryLimit;
                const oldUnits = this._units;
                if (value === null) {
                    this._metricsAvailable = false;
                    this._currentMemory = 0;
                    this._memoryLimit = null;
                    this._units = 'B';
                    clearInterval(this._intervalId);
                }
                else {
                    const numBytes = value.rss;
                    const memoryLimit = value.limits.memory
                        ? value.limits.memory.rss
                        : null;
                    const [currentMemory, units] = Private.convertToLargestUnit(numBytes);
                    this._metricsAvailable = true;
                    this._currentMemory = currentMemory;
                    this._units = units;
                    this._memoryLimit = memoryLimit
                        ? memoryLimit / Private.MEMORY_UNIT_LIMITS[units]
                        : null;
                    if (!oldMetricsAvailable) {
                        this._intervalId = setInterval(this._makeMetricRequest, this._refreshRate);
                    }
                }
                if (this._currentMemory !== oldCurrentMemory ||
                    this._units !== oldUnits ||
                    this._memoryLimit !== oldMemoryLimit ||
                    this._metricsAvailable !== oldMetricsAvailable) {
                    this.stateChanged.emit(void 0);
                }
            };
            this._metricsAvailable = false;
            this._currentMemory = 0;
            this._memoryLimit = null;
            this._units = 'B';
            this._refreshRate = refreshRate;
            this._intervalId = setInterval(this._makeMetricRequest, refreshRate);
        }
        get metricsAvailable() {
            return this._metricsAvailable;
        }
        get currentMemory() {
            return this._currentMemory;
        }
        get memoryLimit() {
            return this._memoryLimit;
        }
        get units() {
            return this._units;
        }
        dispose() {
            super.dispose();
            clearInterval(this._intervalId);
        }
    }
    MemoryUsage.Model = Model;
})(MemoryUsage || (MemoryUsage = {}));
var Private;
(function (Private) {
    Private.DECIMAL_PLACES = 2;
    Private.MEMORY_UNIT_LIMITS = {
        B: 0,
        KB: 1024,
        MB: 1048576,
        GB: 1073741824,
        TB: 1099511627776,
        PB: 1125899906842624
    };
    function convertToLargestUnit(numBytes) {
        if (numBytes < Private.MEMORY_UNIT_LIMITS.KB) {
            return [numBytes, 'B'];
        }
        else if (Private.MEMORY_UNIT_LIMITS.KB === numBytes ||
            numBytes < Private.MEMORY_UNIT_LIMITS.MB) {
            return [numBytes / Private.MEMORY_UNIT_LIMITS.KB, 'KB'];
        }
        else if (Private.MEMORY_UNIT_LIMITS.MB === numBytes ||
            numBytes < Private.MEMORY_UNIT_LIMITS.GB) {
            return [numBytes / Private.MEMORY_UNIT_LIMITS.MB, 'MB'];
        }
        else if (Private.MEMORY_UNIT_LIMITS.GB === numBytes ||
            numBytes < Private.MEMORY_UNIT_LIMITS.TB) {
            return [numBytes / Private.MEMORY_UNIT_LIMITS.GB, 'GB'];
        }
        else if (Private.MEMORY_UNIT_LIMITS.TB === numBytes ||
            numBytes < Private.MEMORY_UNIT_LIMITS.PB) {
            return [numBytes / Private.MEMORY_UNIT_LIMITS.TB, 'TB'];
        }
        else {
            return [numBytes / Private.MEMORY_UNIT_LIMITS.PB, 'PB'];
        }
    }
    Private.convertToLargestUnit = convertToLargestUnit;
    const SERVER_CONNECTION_SETTINGS = services_1.ServerConnection.makeSettings();
    const METRIC_URL = coreutils_2.URLExt.join(SERVER_CONNECTION_SETTINGS.baseUrl, 'metrics');
    function makeMetricsRequest() {
        const request = services_1.ServerConnection.makeRequest(METRIC_URL, {}, SERVER_CONNECTION_SETTINGS);
        return request;
    }
    Private.makeMetricsRequest = makeMetricsRequest;
})(Private || (Private = {}));
// tslint:disable-next-line:variable-name
exports.IMemoryUsage = new coreutils_1.Token('@jupyterlab/statusbar:IMemoryUsage');
exports.memoryUsageItem = {
    id: '@jupyterlab/statusbar:memory-usage-item',
    autoStart: true,
    provides: exports.IMemoryUsage,
    requires: [manager_1.IDefaultsManager],
    activate: (app, defaultsManager) => {
        let item = new MemoryUsage();
        defaultsManager.addDefaultStatus('memory-usage-item', item, {
            align: 'left',
            priority: 2,
            isActive: () => item.model.metricsAvailable,
            stateChanged: item.model.stateChanged
        });
        return item;
    }
};
