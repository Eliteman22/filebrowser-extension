"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextExt;
(function (TextExt) {
    function titleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
            .join(' ');
    }
    TextExt.titleCase = titleCase;
})(TextExt = exports.TextExt || (exports.TextExt = {}));
