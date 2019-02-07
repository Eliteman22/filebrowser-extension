/**
 * Main status bar object which contains all widgets.
 */
/**
 *
 */
import { Widget } from '@phosphor/widgets';
import { Token } from '@phosphor/coreutils';
import { ApplicationShell } from '@jupyterlab/application';
import { ISignal } from '@phosphor/signaling';
import { Message } from '@phosphor/messaging';
export declare const IStatusBar: Token<IStatusBar>;
export interface IStatusBar {
    /**
     * Add an item to the status bar.
     * @param id Id of the widget to be displayed in the Settings Registry.
     * @param widget Widget added to the status bar.
     * @param opts
     */
    registerStatusItem(id: string, widget: Widget, opts: IStatusBar.IItemOptions): void;
}
export declare namespace IStatusBar {
    type Alignment = 'right' | 'left' | 'middle';
    /**
     * Options for status bar items.
     */
    interface IItemOptions {
        /**
         * Which side to place widget. Permanent widgets are intended for the right and left side, with more transient widgets in the middle.
         */
        align?: IStatusBar.Alignment;
        /**
         *  Ordering of Items -- higher priority items are closer to the middle.
         */
        priority?: number;
        /**
         * Whether the widget is shown or hidden.
         */
        isActive?: () => boolean;
        /**
         * Determine when the widget updates.
         */
        stateChanged?: ISignal<any, void>;
    }
}
/**
 * Main status bar object which contains all widgets.
 */
export declare class StatusBar extends Widget implements IStatusBar {
    constructor(options: StatusBar.IOptions);
    registerStatusItem(id: string, widget: Widget, opts?: IStatusBar.IItemOptions): void;
    dispose(): void;
    protected onUpdateRequest(msg: Message): void;
    private _findInsertIndex;
    private _refreshItem;
    private _refreshAll;
    private _onAppShellCurrentChanged;
    private _onIndividualStateChange;
    private _leftRankItems;
    private _rightRankItems;
    private _statusItems;
    private _statusIds;
    private _host;
    private _leftSide;
    private _middlePanel;
    private _rightSide;
}
export declare namespace StatusBar {
    interface IRankItem {
        id: string;
        priority: number;
    }
    /**
     * Options for creating a new StatusBar instance
     */
    interface IOptions {
        host: ApplicationShell;
    }
    interface IItem {
        align: IStatusBar.Alignment;
        priority: number;
        widget: Widget;
        isActive: () => boolean;
        stateChanged: ISignal<any, void> | null;
        changeCallback: (() => void) | null;
    }
}
