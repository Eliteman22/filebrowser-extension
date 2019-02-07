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
    }
};
exports.default = extension;
