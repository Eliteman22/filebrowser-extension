"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SetExt;
(function (SetExt) {
    function union(a, b) {
        return new Set([...a, ...b]);
    }
    SetExt.union = union;
    function intersection(a, b) {
        return new Set([...a].filter(x => b.has(x)));
    }
    SetExt.intersection = intersection;
    function difference(a, b) {
        return new Set([...a].filter(x => !b.has(x)));
    }
    SetExt.difference = difference;
    function addAll(set, values) {
        values.forEach(value => {
            set.add(value);
        });
    }
    SetExt.addAll = addAll;
    function deleteAll(set, values) {
        values.forEach(value => {
            set.delete(value);
        });
    }
    SetExt.deleteAll = deleteAll;
})(SetExt = exports.SetExt || (exports.SetExt = {}));
