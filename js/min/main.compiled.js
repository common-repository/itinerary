'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright (c) 2015 Florian Hartmann, https://github.com/florian https://github.com/florian/cookie.js

!function (document, undefined) {

	var cookie = function cookie() {
		return cookie.get.apply(cookie, arguments);
	};

	var utils = cookie.utils = {

		// Is the given value an array? Use ES5 Array.isArray if it's available.
		isArray: Array.isArray || function (value) {
			return Object.prototype.toString.call(value) === '[object Array]';
		},

		// Is the given value a plain object / an object whose constructor is `Object`?
		isPlainObject: function isPlainObject(value) {
			return !!value && Object.prototype.toString.call(value) === '[object Object]';
		},

		// Convert an array-like object to an array – for example `arguments`.
		toArray: function toArray(value) {
			return Array.prototype.slice.call(value);
		},

		// Get the keys of an object. Use ES5 Object.keys if it's available.
		getKeys: Object.keys || function (obj) {
			var keys = [],
			    key = '';
			for (key in obj) {
				if (obj.hasOwnProperty(key)) keys.push(key);
			}
			return keys;
		},

		// Unlike JavaScript's built-in escape functions, this method
		// only escapes characters that are not allowed in cookies.
		encode: function encode(value) {
			return String(value).replace(/[,;"\\=\s%]/g, function (character) {
				return encodeURIComponent(character);
			});
		},

		decode: function decode(value) {
			return decodeURIComponent(value);
		},

		// Return fallback if the value is not defined, otherwise return value.
		retrieve: function retrieve(value, fallback) {
			return value == null ? fallback : value;
		}

	};

	cookie.defaults = {};

	cookie.expiresMultiplier = 60 * 60 * 24;

	cookie.set = function (key, value, options) {
		if (utils.isPlainObject(key)) {
			// `key` contains an object with keys and values for cookies, `value` contains the options object.

			for (var k in key) {
				if (key.hasOwnProperty(k)) this.set(k, key[k], value);
			}
		} else {
			options = utils.isPlainObject(options) ? options : { expires: options };

			// Empty string for session cookies.
			var expires = options.expires !== undefined ? options.expires : this.defaults.expires || '',
			    expiresType = typeof expires === 'undefined' ? 'undefined' : _typeof(expires);

			if (expiresType === 'string' && expires !== '') expires = new Date(expires);else if (expiresType === 'number') expires = new Date(+new Date() + 1000 * this.expiresMultiplier * expires); // This is needed because IE does not support the `max-age` cookie attribute.

			if (expires !== '' && 'toGMTString' in expires) expires = ';expires=' + expires.toGMTString();

			var path = options.path || this.defaults.path;
			path = path ? ';path=' + path : '';

			var domain = options.domain || this.defaults.domain;
			domain = domain ? ';domain=' + domain : '';

			var secure = options.secure || this.defaults.secure ? ';secure' : '';
			if (options.secure === false) secure = '';

			document.cookie = utils.encode(key) + '=' + utils.encode(value) + expires + path + domain + secure;
		}

		return this; // Return the `cookie` object to make chaining possible.
	};

	cookie.setDefault = function (key, value, options) {
		if (utils.isPlainObject(key)) {
			for (var k in key) {
				if (this.get(k) === undefined) this.set(k, key[k], value);
			}
			return cookie;
		} else {
			if (this.get(key) === undefined) return this.set.apply(this, arguments);
		}
	}, cookie.remove = function (keys) {
		keys = utils.isArray(keys) ? keys : utils.toArray(arguments);

		for (var i = 0, l = keys.length; i < l; i++) {
			this.set(keys[i], '', -1);
		}

		return this; // Return the `cookie` object to make chaining possible.
	};

	cookie.removeSpecific = function (keys, options) {
		if (!options) return this.remove(keys);

		keys = utils.isArray(keys) ? keys : [keys];
		options.expires = -1;

		for (var i = 0, l = keys.length; i < l; i++) {
			this.set(keys[i], '', options);
		}

		return this; // Return the `cookie` object to make chaining possible.
	};

	cookie.empty = function () {
		return this.remove(utils.getKeys(this.all()));
	};

	cookie.get = function (keys, fallback) {
		var cookies = this.all();

		if (utils.isArray(keys)) {
			var result = {};

			for (var i = 0, l = keys.length; i < l; i++) {
				var value = keys[i];
				result[value] = utils.retrieve(cookies[value], fallback);
			}

			return result;
		} else return utils.retrieve(cookies[keys], fallback);
	};

	cookie.all = function () {
		if (document.cookie === '') return {};

		var cookies = document.cookie.split('; '),
		    result = {};

		for (var i = 0, l = cookies.length; i < l; i++) {
			var item = cookies[i].split('=');
			var key = utils.decode(item.shift());
			var value = utils.decode(item.join('='));
			result[key] = value;
		}

		return result;
	};

	cookie.enabled = function () {
		if (navigator.cookieEnabled) return true;

		var ret = cookie.set('_', '_').get('_') === '_';
		cookie.remove('_');
		return ret;
	};

	// If an AMD loader is present use AMD.
	// If a CommonJS loader is present use CommonJS.
	// Otherwise assign the `cookie` object to the global scope.

	if (typeof define === 'function' && define.amd) {
		define(function () {
			return { cookie: cookie };
		});
	} else if (typeof exports !== 'undefined') {
		exports.cookie = cookie;
	} else window.cookie = cookie;

	// If used e.g. with Browserify and CommonJS, document is not declared.
}(typeof document === 'undefined' ? null : document);
"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 localForage -- Offline Storage, Improved
 Version 1.5.0
 https://localforage.github.io/localForage
 (c) 2013-2017 Mozilla, Apache License 2.0
 */
