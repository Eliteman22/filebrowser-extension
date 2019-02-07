import '../style/index.css';
import { JupyterLabPlugin } from '@jupyterlab/application';
export declare const STATUSBAR_PLUGIN_ID = "@jupyterlab/statusbar:plugin";
declare const plugins: JupyterLabPlugin<any>[];
export default plugins;
export * from './statusBar';
