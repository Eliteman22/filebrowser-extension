"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signaling_1 = require("@phosphor/signaling");
var SignalExt;
(function (SignalExt) {
    class CombinedSignal extends signaling_1.Signal {
        constructor(sender, ...parents) {
            super(sender);
            this._isDisposed = false;
            this._parents = parents;
            this._forwardFunc = (_aSender, value) => {
                this.emit(value);
            };
            this._parents.forEach(child => child.connect(this._forwardFunc));
        }
        get isDisposed() {
            return this._isDisposed;
        }
        dispose() {
            if (this.isDisposed) {
                return;
            }
            this._parents.forEach(child => child.disconnect(this._forwardFunc));
            this._isDisposed = true;
        }
    }
    SignalExt.CombinedSignal = CombinedSignal;
})(SignalExt = exports.SignalExt || (exports.SignalExt = {}));