(function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }g.localforage = f();
    }
})(function () {
    var define, module, exports;return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    }({ 1: [function (_dereq_, module, exports) {
            (function (global) {
                'use strict';

                var Mutation = global.MutationObserver || global.WebKitMutationObserver;

                var scheduleDrain;

                {
                    if (Mutation) {
                        var called = 0;
                        var observer = new Mutation(nextTick);
                        var element = global.document.createTextNode('');
                        observer.observe(element, {
                            characterData: true
                        });
                        scheduleDrain = function scheduleDrain() {
                            element.data = called = ++called % 2;
                        };
                    } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
                        var channel = new global.MessageChannel();
                        channel.port1.onmessage = nextTick;
                        scheduleDrain = function scheduleDrain() {
                            channel.port2.postMessage(0);
                        };
                    } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
                        scheduleDrain = function scheduleDrain() {

                            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
                            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
                            var scriptEl = global.document.createElement('script');
                            scriptEl.onreadystatechange = function () {
                                nextTick();

                                scriptEl.onreadystatechange = null;
                                scriptEl.parentNode.removeChild(scriptEl);
                                scriptEl = null;
                            };
                            global.document.documentElement.appendChild(scriptEl);
                        };
                    } else {
                        scheduleDrain = function scheduleDrain() {
                            setTimeout(nextTick, 0);
                        };
                    }
                }

                var draining;
                var queue = [];
                //named nextTick for less confusing stack traces
                function nextTick() {
                    draining = true;
                    var i, oldQueue;
                    var len = queue.length;
                    while (len) {
                        oldQueue = queue;
                        queue = [];
                        i = -1;
                        while (++i < len) {
                            oldQueue[i]();
                        }
                        len = queue.length;
                    }
                    draining = false;
                }

                module.exports = immediate;
                function immediate(task) {
                    if (queue.push(task) === 1 && !draining) {
                        scheduleDrain();
                    }
                }
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {}], 2: [function (_dereq_, module, exports) {
            'use strict';

            var immediate = _dereq_(1);

            /* istanbul ignore next */
            function INTERNAL() {}

            var handlers = {};

            var REJECTED = ['REJECTED'];
            var FULFILLED = ['FULFILLED'];
            var PENDING = ['PENDING'];

            module.exports = exports = Promise;

            function Promise(resolver) {
                if (typeof resolver !== 'function') {
                    throw new TypeError('resolver must be a function');
                }
                this.state = PENDING;
                this.queue = [];
                this.outcome = void 0;
                if (resolver !== INTERNAL) {
                    safelyResolveThenable(this, resolver);
                }
            }

            Promise.prototype["catch"] = function (onRejected) {
                return this.then(null, onRejected);
            };
            Promise.prototype.then = function (onFulfilled, onRejected) {
                if (typeof onFulfilled !== 'function' && this.state === FULFILLED || typeof onRejected !== 'function' && this.state === REJECTED) {
                    return this;
                }
                var promise = new this.constructor(INTERNAL);
                if (this.state !== PENDING) {
                    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
                    unwrap(promise, resolver, this.outcome);
                } else {
                    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
                }

                return promise;
            };
            function QueueItem(promise, onFulfilled, onRejected) {
                this.promise = promise;
                if (typeof onFulfilled === 'function') {
                    this.onFulfilled = onFulfilled;
                    this.callFulfilled = this.otherCallFulfilled;
                }
                if (typeof onRejected === 'function') {
                    this.onRejected = onRejected;
                    this.callRejected = this.otherCallRejected;
                }
            }
            QueueItem.prototype.callFulfilled = function (value) {
                handlers.resolve(this.promise, value);
            };
            QueueItem.prototype.otherCallFulfilled = function (value) {
                unwrap(this.promise, this.onFulfilled, value);
            };
            QueueItem.prototype.callRejected = function (value) {
                handlers.reject(this.promise, value);
            };
            QueueItem.prototype.otherCallRejected = function (value) {
                unwrap(this.promise, this.onRejected, value);
            };

            function unwrap(promise, func, value) {
                immediate(function () {
                    var returnValue;
                    try {
                        returnValue = func(value);
                    } catch (e) {
                        return handlers.reject(promise, e);
                    }
                    if (returnValue === promise) {
                        handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
                    } else {
                        handlers.resolve(promise, returnValue);
                    }
                });
            }

            handlers.resolve = function (self, value) {
                var result = tryCatch(getThen, value);
                if (result.status === 'error') {
                    return handlers.reject(self, result.value);
                }
                var thenable = result.value;

                if (thenable) {
                    safelyResolveThenable(self, thenable);
                } else {
                    self.state = FULFILLED;
                    self.outcome = value;
                    var i = -1;
                    var len = self.queue.length;
                    while (++i < len) {
                        self.queue[i].callFulfilled(value);
                    }
                }
                return self;
            };
            handlers.reject = function (self, error) {
                self.state = REJECTED;
                self.outcome = error;
                var i = -1;
                var len = self.queue.length;
                while (++i < len) {
                    self.queue[i].callRejected(error);
                }
                return self;
            };

            function getThen(obj) {
                // Make sure we only access the accessor once as required by the spec
                var then = obj && obj.then;
                if (obj && (typeof obj === "undefined" ? "undefined" : _typeof2(obj)) === 'object' && typeof then === 'function') {
                    return function appyThen() {
                        then.apply(obj, arguments);
                    };
                }
            }

            function safelyResolveThenable(self, thenable) {
                // Either fulfill, reject or reject with error
                var called = false;
                function onError(value) {
                    if (called) {
                        return;
                    }
                    called = true;
                    handlers.reject(self, value);
                }

                function onSuccess(value) {
                    if (called) {
                        return;
                    }
                    called = true;
                    handlers.resolve(self, value);
                }

                function tryToUnwrap() {
                    thenable(onSuccess, onError);
                }

                var result = tryCatch(tryToUnwrap);
                if (result.status === 'error') {
                    onError(result.value);
                }
            }

            function tryCatch(func, value) {
                var out = {};
                try {
                    out.value = func(value);
                    out.status = 'success';
                } catch (e) {
                    out.status = 'error';
                    out.value = e;
                }
                return out;
            }

            exports.resolve = resolve;
            function resolve(value) {
                if (value instanceof this) {
                    return value;
                }
                return handlers.resolve(new this(INTERNAL), value);
            }

            exports.reject = reject;
            function reject(reason) {
                var promise = new this(INTERNAL);
                return handlers.reject(promise, reason);
            }

            exports.all = all;
            function all(iterable) {
                var self = this;
                if (Object.prototype.toString.call(iterable) !== '[object Array]') {
                    return this.reject(new TypeError('must be an array'));
                }

                var len = iterable.length;
                var called = false;
                if (!len) {
                    return this.resolve([]);
                }

                var values = new Array(len);
                var resolved = 0;
                var i = -1;
                var promise = new this(INTERNAL);

                while (++i < len) {
                    allResolver(iterable[i], i);
                }
                return promise;
                function allResolver(value, i) {
                    self.resolve(value).then(resolveFromAll, function (error) {
                        if (!called) {
                            called = true;
                            handlers.reject(promise, error);
                        }
                    });
                    function resolveFromAll(outValue) {
                        values[i] = outValue;
                        if (++resolved === len && !called) {
                            called = true;
                            handlers.resolve(promise, values);
                        }
                    }
                }
            }

            exports.race = race;
            function race(iterable) {
                var self = this;
                if (Object.prototype.toString.call(iterable) !== '[object Array]') {
                    return this.reject(new TypeError('must be an array'));
                }

                var len = iterable.length;
                var called = false;
                if (!len) {
                    return this.resolve([]);
                }

                var i = -1;
                var promise = new this(INTERNAL);

                while (++i < len) {
                    resolver(iterable[i]);
                }
                return promise;
                function resolver(value) {
                    self.resolve(value).then(function (response) {
                        if (!called) {
                            called = true;
                            handlers.resolve(promise, response);
                        }
                    }, function (error) {
                        if (!called) {
                            called = true;
                            handlers.reject(promise, error);
                        }
                    });
                }
            }
        }, { "1": 1 }], 3: [function (_dereq_, module, exports) {
            (function (global) {
                'use strict';

                if (typeof global.Promise !== 'function') {
                    global.Promise = _dereq_(2);
                }
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "2": 2 }], 4: [function (_dereq_, module, exports) {
            'use strict';

            var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
                return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
            };

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function getIDB() {
                /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
                try {
                    if (typeof indexedDB !== 'undefined') {
                        return indexedDB;
                    }
                    if (typeof webkitIndexedDB !== 'undefined') {
                        return webkitIndexedDB;
                    }
                    if (typeof mozIndexedDB !== 'undefined') {
                        return mozIndexedDB;
                    }
                    if (typeof OIndexedDB !== 'undefined') {
                        return OIndexedDB;
                    }
                    if (typeof msIndexedDB !== 'undefined') {
                        return msIndexedDB;
                    }
                } catch (e) {}
            }

            var idb = getIDB();

            function isIndexedDBValid() {
                try {
                    // Initialize IndexedDB; fall back to vendor-prefixed versions
                    // if needed.
                    if (!idb) {
                        return false;
                    }
                    // We mimic PouchDB here;
                    //
                    // We test for openDatabase because IE Mobile identifies itself
                    // as Safari. Oh the lulz...
                    var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

                    var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

                    // Safari <10.1 does not meet our requirements for IDB support (#5572)
                    // since Safari 10.1 shipped with fetch, we can use that to detect it
                    return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
                    // some outdated implementations of IDB that appear on Samsung
                    // and HTC Android devices <4.4 are missing IDBKeyRange
                    typeof IDBKeyRange !== 'undefined';
                } catch (e) {
                    return false;
                }
            }

            function isWebSQLValid() {
                return typeof openDatabase === 'function';
            }

            function isLocalStorageValid() {
                try {
                    return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
                } catch (e) {
                    return false;
                }
            }

            // Abstracts constructing a Blob object, so it also works in older
            // browsers that don't support the native Blob constructor. (i.e.
            // old QtWebKit versions, at least).
            // Abstracts constructing a Blob object, so it also works in older
            // browsers that don't support the native Blob constructor. (i.e.
            // old QtWebKit versions, at least).
            function createBlob(parts, properties) {
                /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
                parts = parts || [];
                properties = properties || {};
                try {
                    return new Blob(parts, properties);
                } catch (e) {
                    if (e.name !== 'TypeError') {
                        throw e;
                    }
                    var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
                    var builder = new Builder();
                    for (var i = 0; i < parts.length; i += 1) {
                        builder.append(parts[i]);
                    }
                    return builder.getBlob(properties.type);
                }
            }

            // This is CommonJS because lie is an external dependency, so Rollup
            // can just ignore it.
            if (typeof Promise === 'undefined') {
                // In the "nopromises" build this will just throw if you don't have
                // a global promise object, but it would throw anyway later.
                _dereq_(3);
            }
            var Promise$1 = Promise;

            function executeCallback(promise, callback) {
                if (callback) {
                    promise.then(function (result) {
                        callback(null, result);
                    }, function (error) {
                        callback(error);
                    });
                }
            }

            function executeTwoCallbacks(promise, callback, errorCallback) {
                if (typeof callback === 'function') {
                    promise.then(callback);
                }

                if (typeof errorCallback === 'function') {
                    promise["catch"](errorCallback);
                }
            }

            // Some code originally from async_storage.js in
            // [Gaia](https://github.com/mozilla-b2g/gaia).

            var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
            var supportsBlobs;
            var dbContexts;
            var toString = Object.prototype.toString;

            // Transform a binary string to an array buffer, because otherwise
            // weird stuff happens when you try to work with the binary string directly.
            // It is known.
            // From http://stackoverflow.com/questions/14967647/ (continues on next line)
            // encode-decode-image-with-base64-breaks-image (2013-04-21)
            function _binStringToArrayBuffer(bin) {
                var length = bin.length;
                var buf = new ArrayBuffer(length);
                var arr = new Uint8Array(buf);
                for (var i = 0; i < length; i++) {
                    arr[i] = bin.charCodeAt(i);
                }
                return buf;
            }

            //
            // Blobs are not supported in all versions of IndexedDB, notably
            // Chrome <37 and Android <5. In those versions, storing a blob will throw.
            //
            // Various other blob bugs exist in Chrome v37-42 (inclusive).
            // Detecting them is expensive and confusing to users, and Chrome 37-42
            // is at very low usage worldwide, so we do a hacky userAgent check instead.
            //
            // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
            // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
            // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
            //
            // Code borrowed from PouchDB. See:
            // https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
            //
            function _checkBlobSupportWithoutCaching(idb) {
                return new Promise$1(function (resolve) {
                    var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, 'readwrite');
                    var blob = createBlob(['']);
                    txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

                    txn.onabort = function (e) {
                        // If the transaction aborts now its due to not being able to
                        // write to the database, likely due to the disk being full
                        e.preventDefault();
                        e.stopPropagation();
                        resolve(false);
                    };

                    txn.oncomplete = function () {
                        var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                        var matchedEdge = navigator.userAgent.match(/Edge\//);
                        // MS Edge pretends to be Chrome 42:
                        // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
                        resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
                    };
                })["catch"](function () {
                    return false; // error, so assume unsupported
                });
            }

            function _checkBlobSupport(idb) {
                if (typeof supportsBlobs === 'boolean') {
                    return Promise$1.resolve(supportsBlobs);
                }
                return _checkBlobSupportWithoutCaching(idb).then(function (value) {
                    supportsBlobs = value;
                    return supportsBlobs;
                });
            }

            function _deferReadiness(dbInfo) {
                var dbContext = dbContexts[dbInfo.name];

                // Create a deferred object representing the current database operation.
                var deferredOperation = {};

                deferredOperation.promise = new Promise$1(function (resolve) {
                    deferredOperation.resolve = resolve;
                });

                // Enqueue the deferred operation.
                dbContext.deferredOperations.push(deferredOperation);

                // Chain its promise to the database readiness.
                if (!dbContext.dbReady) {
                    dbContext.dbReady = deferredOperation.promise;
                } else {
                    dbContext.dbReady = dbContext.dbReady.then(function () {
                        return deferredOperation.promise;
                    });
                }
            }

            function _advanceReadiness(dbInfo) {
                var dbContext = dbContexts[dbInfo.name];

                // Dequeue a deferred operation.
                var deferredOperation = dbContext.deferredOperations.pop();

                // Resolve its promise (which is part of the database readiness
                // chain of promises).
                if (deferredOperation) {
                    deferredOperation.resolve();
                }
            }

            function _getConnection(dbInfo, upgradeNeeded) {
                return new Promise$1(function (resolve, reject) {

                    if (dbInfo.db) {
                        if (upgradeNeeded) {
                            _deferReadiness(dbInfo);
                            dbInfo.db.close();
                        } else {
                            return resolve(dbInfo.db);
                        }
                    }

                    var dbArgs = [dbInfo.name];

                    if (upgradeNeeded) {
                        dbArgs.push(dbInfo.version);
                    }

                    var openreq = idb.open.apply(idb, dbArgs);

                    if (upgradeNeeded) {
                        openreq.onupgradeneeded = function (e) {
                            var db = openreq.result;
                            try {
                                db.createObjectStore(dbInfo.storeName);
                                if (e.oldVersion <= 1) {
                                    // Added when support for blob shims was added
                                    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                                }
                            } catch (ex) {
                                if (ex.name === 'ConstraintError') {
                                    console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                                } else {
                                    throw ex;
                                }
                            }
                        };
                    }

                    openreq.onerror = function (e) {
                        e.preventDefault();
                        reject(openreq.error);
                    };

                    openreq.onsuccess = function () {
                        resolve(openreq.result);
                        _advanceReadiness(dbInfo);
                    };
                });
            }

            function _getOriginalConnection(dbInfo) {
                return _getConnection(dbInfo, false);
            }

            function _getUpgradedConnection(dbInfo) {
                return _getConnection(dbInfo, true);
            }

            function _isUpgradeNeeded(dbInfo, defaultVersion) {
                if (!dbInfo.db) {
                    return true;
                }

                var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
                var isDowngrade = dbInfo.version < dbInfo.db.version;
                var isUpgrade = dbInfo.version > dbInfo.db.version;

                if (isDowngrade) {
                    // If the version is not the default one
                    // then warn for impossible downgrade.
                    if (dbInfo.version !== defaultVersion) {
                        console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
                    }
                    // Align the versions to prevent errors.
                    dbInfo.version = dbInfo.db.version;
                }

                if (isUpgrade || isNewStore) {
                    // If the store is new then increment the version (if needed).
                    // This will trigger an "upgradeneeded" event which is required
                    // for creating a store.
                    if (isNewStore) {
                        var incVersion = dbInfo.db.version + 1;
                        if (incVersion > dbInfo.version) {
                            dbInfo.version = incVersion;
                        }
                    }

                    return true;
                }

                return false;
            }

            // encode a blob for indexeddb engines that don't support blobs
            function _encodeBlob(blob) {
                return new Promise$1(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onerror = reject;
                    reader.onloadend = function (e) {
                        var base64 = btoa(e.target.result || '');
                        resolve({
                            __local_forage_encoded_blob: true,
                            data: base64,
                            type: blob.type
                        });
                    };
                    reader.readAsBinaryString(blob);
                });
            }

            // decode an encoded blob
            function _decodeBlob(encodedBlob) {
                var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
                return createBlob([arrayBuff], { type: encodedBlob.type });
            }

            // is this one of our fancy encoded blobs?
            function _isEncodedBlob(value) {
                return value && value.__local_forage_encoded_blob;
            }

            // Specialize the default `ready()` function by making it dependent
            // on the current database operations. Thus, the driver will be actually
            // ready when it's been initialized (default) *and* there are no pending
            // operations on the database (initiated by some other instances).
            function _fullyReady(callback) {
                var self = this;

                var promise = self._initReady().then(function () {
                    var dbContext = dbContexts[self._dbInfo.name];

                    if (dbContext && dbContext.dbReady) {
                        return dbContext.dbReady;
                    }
                });

                executeTwoCallbacks(promise, callback, callback);
                return promise;
            }

            // Open the IndexedDB database (automatically creates one if one didn't
            // previously exist), using any options set in the config.
            function _initStorage(options) {
                var self = this;
                var dbInfo = {
                    db: null
                };

                if (options) {
                    for (var i in options) {
                        dbInfo[i] = options[i];
                    }
                }

                // Initialize a singleton container for all running localForages.
                if (!dbContexts) {
                    dbContexts = {};
                }

                // Get the current context of the database;
                var dbContext = dbContexts[dbInfo.name];

                // ...or create a new context.
                if (!dbContext) {
                    dbContext = {
                        // Running localForages sharing a database.
                        forages: [],
                        // Shared database.
                        db: null,
                        // Database readiness (promise).
                        dbReady: null,
                        // Deferred operations on the database.
                        deferredOperations: []
                    };
                    // Register the new context in the global container.
                    dbContexts[dbInfo.name] = dbContext;
                }

                // Register itself as a running localForage in the current context.
                dbContext.forages.push(self);

                // Replace the default `ready()` function with the specialized one.
                if (!self._initReady) {
                    self._initReady = self.ready;
                    self.ready = _fullyReady;
                }

                // Create an array of initialization states of the related localForages.
                var initPromises = [];

                function ignoreErrors() {
                    // Don't handle errors here,
                    // just makes sure related localForages aren't pending.
                    return Promise$1.resolve();
                }

                for (var j = 0; j < dbContext.forages.length; j++) {
                    var forage = dbContext.forages[j];
                    if (forage !== self) {
                        // Don't wait for itself...
                        initPromises.push(forage._initReady()["catch"](ignoreErrors));
                    }
                }

                // Take a snapshot of the related localForages.
                var forages = dbContext.forages.slice(0);

                // Initialize the connection process only when
                // all the related localForages aren't pending.
                return Promise$1.all(initPromises).then(function () {
                    dbInfo.db = dbContext.db;
                    // Get the connection or open a new one without upgrade.
                    return _getOriginalConnection(dbInfo);
                }).then(function (db) {
                    dbInfo.db = db;
                    if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
                        // Reopen the database for upgrading.
                        return _getUpgradedConnection(dbInfo);
                    }
                    return db;
                }).then(function (db) {
                    dbInfo.db = dbContext.db = db;
                    self._dbInfo = dbInfo;
                    // Share the final connection amongst related localForages.
                    for (var k = 0; k < forages.length; k++) {
                        var forage = forages[k];
                        if (forage !== self) {
                            // Self is already up-to-date.
                            forage._dbInfo.db = dbInfo.db;
                            forage._dbInfo.version = dbInfo.version;
                        }
                    }
                });
            }

            function getItem(key, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
                        var req = store.get(key);

                        req.onsuccess = function () {
                            var value = req.result;
                            if (value === undefined) {
                                value = null;
                            }
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            resolve(value);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Iterate over all items stored in database.
            function iterate(iterator, callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                        var req = store.openCursor();
                        var iterationNumber = 1;

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (cursor) {
                                var value = cursor.value;
                                if (_isEncodedBlob(value)) {
                                    value = _decodeBlob(value);
                                }
                                var result = iterator(value, cursor.key, iterationNumber++);

                                if (result !== void 0) {
                                    resolve(result);
                                } else {
                                    cursor["continue"]();
                                }
                            } else {
                                resolve();
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);

                return promise;
            }

            function setItem(key, value, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = new Promise$1(function (resolve, reject) {
                    var dbInfo;
                    self.ready().then(function () {
                        dbInfo = self._dbInfo;
                        if (toString.call(value) === '[object Blob]') {
                            return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                                if (blobSupport) {
                                    return value;
                                }
                                return _encodeBlob(value);
                            });
                        }
                        return value;
                    }).then(function (value) {
                        var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                        var store = transaction.objectStore(dbInfo.storeName);
                        var req = store.put(value, key);

                        // The reason we don't _save_ null is because IE 10 does
                        // not support saving the `null` type in IndexedDB. How
                        // ironic, given the bug below!
                        // See: https://github.com/mozilla/localForage/issues/161
                        if (value === null) {
                            value = undefined;
                        }

                        transaction.oncomplete = function () {
                            // Cast to undefined so the value passed to
                            // callback/promise is the same as what one would get out
                            // of `getItem()` later. This leads to some weirdness
                            // (setItem('foo', undefined) will return `null`), but
                            // it's not my fault localStorage is our baseline and that
                            // it's weird.
                            if (value === undefined) {
                                value = null;
                            }

                            resolve(value);
                        };
                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function removeItem(key, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                        var store = transaction.objectStore(dbInfo.storeName);

                        // We use a Grunt task to make this safe for IE and some
                        // versions of Android (including those used by Cordova).
                        // Normally IE won't like `.delete()` and will insist on
                        // using `['delete']()`, but we have a build step that
                        // fixes this for us now.
                        var req = store["delete"](key);
                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onerror = function () {
                            reject(req.error);
                        };

                        // The request will be also be aborted if we've exceeded our storage
                        // space.
                        transaction.onabort = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function clear(callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                        var store = transaction.objectStore(dbInfo.storeName);
                        var req = store.clear();

                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function length(callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
                        var req = store.count();

                        req.onsuccess = function () {
                            resolve(req.result);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function key(n, callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    if (n < 0) {
                        resolve(null);

                        return;
                    }

                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                        var advanced = false;
                        var req = store.openCursor();
                        req.onsuccess = function () {
                            var cursor = req.result;
                            if (!cursor) {
                                // this means there weren't enough keys
                                resolve(null);

                                return;
                            }

                            if (n === 0) {
                                // We have the first key, return it if that's what they
                                // wanted.
                                resolve(cursor.key);
                            } else {
                                if (!advanced) {
                                    // Otherwise, ask the cursor to skip ahead n
                                    // records.
                                    advanced = true;
                                    cursor.advance(n);
                                } else {
                                    // When we get here, we've got the nth key.
                                    resolve(cursor.key);
                                }
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function keys(callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                        var req = store.openCursor();
                        var keys = [];

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (!cursor) {
                                resolve(keys);
                                return;
                            }

                            keys.push(cursor.key);
                            cursor["continue"]();
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            var asyncStorage = {
                _driver: 'asyncStorage',
                _initStorage: _initStorage,
                iterate: iterate,
                getItem: getItem,
                setItem: setItem,
                removeItem: removeItem,
                clear: clear,
                length: length,
                key: key,
                keys: keys
            };

            // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
            // it to Base64, so this is how we store it to prevent very strange errors with less
            // verbose ways of binary <-> string data storage.
            var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            var BLOB_TYPE_PREFIX = '~~local_forage_type~';
            var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

            var SERIALIZED_MARKER = '__lfsc__:';
            var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

            // OMG the serializations!
            var TYPE_ARRAYBUFFER = 'arbf';
            var TYPE_BLOB = 'blob';
            var TYPE_INT8ARRAY = 'si08';
            var TYPE_UINT8ARRAY = 'ui08';
            var TYPE_UINT8CLAMPEDARRAY = 'uic8';
            var TYPE_INT16ARRAY = 'si16';
            var TYPE_INT32ARRAY = 'si32';
            var TYPE_UINT16ARRAY = 'ur16';
            var TYPE_UINT32ARRAY = 'ui32';
            var TYPE_FLOAT32ARRAY = 'fl32';
            var TYPE_FLOAT64ARRAY = 'fl64';
            var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

            var toString$1 = Object.prototype.toString;

            function stringToBuffer(serializedString) {
                // Fill the string into a ArrayBuffer.
                var bufferLength = serializedString.length * 0.75;
                var len = serializedString.length;
                var i;
                var p = 0;
                var encoded1, encoded2, encoded3, encoded4;

                if (serializedString[serializedString.length - 1] === '=') {
                    bufferLength--;
                    if (serializedString[serializedString.length - 2] === '=') {
                        bufferLength--;
                    }
                }

                var buffer = new ArrayBuffer(bufferLength);
                var bytes = new Uint8Array(buffer);

                for (i = 0; i < len; i += 4) {
                    encoded1 = BASE_CHARS.indexOf(serializedString[i]);
                    encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
                    encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
                    encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

                    /*jslint bitwise: true */
                    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
                    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
                    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
                }
                return buffer;
            }

            // Converts a buffer to a string to store, serialized, in the backend
            // storage library.
            function bufferToString(buffer) {
                // base64-arraybuffer
                var bytes = new Uint8Array(buffer);
                var base64String = '';
                var i;

                for (i = 0; i < bytes.length; i += 3) {
                    /*jslint bitwise: true */
                    base64String += BASE_CHARS[bytes[i] >> 2];
                    base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
                    base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
                    base64String += BASE_CHARS[bytes[i + 2] & 63];
                }

                if (bytes.length % 3 === 2) {
                    base64String = base64String.substring(0, base64String.length - 1) + '=';
                } else if (bytes.length % 3 === 1) {
                    base64String = base64String.substring(0, base64String.length - 2) + '==';
                }

                return base64String;
            }

            // Serialize a value, afterwards executing a callback (which usually
            // instructs the `setItem()` callback/promise to be executed). This is how
            // we store binary data with localStorage.
            function serialize(value, callback) {
                var valueType = '';
                if (value) {
                    valueType = toString$1.call(value);
                }

                // Cannot use `value instanceof ArrayBuffer` or such here, as these
                // checks fail when running the tests using casper.js...
                //
                // TODO: See why those tests fail and use a better solution.
                if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
                    // Convert binary arrays to a string and prefix the string with
                    // a special marker.
                    var buffer;
                    var marker = SERIALIZED_MARKER;

                    if (value instanceof ArrayBuffer) {
                        buffer = value;
                        marker += TYPE_ARRAYBUFFER;
                    } else {
                        buffer = value.buffer;

                        if (valueType === '[object Int8Array]') {
                            marker += TYPE_INT8ARRAY;
                        } else if (valueType === '[object Uint8Array]') {
                            marker += TYPE_UINT8ARRAY;
                        } else if (valueType === '[object Uint8ClampedArray]') {
                            marker += TYPE_UINT8CLAMPEDARRAY;
                        } else if (valueType === '[object Int16Array]') {
                            marker += TYPE_INT16ARRAY;
                        } else if (valueType === '[object Uint16Array]') {
                            marker += TYPE_UINT16ARRAY;
                        } else if (valueType === '[object Int32Array]') {
                            marker += TYPE_INT32ARRAY;
                        } else if (valueType === '[object Uint32Array]') {
                            marker += TYPE_UINT32ARRAY;
                        } else if (valueType === '[object Float32Array]') {
                            marker += TYPE_FLOAT32ARRAY;
                        } else if (valueType === '[object Float64Array]') {
                            marker += TYPE_FLOAT64ARRAY;
                        } else {
                            callback(new Error('Failed to get type for BinaryArray'));
                        }
                    }

                    callback(marker + bufferToString(buffer));
                } else if (valueType === '[object Blob]') {
                    // Conver the blob to a binaryArray and then to a string.
                    var fileReader = new FileReader();

                    fileReader.onload = function () {
                        // Backwards-compatible prefix for the blob type.
                        var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

                        callback(SERIALIZED_MARKER + TYPE_BLOB + str);
                    };

                    fileReader.readAsArrayBuffer(value);
                } else {
                    try {
                        callback(JSON.stringify(value));
                    } catch (e) {
                        console.error("Couldn't convert value into a JSON string: ", value);

                        callback(null, e);
                    }
                }
            }

            // Deserialize data we've inserted into a value column/field. We place
            // special markers into our strings to mark them as encoded; this isn't
            // as nice as a meta field, but it's the only sane thing we can do whilst
            // keeping localStorage support intact.
            //
            // Oftentimes this will just deserialize JSON content, but if we have a
            // special marker (SERIALIZED_MARKER, defined above), we will extract
            // some kind of arraybuffer/binary data/typed array out of the string.
            function deserialize(value) {
                // If we haven't marked this string as being specially serialized (i.e.
                // something other than serialized JSON), we can just return it and be
                // done with it.
                if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
                    return JSON.parse(value);
                }

                // The following code deals with deserializing some kind of Blob or
                // TypedArray. First we separate out the type of data we're dealing
                // with from the data itself.
                var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
                var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

                var blobType;
                // Backwards-compatible blob type serialization strategy.
                // DBs created with older versions of localForage will simply not have the blob type.
                if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
                    var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
                    blobType = matcher[1];
                    serializedString = serializedString.substring(matcher[0].length);
                }
                var buffer = stringToBuffer(serializedString);

                // Return the right type based on the code/type set during
                // serialization.
                switch (type) {
                    case TYPE_ARRAYBUFFER:
                        return buffer;
                    case TYPE_BLOB:
                        return createBlob([buffer], { type: blobType });
                    case TYPE_INT8ARRAY:
                        return new Int8Array(buffer);
                    case TYPE_UINT8ARRAY:
                        return new Uint8Array(buffer);
                    case TYPE_UINT8CLAMPEDARRAY:
                        return new Uint8ClampedArray(buffer);
                    case TYPE_INT16ARRAY:
                        return new Int16Array(buffer);
                    case TYPE_UINT16ARRAY:
                        return new Uint16Array(buffer);
                    case TYPE_INT32ARRAY:
                        return new Int32Array(buffer);
                    case TYPE_UINT32ARRAY:
                        return new Uint32Array(buffer);
                    case TYPE_FLOAT32ARRAY:
                        return new Float32Array(buffer);
                    case TYPE_FLOAT64ARRAY:
                        return new Float64Array(buffer);
                    default:
                        throw new Error('Unkown type: ' + type);
                }
            }

            var localforageSerializer = {
                serialize: serialize,
                deserialize: deserialize,
                stringToBuffer: stringToBuffer,
                bufferToString: bufferToString
            };

            /*
             * Includes code from:
             *
             * base64-arraybuffer
             * https://github.com/niklasvh/base64-arraybuffer
             *
             * Copyright (c) 2012 Niklas von Hertzen
             * Licensed under the MIT license.
             */
            // Open the WebSQL database (automatically creates one if one didn't
            // previously exist), using any options set in the config.
            function _initStorage$1(options) {
                var self = this;
                var dbInfo = {
                    db: null
                };

                if (options) {
                    for (var i in options) {
                        dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
                    }
                }

                var dbInfoPromise = new Promise$1(function (resolve, reject) {
                    // Open the database; the openDatabase API will automatically
                    // create it for us if it doesn't exist.
                    try {
                        dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
                    } catch (e) {
                        return reject(e);
                    }

                    // Create our key/value table if it doesn't exist.
                    dbInfo.db.transaction(function (t) {
                        t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
                            self._dbInfo = dbInfo;
                            resolve();
                        }, function (t, error) {
                            reject(error);
                        });
                    });
                });

                dbInfo.serializer = localforageSerializer;
                return dbInfoPromise;
            }

            function getItem$1(key, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        dbInfo.db.transaction(function (t) {
                            t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                                var result = results.rows.length ? results.rows.item(0).value : null;

                                // Check to see if this is serialized content we need to
                                // unpack.
                                if (result) {
                                    result = dbInfo.serializer.deserialize(result);
                                }

                                resolve(result);
                            }, function (t, error) {

                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function iterate$1(iterator, callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;

                        dbInfo.db.transaction(function (t) {
                            t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                                var rows = results.rows;
                                var length = rows.length;

                                for (var i = 0; i < length; i++) {
                                    var item = rows.item(i);
                                    var result = item.value;

                                    // Check to see if this is serialized content
                                    // we need to unpack.
                                    if (result) {
                                        result = dbInfo.serializer.deserialize(result);
                                    }

                                    result = iterator(result, item.key, i + 1);

                                    // void(0) prevents problems with redefinition
                                    // of `undefined`.
                                    if (result !== void 0) {
                                        resolve(result);
                                        return;
                                    }
                                }

                                resolve();
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function _setItem(key, value, callback, retriesLeft) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        // The localStorage API doesn't return undefined values in an
                        // "expected" way, so undefined is always cast to null in all
                        // drivers. See: https://github.com/mozilla/localForage/pull/42
                        if (value === undefined) {
                            value = null;
                        }

                        // Save the original value to pass to the callback.
                        var originalValue = value;

                        var dbInfo = self._dbInfo;
                        dbInfo.serializer.serialize(value, function (value, error) {
                            if (error) {
                                reject(error);
                            } else {
                                dbInfo.db.transaction(function (t) {
                                    t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
                                        resolve(originalValue);
                                    }, function (t, error) {
                                        reject(error);
                                    });
                                }, function (sqlError) {
                                    // The transaction failed; check
                                    // to see if it's a quota error.
                                    if (sqlError.code === sqlError.QUOTA_ERR) {
                                        // We reject the callback outright for now, but
                                        // it's worth trying to re-run the transaction.
                                        // Even if the user accepts the prompt to use
                                        // more storage on Safari, this error will
                                        // be called.
                                        //
                                        // Try to re-run the transaction.
                                        if (retriesLeft > 0) {
                                            resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                            return;
                                        }
                                        reject(sqlError);
                                    }
                                });
                            }
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function setItem$1(key, value, callback) {
                return _setItem.apply(this, [key, value, callback, 1]);
            }

            function removeItem$1(key, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        dbInfo.db.transaction(function (t) {
                            t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                                resolve();
                            }, function (t, error) {

                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Deletes every item in the table.
            // TODO: Find out if this resets the AUTO_INCREMENT number.
            function clear$1(callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        dbInfo.db.transaction(function (t) {
                            t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
                                resolve();
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Does a simple `COUNT(key)` to get the number of items stored in
            // localForage.
            function length$1(callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        dbInfo.db.transaction(function (t) {
                            // Ahhh, SQL makes this one soooooo easy.
                            t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                                var result = results.rows.item(0).c;

                                resolve(result);
                            }, function (t, error) {

                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Return the key located at key index X; essentially gets the key from a
            // `WHERE id = ?`. This is the most efficient way I can think to implement
            // this rarely-used (in my experience) part of the API, but it can seem
            // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
            // the ID of each key will change every time it's updated. Perhaps a stored
            // procedure for the `setItem()` SQL would solve this problem?
            // TODO: Don't change ID on `setItem()`.
            function key$1(n, callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        dbInfo.db.transaction(function (t) {
                            t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                                var result = results.rows.length ? results.rows.item(0).key : null;
                                resolve(result);
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            function keys$1(callback) {
                var self = this;

                var promise = new Promise$1(function (resolve, reject) {
                    self.ready().then(function () {
                        var dbInfo = self._dbInfo;
                        dbInfo.db.transaction(function (t) {
                            t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                                var keys = [];

                                for (var i = 0; i < results.rows.length; i++) {
                                    keys.push(results.rows.item(i).key);
                                }

                                resolve(keys);
                            }, function (t, error) {

                                reject(error);
                            });
                        });
                    })["catch"](reject);
                });

                executeCallback(promise, callback);
                return promise;
            }

            var webSQLStorage = {
                _driver: 'webSQLStorage',
                _initStorage: _initStorage$1,
                iterate: iterate$1,
                getItem: getItem$1,
                setItem: setItem$1,
                removeItem: removeItem$1,
                clear: clear$1,
                length: length$1,
                key: key$1,
                keys: keys$1
            };

            // Config the localStorage backend, using options set in the config.
            function _initStorage$2(options) {
                var self = this;
                var dbInfo = {};
                if (options) {
                    for (var i in options) {
                        dbInfo[i] = options[i];
                    }
                }

                dbInfo.keyPrefix = dbInfo.name + '/';

                if (dbInfo.storeName !== self._defaultConfig.storeName) {
                    dbInfo.keyPrefix += dbInfo.storeName + '/';
                }

                self._dbInfo = dbInfo;
                dbInfo.serializer = localforageSerializer;

                return Promise$1.resolve();
            }

            // Remove all keys from the datastore, effectively destroying all data in
            // the app's key/value store!
            function clear$2(callback) {
                var self = this;
                var promise = self.ready().then(function () {
                    var keyPrefix = self._dbInfo.keyPrefix;

                    for (var i = localStorage.length - 1; i >= 0; i--) {
                        var key = localStorage.key(i);

                        if (key.indexOf(keyPrefix) === 0) {
                            localStorage.removeItem(key);
                        }
                    }
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Retrieve an item from the store. Unlike the original async_storage
            // library in Gaia, we don't modify return values at all. If a key's value
            // is `undefined`, we pass that value to the callback function.
            function getItem$2(key, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = self.ready().then(function () {
                    var dbInfo = self._dbInfo;
                    var result = localStorage.getItem(dbInfo.keyPrefix + key);

                    // If a result was found, parse it from the serialized
                    // string into a JS object. If result isn't truthy, the key
                    // is likely undefined and we'll pass it straight to the
                    // callback.
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    return result;
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Iterate over all items in the store.
            function iterate$2(iterator, callback) {
                var self = this;

                var promise = self.ready().then(function () {
                    var dbInfo = self._dbInfo;
                    var keyPrefix = dbInfo.keyPrefix;
                    var keyPrefixLength = keyPrefix.length;
                    var length = localStorage.length;

                    // We use a dedicated iterator instead of the `i` variable below
                    // so other keys we fetch in localStorage aren't counted in
                    // the `iterationNumber` argument passed to the `iterate()`
                    // callback.
                    //
                    // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
                    var iterationNumber = 1;

                    for (var i = 0; i < length; i++) {
                        var key = localStorage.key(i);
                        if (key.indexOf(keyPrefix) !== 0) {
                            continue;
                        }
                        var value = localStorage.getItem(key);

                        // If a result was found, parse it from the serialized
                        // string into a JS object. If result isn't truthy, the
                        // key is likely undefined and we'll pass it straight
                        // to the iterator.
                        if (value) {
                            value = dbInfo.serializer.deserialize(value);
                        }

                        value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

                        if (value !== void 0) {
                            return value;
                        }
                    }
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Same as localStorage's key() method, except takes a callback.
            function key$2(n, callback) {
                var self = this;
                var promise = self.ready().then(function () {
                    var dbInfo = self._dbInfo;
                    var result;
                    try {
                        result = localStorage.key(n);
                    } catch (error) {
                        result = null;
                    }

                    // Remove the prefix from the key, if a key is found.
                    if (result) {
                        result = result.substring(dbInfo.keyPrefix.length);
                    }

                    return result;
                });

                executeCallback(promise, callback);
                return promise;
            }

            function keys$2(callback) {
                var self = this;
                var promise = self.ready().then(function () {
                    var dbInfo = self._dbInfo;
                    var length = localStorage.length;
                    var keys = [];

                    for (var i = 0; i < length; i++) {
                        if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                            keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
                        }
                    }

                    return keys;
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Supply the number of keys in the datastore to the callback function.
            function length$2(callback) {
                var self = this;
                var promise = self.keys().then(function (keys) {
                    return keys.length;
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Remove an item from the store, nice and simple.
            function removeItem$2(key, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = self.ready().then(function () {
                    var dbInfo = self._dbInfo;
                    localStorage.removeItem(dbInfo.keyPrefix + key);
                });

                executeCallback(promise, callback);
                return promise;
            }

            // Set a key's value and run an optional callback once the value is set.
            // Unlike Gaia's implementation, the callback function is passed the value,
            // in case you want to operate on that value only after you're sure it
            // saved, or something like that.
            function setItem$2(key, value, callback) {
                var self = this;

                // Cast the key to a string, as that's all we can set as a key.
                if (typeof key !== 'string') {
                    console.warn(key + ' used as a key, but it is not a string.');
                    key = String(key);
                }

                var promise = self.ready().then(function () {
                    // Convert undefined values to null.
                    // https://github.com/mozilla/localForage/pull/42
                    if (value === undefined) {
                        value = null;
                    }

                    // Save the original value to pass to the callback.
                    var originalValue = value;

                    return new Promise$1(function (resolve, reject) {
                        var dbInfo = self._dbInfo;
                        dbInfo.serializer.serialize(value, function (value, error) {
                            if (error) {
                                reject(error);
                            } else {
                                try {
                                    localStorage.setItem(dbInfo.keyPrefix + key, value);
                                    resolve(originalValue);
                                } catch (e) {
                                    // localStorage capacity exceeded.
                                    // TODO: Make this a specific error/event.
                                    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                        reject(e);
                                    }
                                    reject(e);
                                }
                            }
                        });
                    });
                });

                executeCallback(promise, callback);
                return promise;
            }

            var localStorageWrapper = {
                _driver: 'localStorageWrapper',
                _initStorage: _initStorage$2,
                // Default API, from Gaia/localStorage.
                iterate: iterate$2,
                getItem: getItem$2,
                setItem: setItem$2,
                removeItem: removeItem$2,
                clear: clear$2,
                length: length$2,
                key: key$2,
                keys: keys$2
            };

            // Custom drivers are stored here when `defineDriver()` is called.
            // They are shared across all instances of localForage.
            var CustomDrivers = {};

            var DriverType = {
                INDEXEDDB: 'asyncStorage',
                LOCALSTORAGE: 'localStorageWrapper',
                WEBSQL: 'webSQLStorage'
            };

            var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];

            var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];

            var DefaultConfig = {
                description: '',
                driver: DefaultDriverOrder.slice(),
                name: 'localforage',
                // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
                // we can use without a prompt.
                size: 4980736,
                storeName: 'keyvaluepairs',
                version: 1.0
            };

            var driverSupport = {};
            // Check to see if IndexedDB is available and if it is the latest
            // implementation; it's our preferred backend library. We use "_spec_test"
            // as the name of the database because it's not the one we'll operate on,
            // but it's useful to make sure its using the right spec.
            // See: https://github.com/mozilla/localForage/issues/128
            driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();

            driverSupport[DriverType.WEBSQL] = isWebSQLValid();

            driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();

            var isArray = Array.isArray || function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };

            function callWhenReady(localForageInstance, libraryMethod) {
                localForageInstance[libraryMethod] = function () {
                    var _args = arguments;
                    return localForageInstance.ready().then(function () {
                        return localForageInstance[libraryMethod].apply(localForageInstance, _args);
                    });
                };
            }

            function extend() {
                for (var i = 1; i < arguments.length; i++) {
                    var arg = arguments[i];

                    if (arg) {
                        for (var key in arg) {
                            if (arg.hasOwnProperty(key)) {
                                if (isArray(arg[key])) {
                                    arguments[0][key] = arg[key].slice();
                                } else {
                                    arguments[0][key] = arg[key];
                                }
                            }
                        }
                    }
                }

                return arguments[0];
            }

            function isLibraryDriver(driverName) {
                for (var driver in DriverType) {
                    if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
                        return true;
                    }
                }

                return false;
            }

            var LocalForage = function () {
                function LocalForage(options) {
                    _classCallCheck(this, LocalForage);

                    this.INDEXEDDB = DriverType.INDEXEDDB;
                    this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
                    this.WEBSQL = DriverType.WEBSQL;

                    this._defaultConfig = extend({}, DefaultConfig);
                    this._config = extend({}, this._defaultConfig, options);
                    this._driverSet = null;
                    this._initDriver = null;
                    this._ready = false;
                    this._dbInfo = null;

                    this._wrapLibraryMethodsWithReady();
                    this.setDriver(this._config.driver)["catch"](function () {});
                }

                // Set any config values for localForage; can be called anytime before
                // the first API call (e.g. `getItem`, `setItem`).
                // We loop through options so we don't overwrite existing config
                // values.


                LocalForage.prototype.config = function config(options) {
                    // If the options argument is an object, we use it to set values.
                    // Otherwise, we return either a specified config value or all
                    // config values.
                    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                        // If localforage is ready and fully initialized, we can't set
                        // any new configuration values. Instead, we return an error.
                        if (this._ready) {
                            return new Error("Can't call config() after localforage " + 'has been used.');
                        }

                        for (var i in options) {
                            if (i === 'storeName') {
                                options[i] = options[i].replace(/\W/g, '_');
                            }

                            if (i === 'version' && typeof options[i] !== 'number') {
                                return new Error('Database version must be a number.');
                            }

                            this._config[i] = options[i];
                        }

                        // after all config options are set and
                        // the driver option is used, try setting it
                        if ('driver' in options && options.driver) {
                            return this.setDriver(this._config.driver);
                        }

                        return true;
                    } else if (typeof options === 'string') {
                        return this._config[options];
                    } else {
                        return this._config;
                    }
                };

                // Used to define a custom driver, shared across all instances of
                // localForage.


                LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
                    var promise = new Promise$1(function (resolve, reject) {
                        try {
                            var driverName = driverObject._driver;
                            var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
                            var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);

                            // A driver name should be defined and not overlap with the
                            // library-defined, default drivers.
                            if (!driverObject._driver) {
                                reject(complianceError);
                                return;
                            }
                            if (isLibraryDriver(driverObject._driver)) {
                                reject(namingError);
                                return;
                            }

                            var customDriverMethods = LibraryMethods.concat('_initStorage');
                            for (var i = 0; i < customDriverMethods.length; i++) {
                                var customDriverMethod = customDriverMethods[i];
                                if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                                    reject(complianceError);
                                    return;
                                }
                            }

                            var supportPromise = Promise$1.resolve(true);
                            if ('_support' in driverObject) {
                                if (driverObject._support && typeof driverObject._support === 'function') {
                                    supportPromise = driverObject._support();
                                } else {
                                    supportPromise = Promise$1.resolve(!!driverObject._support);
                                }
                            }

                            supportPromise.then(function (supportResult) {
                                driverSupport[driverName] = supportResult;
                                CustomDrivers[driverName] = driverObject;
                                resolve();
                            }, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });

                    executeTwoCallbacks(promise, callback, errorCallback);
                    return promise;
                };

                LocalForage.prototype.driver = function driver() {
                    return this._driver || null;
                };

                LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
                    var self = this;
                    var getDriverPromise = Promise$1.resolve().then(function () {
                        if (isLibraryDriver(driverName)) {
                            switch (driverName) {
                                case self.INDEXEDDB:
                                    return asyncStorage;
                                case self.LOCALSTORAGE:
                                    return localStorageWrapper;
                                case self.WEBSQL:
                                    return webSQLStorage;
                            }
                        } else if (CustomDrivers[driverName]) {
                            return CustomDrivers[driverName];
                        } else {
                            throw new Error('Driver not found.');
                        }
                    });
                    executeTwoCallbacks(getDriverPromise, callback, errorCallback);
                    return getDriverPromise;
                };

                LocalForage.prototype.getSerializer = function getSerializer(callback) {
                    var serializerPromise = Promise$1.resolve(localforageSerializer);
                    executeTwoCallbacks(serializerPromise, callback);
                    return serializerPromise;
                };

                LocalForage.prototype.ready = function ready(callback) {
                    var self = this;

                    var promise = self._driverSet.then(function () {
                        if (self._ready === null) {
                            self._ready = self._initDriver();
                        }

                        return self._ready;
                    });

                    executeTwoCallbacks(promise, callback, callback);
                    return promise;
                };

                LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
                    var self = this;

                    if (!isArray(drivers)) {
                        drivers = [drivers];
                    }

                    var supportedDrivers = this._getSupportedDrivers(drivers);

                    function setDriverToConfig() {
                        self._config.driver = self.driver();
                    }

                    function extendSelfWithDriver(driver) {
                        self._extend(driver);
                        setDriverToConfig();

                        self._ready = self._initStorage(self._config);
                        return self._ready;
                    }

                    function initDriver(supportedDrivers) {
                        return function () {
                            var currentDriverIndex = 0;

                            function driverPromiseLoop() {
                                while (currentDriverIndex < supportedDrivers.length) {
                                    var driverName = supportedDrivers[currentDriverIndex];
                                    currentDriverIndex++;

                                    self._dbInfo = null;
                                    self._ready = null;

                                    return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                                }

                                setDriverToConfig();
                                var error = new Error('No available storage method found.');
                                self._driverSet = Promise$1.reject(error);
                                return self._driverSet;
                            }

                            return driverPromiseLoop();
                        };
                    }

                    // There might be a driver initialization in progress
                    // so wait for it to finish in order to avoid a possible
                    // race condition to set _dbInfo
                    var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
                        return Promise$1.resolve();
                    }) : Promise$1.resolve();

                    this._driverSet = oldDriverSetDone.then(function () {
                        var driverName = supportedDrivers[0];
                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(function (driver) {
                            self._driver = driver._driver;
                            setDriverToConfig();
                            self._wrapLibraryMethodsWithReady();
                            self._initDriver = initDriver(supportedDrivers);
                        });
                    })["catch"](function () {
                        setDriverToConfig();
                        var error = new Error('No available storage method found.');
                        self._driverSet = Promise$1.reject(error);
                        return self._driverSet;
                    });

                    executeTwoCallbacks(this._driverSet, callback, errorCallback);
                    return this._driverSet;
                };

                LocalForage.prototype.supports = function supports(driverName) {
                    return !!driverSupport[driverName];
                };

                LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
                    extend(this, libraryMethodsAndProperties);
                };

                LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
                    var supportedDrivers = [];
                    for (var i = 0, len = drivers.length; i < len; i++) {
                        var driverName = drivers[i];
                        if (this.supports(driverName)) {
                            supportedDrivers.push(driverName);
                        }
                    }
                    return supportedDrivers;
                };

                LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
                    // Add a stub for each driver API method that delays the call to the
                    // corresponding driver method until localForage is ready. These stubs
                    // will be replaced by the driver methods as soon as the driver is
                    // loaded, so there is no performance impact.
                    for (var i = 0; i < LibraryMethods.length; i++) {
                        callWhenReady(this, LibraryMethods[i]);
                    }
                };

                LocalForage.prototype.createInstance = function createInstance(options) {
                    return new LocalForage(options);
                };

                return LocalForage;
            }();

            // The actual localForage object that we expose as a module or via a
            // global. It's extended by pulling in one of our other libraries.


            var localforage_js = new LocalForage();

            module.exports = localforage_js;
        }, { "3": 3 }] }, {}, [4])(4);
});
'use strict';

/**
 * Created by michael on 11/21/16.
 */
function ItineraryStop(id, itineraryId, type) {

	var _id = void 0;
	var _itineraryId = void 0;
	var _type = void 0;
	var self = this;

	this.setId = function (value) {
		_id = value;
	};

	this.getId = function () {
		return _id;
	};

	this.setItineraryId = function (value) {
		_itineraryId = value;
	};

	this.getItineraryId = function () {
		return _itineraryId;
	};

	this.setType = function (value) {
		_type = value;
	};

	this.getType = function () {
		return 'type';
	};

	this.init = function () {
		this.setId(id);
		this.setItineraryId(itineraryId);
		this.setType(type);
	};

	this.init();
}

var Itinerary = void 0;

function flash(e) {
	window.console.log('-----------FLASH------------');
	console.log(e);
	window.console.log('-----------FLASH------------');
}

wisnet.App.flash = flash;

(function ($) {

	$.itinerary = function () {
		var version = '1.0.0';
		var self = this;

		this._run = function (e) {
			self.init();
			return self;
		};
		this._loadItinerary = function (e) {
			self.loadItinerary(e);
			return self;
		};
	};

	var $itinerary = $.itinerary;

	$itinerary.fn = $itinerary.prototype = {
		itinerary: '1.0.1'
	};

	$itinerary.fn.extend = $itinerary.extend = $.extend;

	$itinerary.fn.extend({
		user_itinerary: {
			isLoaded: false
		},

		/**
   * Load the itinerary
   * This goes out and grabs the itinerary from local storage;
   * if there isn't anything there then it creates the
   * itinerary and then loads it.
   */
		init: function init() {
			var that = this;
			localforage.config({
				driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
				name: 'Itinerary',
				version: that.version,
				size: 4980736, // Size of database, in bytes. WebSQL-only for now.
				storeName: 'wp_itinerary', // Should be alphanumeric, with underscores.
				description: 'Itinerary plugin for WordPress.'
			});

			var user_itinerary = void 0;

			this.getCookie(function (itinerary) {
				that.user_itinerary = itinerary;

				if (!itinerary || typeof itinerary.itineraryId === 'undefined') {
					that.createItinerary(that._loadItinerary);
				} else {
					that._loadItinerary(itinerary.itineraryId);
				}
			});

			this.registerEvents();
		},

		registerEvents: function registerEvents() {
			var that = this;

			$('body').on('click', '.js-add-to-itinerary', function () {
				var $this = $(this);
				var type = $this.attr('data-type');
				var id = $this.attr('data-id');
				var itineraryId = $this.attr('data-itinerary-id');
				var itineraryStop = new ItineraryStop(id, itineraryId, type);

				if (itineraryStop.getId() == '' || !Number(itineraryStop.getId())) {
					return false;
				}

				that.itineraryButtonWorking($this);

				that.addItineraryStop(itineraryStop, function (e) {
					that.changeItineraryAction({
						stopID: e.stopId,
						addText: e.extra.addText,
						removeText: e.extra.removeText
					}, 'remove');
					that.updateGarageCount(e.stopCount);
					$('.itinerary-garage-stops .sortable').append(e.html);
					that.itineraryButtonWorking($this, false);
					$('.no-stops-text').remove();
				}, function (e) {
					flash(e);
				});
			});

			$('body').on('click', '.js-remove-from-itinerary', function (e) {
				e.preventDefault();
				e.stopPropagation();

				var $this = $(this);
				var type = $this.attr('data-type');
				var id = $this.attr('data-id');
				var itineraryStop = new ItineraryStop(id, type);

				if (itineraryStop.getId() == '' || !Number(itineraryStop.getId())) {
					return false;
				}

				that.itineraryButtonWorking($this);

				that.removeItineraryStop(itineraryStop, function (e) {
					that.changeItineraryAction({
						stopID: e.stopId,
						addText: e.extra.addText,
						removeText: e.extra.removeText
					}, 'add');
					that.removeStopElement(e.stopId);
					that.updateGarageCount(e.stopCount);
					that.itineraryButtonWorking($this, false);
				});
			});
		},

		/**
   * Add a stop to the itinerary
   *
   * @param itineraryStop
   * @param success
   * @param failed
   */
		addItineraryStop: function addItineraryStop(itineraryStop, _success, failed) {
			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'add_itinerary_stop',
					id: itineraryStop.getId(),
					itinerary: itineraryStop.getItineraryId(),
					type: itineraryStop.getType()
				},
				success: function success(e) {
					if (e.status && typeof _success === 'function') {
						_success(e);
					} else if (typeof failed === 'function') {
						failed(e);
					}

					that.user_itinerary.stops = e.itinerary_stops;
				}
			});
		},

		/**
   * Remove a stop from the itinerary
   *
   * @param itineraryStop
   * @param success
   * @param failed
   */
		removeItineraryStop: function removeItineraryStop(itineraryStop, _success2, failed) {
			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'remove_itinerary_stop',
					itinerary: that.user_itinerary.itineraryId,
					id: itineraryStop.getId(),
					type: itineraryStop.getType()
				},
				success: function success(e) {
					if (e.status && typeof _success2 === 'function') {
						_success2(e);
					} else if (typeof failed === 'function') {
						failed(e);
					}

					that.user_itinerary.stops = e.itinerary_stops;
				}
			});
		},

		/**
   * Remove an HTML itinerary stop from the garage
   *
   * @param stopID
   */
		removeStopElement: function removeStopElement(stopID) {
			var $stop = $('.itinerary-garage-stop-wrap[data-id="' + stopID + '"]');
			$stop.slideUp(500);
		},

		/**
   * Change the itinerary action on the post. switchTo
   * action defaults to "add"
   *
   * @param stopID
   * @param switchTo
   */
		changeItineraryAction: function changeItineraryAction(data, switchTo) {
			var $target = $('.btn-itinerary[data-id="' + data.stopID + '"]');
			var addClass = 'js-add-to-itinerary add';
			var removeClass = 'js-remove-from-itinerary remove';

			if (typeof switchTo === 'undefined') {
				switchTo = 'add';
			}

			switch (switchTo) {
				case 'remove':
					$target.removeClass(addClass).addClass(removeClass).find('.text').text(data.removeText);
					break;
				default:
					$target.removeClass(removeClass).addClass(addClass).find('.text').text(data.addText);
					break;
			}
		},

		/**
   * Get the fresh contents of the garage
   */
		refreshGarage: function refreshGarage() {
			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'refresh_garage'
				},
				success: function success(e) {
					$('.itinerary-garage-stops-wrap').html(e.html);
					that.updateGarageCount(e.stopCount);
					that.allowSortable();
				}
			});
		},

		/**
   * Show that we are working while adding/remove items to
   * the itinerary
   *
   * @param $obj
   * @param working
   */
		itineraryButtonWorking: function itineraryButtonWorking($obj, working) {
			if (typeof working === 'undefined') {
				working = true;
			}

			if (working) {
				$obj.addClass('working');
			} else {
				$obj.removeClass('working');
			}
		},

		/**
   * Update the HTML itinerary stop count on the garage
   *
   * @param count
   */
		updateGarageCount: function updateGarageCount(count) {
			$('.itinerary-stop-count').addClass('added');
			setTimeout(function () {
				$('.itinerary-stop-count').text(count).removeClass('added');
			}, 500);
		},

		/**
   * Create an itinerary
   * This will make an ajax call and create the itinerary
   * in the database and then return the new ID
   *
   * @param callback
   */
		createItinerary: function createItinerary(callback) {
			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'new_itinerary',
					queriedObjectId: ajax.object_id
				},
				success: function success(e) {
					that.setCookie(e.data.itinerary.itineraryId, e.data.itinerary.userId, function () {

						that.getCookie(function (e) {
							// careful, the 'e' changes
							that.user_itinerary = e;
							if (typeof callback === 'function') {
								callback(e.itineraryId);
							}
						});
					});

					if ($('.js-itinerary-add-to-placeholder').length) {
						$('.js-itinerary-add-to-placeholder').replaceWith(e.data.html);
					}
				},
				complete: function complete(e) {}
			});
		},
		/**
   * Cookie is deprecated, we are now using local storage
   *
   * Set the local storage items for userId and itineraryId
   *
   * There is a very good chance that this will be enhanced
   * & upgraded in the future to actually hold the itinerary
   * stops
   *
   * @param itineraryId
   * @param userId
   * @param callback Function to be called after full executed
   */
		setCookie: function setCookie(itineraryId, userId, callback) {
			this.cookie = {
				itineraryId: itineraryId,
				userId: userId
			};

			localforage.setItem('itineraryId', itineraryId).then(function () {
				localforage.setItem('userId', userId).then(function () {
					callback(itineraryId, userId);
				});
			});
		},
		/**
   * Cookie is deprecated, we are now using local storage
   *
   * Get the itinerary from local storage
   *
   * @param callback
   */
		getCookie: function getCookie(callback) {
			var that = this;
			this.cookie = {};

			localforage.iterate(function (val, key, i) {
				that.cookie[key] = val;
			}).then(function () {
				if (typeof callback === 'function') {
					callback(that.cookie);
				}
			}).catch(function (e) {
				console.log(e);
			});
		},
		/**
   * @TODO Needs to be refactored
   *
   * Retrieve the stops of the itinerary and set action buttons
   * (probably better off calling loadItinerary()
   * @param callback
   */
		getStops: function getStops(callback) {
			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'get_itinerary_stops'
				},
				success: function success(e) {
					$('body').append(e.html);

					for (var i in e.itinerary_stops) {
						if (!e.itinerary_stops.hasOwnProperty(i)) continue;
						var id = e.itinerary_stops[i];

						that.changeItineraryAction({
							stopID: id,
							addText: e.extra.addText,
							removeText: e.extra.removeText
						}, 'remove');
					}
				},
				complete: function complete() {
					if (typeof callback === 'function') {
						callback(that);
					}
				}

			});
		},
		/**
   * Load the itinerary and set the action buttons accordingly
   */
		loadItinerary: function loadItinerary() {
			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'load_itinerary',
					itinerary: that.user_itinerary.itineraryId,
					post_id: typeof post_id != 'undefined' ? post_id : 0
				},
				success: function success(e) {
					$('body').append(e.html);
					that.user_itinerary.stops = e.itinerary_stops;

					$('[data-itinerary-id]').attr('data-itinerary-id', that.user_itinerary.itineraryId);

					for (var i in e.itinerary_stops) {
						if (!e.itinerary_stops.hasOwnProperty(i)) continue;
						var id = e.itinerary_stops[i];

						that.changeItineraryAction({
							stopID: id,
							addText: e.extra.addText,
							removeText: e.extra.removeText
						}, 'remove');
					}

					that.allowSortable();

					that.user_itinerary.isLoaded = true;

					$('.itinerary-garage.initializing').removeClass('initializing');
				}
			});
		},

		/**
   * Show the itinerary garage (the window in the lower right)
   */
		showGarage: function showGarage() {
			var postID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var that = this;

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'get_itinerary_garage',
					itinerary: that.user_itinerary.itineraryId,
					post_id: postID
				},
				success: function success(e) {
					$('body').append(e.html);

					that.allowSortable();
				}
			});
		},
		/**
   * Update the order of the itinerary items
   *
   * @param sortedIDs
   */
		updateGarageStopOrder: function updateGarageStopOrder(sortedIDs) {
			var that = this;
			var data = {
				action: 'update_garage_stop_order',
				ids: sortedIDs,
				itinerary: that.user_itinerary.itineraryId
			};

			$.ajax({
				type: 'get',
				url: ajax.url,
				data: data,
				success: function success(e) {
					wisnet.App.flash(e);
				}
			});
		},
		allowSortable: function allowSortable() {
			var that = this;
			$('.sortable').sortable({
				containment: 'parent',
				tolerance: 'pointer',
				start: function start(event, ui) {
					var $contents = $(ui.helper).html();
					$('.ui-sortable-placeholder').html($contents);
				},
				update: function update() {
					var sorted = $(this).sortable('toArray', {
						attribute: 'data-id'
					});

					that.updateGarageStopOrder(sorted);
				}
			});
		},
		/**
   * Show the itinerary items on the page
   *
   * @param element the CSS selector of the element to send the data
   */
		showItinerary: function showItinerary(element) {
			var that = this;

			if (this.user_itinerary.isLoaded) {
				$.ajax({
					type: 'get',
					url: ajax.url,
					data: {
						action: 'show_itinerary',
						itinerary: that.user_itinerary.itineraryId
					},
					success: function success(e) {
						if (typeof e.data !== 'undefined' && e.data.stops) {
							$(element).html(e.data.stops);
						}
					}
				});
			} else {
				setTimeout(function () {
					that.showItinerary(element);
				}, 300);
			}
		}
	});

	$('body').on('click', '.itinerary-garage-toggle', function () {
		$(this).toggleClass('active');
		$('.itinerary-garage, body').toggleClass('itinerary-garage-viewing');
		$('.itinerary-garage-contents').toggleClass('visible');
	});

	wisnet.App.itinerary = new $itinerary();
})(jQuery);
'use strict';

console.log(ajax, ajax.isAdmin);
if (ajax.isAdmin == 1) {

	(function ($) {

		$('body').on('render/chart', function (e, data) {
			$('.visualizer-front-' + data.id).attr('data-id', data.id).attr('data-imageURI', data.image);
		});

		$.each($('.visualizer-front'), function () {
			var id = $(this).attr('id').split('-')[1];

			$(this).wrap('<div class="admin-save-png__wrap"></div>');
			var $btn = $('<button />', {
				class: 'save-chart-as-png btn btn-info',
				type: 'button'
			}).text('Save as PNG');

			if (jQuery.inArray(id, ajax.itinerary_converted_images) !== -1) {
				$btn.text('Update PNG').removeClass('btn-info').addClass('btn-warning');
			}

			$(this).closest('.admin-save-png__wrap').append($btn);
		});

		$('body').on('click', '.save-chart-as-png', function () {
			var $this = $(this);
			var $chart = $(this).closest('.admin-save-png__wrap').find('.visualizer-front');
			var id = $chart.attr('data-id');
			var imageURI = $chart.attr('data-imageURI');

			dataUrl2Png(imageURI, id, function (response) {
				console.log(response);
				if (response.success) {
					$this.removeClass('btn-info').addClass('btn-warning').text('Update PNG');
				} else {
					alert('could not save image');
				}
			});
		});
	})(jQuery);
}
'use strict';

function importSVG(sourceSVG, targetCanvas) {
	var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

	// https://developer.mozilla.org/en/XMLSerializer
	// computedStyleToInlineStyle(sourceSVG, {recursive: true});
	var svg_xml = new XMLSerializer().serializeToString(sourceSVG);

	var ctx = targetCanvas.getContext('2d');

	var svgSize = sourceSVG.getBoundingClientRect();
	targetCanvas.width = width ? width : svgSize.width;
	targetCanvas.height = height ? height : svgSize.height;

	// this is just a JavaScript (HTML) image
	var img = new Image();
	// http://en.wikipedia.org/wiki/SVG#Native_support
	// https://developer.mozilla.org/en/DOM/window.btoa
	img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg_xml)), true);

	img.onload = function () {
		// after this, Canvas’ origin-clean is DIRTY
		ctx.drawImage(img, 0, 0);

		if (img.src !== 'data:,') {
			canvas2Png(targetCanvas);
		}
	};
}

