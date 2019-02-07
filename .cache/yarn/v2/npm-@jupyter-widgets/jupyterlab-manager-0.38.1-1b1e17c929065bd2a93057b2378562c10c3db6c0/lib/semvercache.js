"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
/**
 * A cache using semver ranges to retrieve values.
 */
class SemVerCache {
    constructor() {
        this._cache = Object.create(null);
    }
    set(key, version, object) {
        if (!(key in this._cache)) {
            this._cache[key] = Object.create(null);
        }
        if (!(version in this._cache[key])) {
            this._cache[key][version] = object;
        }
        else {
            throw `Version ${version} of key ${key} already registered.`;
        }
    }
    get(key, semver) {
        if (key in this._cache) {
            let versions = this._cache[key];
            let best = semver_1.maxSatisfying(Object.keys(versions), semver);
            return versions[best];
        }
    }
}
exports.SemVerCache = SemVerCache;
