"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main status bar object which contains all widgets.
 */
/**
 *
 */
const widgets_1 = require("@phosphor/widgets");
const coreutils_1 = require("@phosphor/coreutils");
const algorithm_1 = require("@phosphor/algorithm");
const statusBar_1 = require("./style/statusBar");
// tslint:disable-next-line:variable-name
exports.IStatusBar = new coreutils_1.Token('@jupyterlab/statusbar:IStatusBar');
const STATUS_BAR_ID = 'jp-main-status-bar';
/**
 * Main status bar object which contains all widgets.
 */
class StatusBar extends widgets_1.Widget {
    constructor(options) {
        super();
        this._onAppShellCurrentChanged = () => {
            this._refreshAll();
        };
        this._onIndividualStateChange = (statusId) => {
            this._refreshItem(this._statusItems[statusId]);
        };
        this._leftRankItems = [];
        this._rightRankItems = [];
        this._statusItems = Object.create(null);
        this._statusIds = [];
        this._host = options.host;
        this.id = STATUS_BAR_ID;
        this.addClass(statusBar_1.statusBar);
        let rootLayout = (this.layout = new widgets_1.PanelLayout());
        let leftPanel = (this._leftSide = new widgets_1.Panel());
        let middlePanel = (this._middlePanel = new widgets_1.Panel());
        let rightPanel = (this._rightSide = new widgets_1.Panel());
        leftPanel.addClass(statusBar_1.side);
        leftPanel.addClass(statusBar_1.leftSide);
        middlePanel.addClass(statusBar_1.side);
        rightPanel.addClass(statusBar_1.side);
        rightPanel.addClass(statusBar_1.rightSide);
        rootLayout.addWidget(leftPanel);
        rootLayout.addWidget(middlePanel);
        rootLayout.addWidget(rightPanel);
        this._host.addToBottomArea(this);
        this._host.currentChanged.connect(this._onAppShellCurrentChanged);
        this._host.restored
            .then(() => {
            this.update();
        })
            .catch(() => {
            console.error(`Failed to refresh statusbar items`);
        });
    }
    registerStatusItem(id, widget, opts = {}) {
        if (id in this._statusItems) {
            throw new Error(`Status item ${id} already registered.`);
        }
        let align = opts.align ? opts.align : 'left';
        let priority = opts.priority !== undefined ? opts.priority : 0;
        let isActive = opts.isActive !== undefined ? opts.isActive : () => true;
        let stateChanged = opts.stateChanged !== undefined ? opts.stateChanged : null;
        let changeCallback = opts.stateChanged !== undefined
            ? () => {
                this._onIndividualStateChange(id);
            }
            : null;
        let wrapper = {
            widget,
            align,
            priority,
            isActive,
            stateChanged,
            changeCallback
        };
        let rankItem = {
            id,
            priority
        };
        widget.addClass(statusBar_1.item);
        this._statusItems[id] = wrapper;
        this._statusIds.push(id);
        if (stateChanged) {
            stateChanged.connect(changeCallback);
        }
        if (align === 'left') {
            let insertIndex = this._findInsertIndex(this._leftRankItems, rankItem);
            if (insertIndex === -1) {
                this._leftSide.addWidget(widget);
                this._leftRankItems.push(rankItem);
            }
            else {
                algorithm_1.ArrayExt.insert(this._leftRankItems, insertIndex, rankItem);
                this._leftSide.insertWidget(insertIndex, widget);
            }
        }
        else if (align === 'right') {
            let insertIndex = this._findInsertIndex(this._rightRankItems, rankItem);
            if (insertIndex === -1) {
                this._rightSide.addWidget(widget);
                this._rightRankItems.push(rankItem);
            }
            else {
                algorithm_1.ArrayExt.insert(this._rightRankItems, insertIndex, rankItem);
                this._rightSide.insertWidget(insertIndex, widget);
            }
        }
        else {
            this._middlePanel.addWidget(widget);
        }
    }
    dispose() {
        super.dispose();
        this._host.currentChanged.disconnect(this._onAppShellCurrentChanged);
        this._statusIds.forEach(id => {
            const { stateChanged, changeCallback, widget } = this._statusItems[id];
            if (stateChanged) {
                stateChanged.disconnect(changeCallback);
            }
            widget.dispose();
        });
    }
    onUpdateRequest(msg) {
        this._statusIds.forEach(statusId => {
            this._statusItems[statusId].widget.update();
        });
        this._refreshAll();
        super.onUpdateRequest(msg);
    }
    _findInsertIndex(side, newItem) {
        return algorithm_1.ArrayExt.findFirstIndex(side, item => item.priority > newItem.priority);
    }
    _refreshItem({ isActive, widget }) {
        if (isActive()) {
            widget.show();
        }
        else {
            widget.hide();
        }
    }
    _refreshAll() {
        this._statusIds.forEach(statusId => {
            this._refreshItem(this._statusItems[statusId]);
        });
    }
}
exports.StatusBar = StatusBar;
