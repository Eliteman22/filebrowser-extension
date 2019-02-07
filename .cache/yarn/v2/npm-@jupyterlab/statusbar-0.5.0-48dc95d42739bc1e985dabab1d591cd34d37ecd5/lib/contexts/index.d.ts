import { IInstanceTracker } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { ApplicationShell } from '@jupyterlab/application';
export interface IStatusContext<T extends Widget> {
    tracker: IInstanceTracker<T>;
    isEnabled?: (widget: T) => boolean;
}
export declare namespace IStatusContext {
    function delegateActive<E extends IStatusContext<Widget>>(shell: ApplicationShell, contexts: Array<E>): () => boolean;
}
