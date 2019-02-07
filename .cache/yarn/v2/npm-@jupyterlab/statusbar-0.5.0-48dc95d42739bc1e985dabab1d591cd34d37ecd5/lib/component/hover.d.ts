import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
export declare function showPopup(options: Popup.IOptions): Popup | null;
export declare class Popup extends Widget {
    constructor(options: Popup.IOptions);
    launch(): void;
    setGeometry(): void;
    protected onUpdateRequest(msg: Message): void;
    protected onAfterAttach(msg: Message): void;
    protected onAfterDetach(msg: Message): void;
    protected _evtClick(event: MouseEvent): void;
    protected onResize(): void;
    dispose(): void;
    protected _evtKeydown(event: KeyboardEvent): void;
    handleEvent(event: Event): void;
    private _body;
    private _anchor;
    private _align;
}
export declare namespace Popup {
    interface IOptions {
        body: Widget;
        anchor: Widget;
        align?: 'left' | 'right';
    }
}
