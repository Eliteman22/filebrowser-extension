"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widgets_1 = require("@phosphor/widgets");
const apputils_1 = require("@jupyterlab/apputils");
const lineForm_1 = require("../style/lineForm");
const statusBar_1 = require("../style/statusBar");
function showPopup(options) {
    let dialog = new Popup(options);
    dialog.launch();
    return dialog;
}
exports.showPopup = showPopup;
class Popup extends widgets_1.Widget {
    constructor(options) {
        super();
        this._body = options.body;
        this._body.addClass(lineForm_1.hoverItem);
        this._anchor = options.anchor;
        this._align = options.align;
        let layout = (this.layout = new widgets_1.PanelLayout());
        layout.addWidget(options.body);
        this._body.node.addEventListener('resize', () => {
            this.update();
        });
    }
    launch() {
        this.setGeometry();
        widgets_1.Widget.attach(this, document.body);
        this.update();
        this._anchor.addClass(statusBar_1.clickedItem);
        this._anchor.removeClass(statusBar_1.interactiveItem);
    }
    setGeometry() {
        let aligned = 0;
        const anchorRect = this._anchor.node.getBoundingClientRect();
        const bodyRect = this._body.node.getBoundingClientRect();
        if (this._align === 'right') {
            aligned = -(bodyRect.width - anchorRect.width);
        }
        const style = window.getComputedStyle(this._body.node);
        apputils_1.HoverBox.setGeometry({
            anchor: anchorRect,
            host: document.body,
            maxHeight: 500,
            minHeight: 20,
            node: this._body.node,
            offset: {
                horizontal: aligned
            },
            privilege: 'forceAbove',
            style
        });
    }
    onUpdateRequest(msg) {
        this.setGeometry();
        this.setGeometry();
        super.onUpdateRequest(msg);
    }
    onAfterAttach(msg) {
        document.addEventListener('click', this, false);
        this.node.addEventListener('keypress', this, false);
        window.addEventListener('resize', this, false);
    }
    onAfterDetach(msg) {
        document.removeEventListener('click', this, false);
        this.node.removeEventListener('keypress', this, false);
        window.removeEventListener('resize', this, false);
    }
    _evtClick(event) {
        if (!!event.target &&
            !(this._body.node.contains(event.target) ||
                this._anchor.node.contains(event.target))) {
            this.dispose();
        }
    }
    onResize() {
        this.update();
    }
    dispose() {
        super.dispose();
        this._anchor.removeClass(statusBar_1.clickedItem);
        this._anchor.addClass(statusBar_1.interactiveItem);
    }
    _evtKeydown(event) {
        // Check for escape key
        switch (event.keyCode) {
            case 27: // Escape.
                event.stopPropagation();
                event.preventDefault();
                this.dispose();
                break;
            default:
                break;
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case 'keydown':
                this._evtKeydown(event);
                break;
            case 'click':
                this._evtClick(event);
                break;
            case 'resize':
                this.onResize();
                break;
            default:
                break;
        }
    }
}
exports.Popup = Popup;