function computedStyleToInlineStyle(element, options) {
	if (!element) {
		throw new Error('No element specified.');
	}

	if (!options) {
		options = {};
	}

	if (options.recursive) {
		Array.prototype.forEach.call(element.children, function (child) {
			computedStyleToInlineStyle(child, options);
		});
	}

	var computedStyle = getComputedStyle(element);
	for (var i = 0; i < computedStyle.length; i++) {
		var property = computedStyle.item(i);
		if (!options.properties || options.properties.indexOf(property) >= 0) {
			var value = computedStyle.getPropertyValue(property);
			element.style[property] = value;
		}
	}
}

function canvas2Png(canvas) {
	var dataUrl = canvas.toDataURL();

	console.log(dataUrl);

	jQuery.ajax({
		type: 'post',
		url: ajax.url,
		data: {
			action: 'itinerary_save_png',
			image: dataUrl,
			id: jQuery(canvas).attr('data-id')
		}
	});
}

function dataUrl2Png(dataUrl, id, callback) {
	jQuery.ajax({
		type: 'post',
		url: ajax.url,
		data: {
			action: 'itinerary_save_png',
			image: dataUrl,
			id: id
		},
		success: function success(response) {
			console.log(response);
			callback(response);
		}
	});
}

jQuery(function ($) {

	// let observer = new MutationObserver(function (mutations) {
	// 	mutations.forEach(function (mutation) {
	// 		if (!mutation.addedNodes) return;
	//
	// 		for (var i = 0; i < mutation.addedNodes.length; i++) {
	// 			// do things to your newly added nodes here
	// 			let node = mutation.addedNodes[i];
	// 			// console.log(node);
	// 			if (node.tagName && node.tagName.length > 0 && node.tagName.toLowerCase() === 'svg') {
	// 				let $node = $(node);
	// 				let id = $node.closest('.visualizer-front').attr('class').replace('visualizer-front ', '').trim();
	//
	// 				if (!ajax.itinerary_converted_images[id]) {
	// 					let $canvas = $('<canvas data-id="' + id + '"></canvas>');
	// 					$node.find('rect').css({
	// 						overflow: 'hidden'
	// 					});
	// 					$node.find('text').css({
	// 						backgroundColor: 'white'
	// 					});
	// 					let $firstG = $node.find('g:first-of-type').first();
	// 					// $node.after($canvas);
	// 					importSVG(node, $canvas[0], $firstG.height(), $firstG.width());
	// 				}
	// 			}
	// 		}
	// 	});
	// });
	//
	// observer.observe(document.body, {
	// 	childList: true
	// 	, subtree: true
	// 	, attributes: false
	// 	, characterData: false
	// });

	// stop watching using:
	// 	observer.disconnect();
});