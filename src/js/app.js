/**
 * Created by michael on 6/19/17.
 */
const wisnet = {
        App: {
            name: 'Itinerary',
            version: '1.0.0',
            _debug: true,
            _property: {
                cookieName: 'user_itinerary',
                cookie: false,
            },
            fn: {},
            /**
             * Set a property. This will overwrite a property if it currently exists
             * @param key
             * @param val
             */
            setProp: function (key, val) {
                let self = this;
                if (wisnet.App._debug && this._property.hasOwnProperty(key)) {
                    console.warn('Overwriting property: ' + key + '; Old Value: ' + this.getProp(key) + '; New Value: ', val);
                }
                this._property[key] = val;
            },
            /**
             * Get a property
             *
             * @param key
             * @param def Return a default value if the key is not found
             * @returns {*}
             */
            getProp: function (key, def) {
                if (this._property.hasOwnProperty(key)) {
                    return this._property[key];
                }

                return (typeof def !== 'undefined' ? def : null);
            },
            /**
             * Add a function to the the app functions
             *
             * @param name string
             * @param fn function
             */
            addFn: function (name, fn) {
                if (!this.fn.hasOwnProperty(name)) {
                    if (typeof fn === 'function') {
                        this.fn[name] = fn;
                    }
                }
            },
            /**
             * Alias to @see addFn
             *
             * @param name string
             * @param fn
             */
            addFunction: function (name, fn) {
                this.addFn(name, fn);
            },
            /**
             * Call a function if it exists with X # of args that are passed as an array
             * @param name string
             * @param args array
             */
            call: function (name, args) {
                if (typeof this.fn[name] === 'function') {
                    if (typeof args === 'undefined') {
                        args = [];
                    }
                    if (this._debug) {
                        console.log('Calling function: ' + name + ' with args: ', args);
                    }

                    this.fn[name].apply(name, args);
                }
                else if (this._debug) {
                    console.error('Failed calling function: ' + name + ' with args: ', args);
                }
            }
        }
    }
;