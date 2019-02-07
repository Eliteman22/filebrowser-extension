"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default item to display file upload progress.
 */
/**
 * Part of Jupyterlab status bar defaults.
 */
const react_1 = __importDefault(require("react"));
const text_1 = require("../component/text");
const filebrowser_1 = require("@jupyterlab/filebrowser");
const coreutils_1 = require("@phosphor/coreutils");
const progressBar_1 = require("../component/progressBar");
const apputils_1 = require("@jupyterlab/apputils");
const algorithm_1 = require("@phosphor/algorithm");
const manager_1 = require("./manager");
const group_1 = require("../component/group");
const variables_1 = __importDefault(require("../style/variables"));
// tslint:disable-next-line:variable-name
const FileUploadComponent = (props) => {
    return (react_1.default.createElement(group_1.GroupItem, { spacing: variables_1.default.textIconHalfSpacing },
        react_1.default.createElement(text_1.TextItem, { source: 'Uploading' }),
        react_1.default.createElement(progressBar_1.ProgressBar, { percentage: props.upload })));
};
const UPLOAD_COMPLETE_MESSAGE_MILLIS = 2000;
class FileUpload extends apputils_1.VDomRenderer {
    constructor(opts) {
        super();
        this._onBrowserChange = (tracker, browser) => {
            if (browser === null) {
                this.model.browserModel = null;
            }
            else {
                this.model.browserModel = browser.model;
            }
        };
        this._tracker = opts.tracker;
        this._tracker.currentChanged.connect(this._onBrowserChange);
        this.model = new FileUpload.Model(this._tracker.currentWidget && this._tracker.currentWidget.model);
    }
    render() {
        const uploadPaths = this.model.items;
        if (uploadPaths.length > 0) {
            const item = this.model.items[0];
            if (item.complete) {
                return react_1.default.createElement(text_1.TextItem, { source: "Complete!" });
            }
            else {
                return (react_1.default.createElement(FileUploadComponent, { upload: this.model.items[0].progress }));
            }
        }
        else {
            return react_1.default.createElement(FileUploadComponent, { upload: 100 });
        }
    }
    dispose() {
        super.dispose();
        this._tracker.currentChanged.disconnect(this._onBrowserChange);
    }
}
(function (FileUpload) {
    class Model extends apputils_1.VDomModel {
        constructor(browserModel) {
            super();
            this._uploadChanged = (browse, uploads) => {
                if (uploads.name === 'start') {
                    this._items.push({
                        path: uploads.newValue.path,
                        progress: uploads.newValue.progress * 100,
                        complete: false
                    });
                }
                else if (uploads.name === 'update') {
                    const idx = algorithm_1.ArrayExt.findFirstIndex(this._items, val => val.path === uploads.oldValue.path);
                    if (idx !== -1) {
                        this._items[idx].progress = uploads.newValue.progress * 100;
                    }
                }
                else if (uploads.name === 'finish') {
                    const idx = algorithm_1.ArrayExt.findFirstIndex(this._items, val => val.path === uploads.oldValue.path);
                    if (idx !== -1) {
                        this._items[idx].complete = true;
                        setTimeout(() => {
                            algorithm_1.ArrayExt.removeAt(this._items, idx);
                            this.stateChanged.emit(void 0);
                        }, UPLOAD_COMPLETE_MESSAGE_MILLIS);
                    }
                }
                else if (uploads.name === 'failure') {
                    algorithm_1.ArrayExt.removeFirstWhere(this._items, val => val.path === uploads.newValue.path);
                }
                this.stateChanged.emit(void 0);
            };
            this._items = [];
            this._browserModel = null;
            this.browserModel = browserModel;
        }
        get items() {
            return this._items;
        }
        get browserModel() {
            return this._browserModel;
        }
        set browserModel(browserModel) {
            const oldBrowserModel = this._browserModel;
            if (oldBrowserModel) {
                oldBrowserModel.uploadChanged.disconnect(this._uploadChanged);
            }
            this._browserModel = browserModel;
            this._items = [];
            if (this._browserModel !== null) {
                this._browserModel.uploadChanged.connect(this._uploadChanged);
            }
            this.stateChanged.emit(void 0);
        }
    }
    FileUpload.Model = Model;
})(FileUpload || (FileUpload = {}));
// tslint:disable-next-line:variable-name
exports.IFileUpload = new coreutils_1.Token('@jupyterlab/statusbar:IFileUpload');
exports.fileUploadItem = {
    id: '@jupyterlab/statusbar:file-upload-item',
    autoStart: true,
    provides: exports.IFileUpload,
    requires: [manager_1.IDefaultsManager, filebrowser_1.IFileBrowserFactory],
    activate: (app, manager, browser) => {
        const item = new FileUpload({
            tracker: browser.tracker
        });
        manager.addDefaultStatus('file-upload-item', item, {
            align: 'middle',
            isActive: () => {
                return !!item.model && item.model.items.length > 0;
            },
            stateChanged: item.model.stateChanged
        });
        return item;
    }
};
