"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const progressBar_1 = require("../style/progressBar");
// tslint:disable-next-line:variable-name
exports.ProgressBar = (props) => {
    return (React.createElement("div", { className: progressBar_1.progressBarItem },
        React.createElement(exports.Filler, { percentage: props.percentage })));
};
// tslint:disable-next-line:variable-name
exports.Filler = (props) => {
    return (React.createElement("div", { className: progressBar_1.fillerItem, style: {
            width: `${props.percentage}px`
        } }));
};
