import { Token } from '@phosphor/coreutils';
import { IStatusBar } from '../statusBar';
import { JupyterLabPlugin } from '@jupyterlab/application';
import { Widget } from '@phosphor/widgets';
export interface IDefaultsManager {
    addDefaultStatus(id: string, widget: Widget, opts: IStatusBar.IItemOptions): void;
}
export declare namespace IDefaultsManager {
    interface IItem {
        id: string;
        item: Widget;
        opts: IStatusBar.IItemOptions;
    }
}
export declare const IDefaultsManager: Token<IDefaultsManager>;
/**
 * Initialization data for the statusbar extension.
 */
export declare const defaultsManager: JupyterLabPlugin<IDefaultsManager>;
