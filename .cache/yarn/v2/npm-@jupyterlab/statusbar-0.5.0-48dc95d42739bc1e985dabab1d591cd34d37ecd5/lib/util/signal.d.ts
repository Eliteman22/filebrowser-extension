import { ISignal, Signal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
export declare namespace SignalExt {
    class CombinedSignal<T, U> extends Signal<T, U> implements IDisposable {
        constructor(sender: T, ...parents: Array<ISignal<any, U>>);
        readonly isDisposed: boolean;
        dispose(): void;
        private _forwardFunc;
        private _isDisposed;
        private _parents;
    }
}
