"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../style/index.css");
/**
 * Initialization data for the @flaviolici/battlefin extension.
 */
const extension = {
    id: '@flaviolici/battlefin',
    autoStart: true,
    activate: (app) => {
        console.log("A");
        console.log("B");
        console.log("C");
        window.oncontextmenu = function () {
            console.log('a');
            return false; // cancel default menu
        };
    }
};
exports.default = extension;
