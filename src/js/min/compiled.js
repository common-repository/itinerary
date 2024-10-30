// Copyright (c) 2015 Florian Hartmann, https://github.com/florian https://github.com/florian/cookie.js

!function (document, undefined) {

	var cookie = function () {
		return cookie.get.apply(cookie, arguments);
	};

	var utils = cookie.utils =  {

		// Is the given value an array? Use ES5 Array.isArray if it's available.
		isArray: Array.isArray || function (value) {
			return Object.prototype.toString.call(value) === '[object Array]';
		},

		// Is the given value a plain object / an object whose constructor is `Object`?
		isPlainObject: function (value) {
			return !!value && Object.prototype.toString.call(value) === '[object Object]';
		},

		// Convert an array-like object to an array – for example `arguments`.
		toArray: function (value) {
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
		encode: function (value) {
			return String(value).replace(/[,;"\\=\s%]/g, function (character) {
				return encodeURIComponent(character);
			});
		},

		decode: function (value) {
			return decodeURIComponent(value);
		},

		// Return fallback if the value is not defined, otherwise return value.
		retrieve: function (value, fallback) {
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
			var expires = options.expires !== undefined ? options.expires : (this.defaults.expires || ''),
				expiresType = typeof(expires);

			if (expiresType === 'string' && expires !== '') expires = new Date(expires);
			else if (expiresType === 'number') expires = new Date(+new Date + 1000 * this.expiresMultiplier * expires); // This is needed because IE does not support the `max-age` cookie attribute.

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
	},

		cookie.remove = function (keys) {
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
			return {cookie: cookie};
		});
	} else if (typeof exports !== 'undefined') {
		exports.cookie = cookie;
	} else window.cookie = cookie;

// If used e.g. with Browserify and CommonJS, document is not declared.
}(typeof document === 'undefined' ? null : document);
/**
 * Created by michael on 11/21/16.
 */
function ItineraryStop(id, itineraryId, type) {
	
	var _id;
	var _itineraryId;
	var _type;
	var self = this;
	
	this.setId = function (value) {
		_id = value;
	}
	
	this.getId = function () {
		return _id;
	}
	
	this.setItineraryId = function (value) {
		_itineraryId = value;
	}
	
	this.getItineraryId = function () {
		return _itineraryId;
	}
	
	this.setType = function (value) {
		_type = value;
	}
	
	this.getType = function () {
		return 'type';
	}
	
	this.init = function () {
		this.setId(id);
		this.setItineraryId(itineraryId);
		this.setType(type);
	}
	
	this.init();
	
}

var Itinerary;

function flash(e) {
	console.log('-----------FLASH------------');
	clog(e);
	console.log('-----------FLASH------------');
}

(function ($) {
	
	$('body').on('click', '.js-add-to-itinerary', function () {
		var $this = $(this);
		var type = $this.attr('data-type');
		var id = $this.attr('data-id');
		var itineraryId = $this.attr('data-itinerary-id');
		var itineraryStop = new ItineraryStop(id, itineraryId, type);
		
		if (itineraryStop.getId() == '' || !Number(itineraryStop.getId())) {
			return false;
		}
		
		itineraryButtonWorking($this);
		
		addItineraryStop(itineraryStop, function (e) {
			changeItineraryAction(e.stopId, 'remove');
			updateGarageCount(e.stopCount);
			$('.itinerary-garage-stops .sortable').append(e.html);
			itineraryButtonWorking($this, false);
		}, function (e) {
			flash(e);
		});
		
	});
	
	$('body').on('click', '.js-remove-from-itinerary', function () {
		var $this = $(this);
		var type = $this.attr('data-type');
		var id = $this.attr('data-id');
		var itineraryStop = new ItineraryStop(id, type);
		
		if (itineraryStop.getId() == '' || !Number(itineraryStop.getId())) {
			return false;
		}
		
		itineraryButtonWorking($this);
		
		removeItineraryStop(itineraryStop, function (e) {
			changeItineraryAction(e.stopId, 'add');
			removeStopElement(e.stopId);
			updateGarageCount(e.stopCount);
			itineraryButtonWorking($this, false);
		});
		
	});
	
	function addItineraryStop(itineraryStop, success, failed) {
		
		$.ajax({
			type: 'get',
			url: ajax.url,
			data: {
				action: 'add_itinerary_stop',
				id: itineraryStop.getId(),
				itineraryId: itineraryStop.getItineraryId(),
				type: itineraryStop.getType()
			},
			success: function (e) {
				if (e.status && typeof success === 'function') {
					success(e);
				}
				else if (typeof failed === 'function') {
					failed(e);
				}
			}
		});
	};
	
	function removeItineraryStop(itineraryStop, success, failed) {
		$.ajax({
			type: 'get',
			url: ajax.url,
			data: {
				action: 'remove_itinerary_stop',
				id: itineraryStop.getId(),
				type: itineraryStop.getType()
			},
			success: function (e) {
				if (e.status && typeof success === 'function') {
					success(e);
				}
				else if (typeof failed === 'function') {
					failed(e);
				}
			}
		});
	};
	
	function removeStopElement(stopID) {
		var $stop = $('.itinerary-garage-stop [data-id="' + stopID + '"]').parent().parent();
		$stop.slideUp(500);
	}
	
	function changeItineraryAction(stopID, switchTo) {
		var $target = $('[data-id="' + stopID + '"]');
		var addClass = 'js-add-to-itinerary add';
		var removeClass = 'js-remove-from-itinerary remove';
		
		if (typeof switchTo === 'undefined') {
			switchTo = 'add';
		}
		
		switch (switchTo) {
			case 'remove':
				$target.removeClass(addClass).addClass(removeClass);
				break;
			default:
				$target.removeClass(removeClass).addClass(addClass);
				break;
		}
	}
	
	function refreshGarage() {
		$.ajax({
			type: 'get',
			url: ajax.url,
			data: {
				action: 'refresh_garage'
			},
			success: function (e) {
				$('.itinerary-garage-stops-wrap').html(e.html);
				updateGarageCount(e.stopCount);
				allowSortable();
			}
		});
	}
	
	function itineraryButtonWorking($obj, working) {
		if (typeof working === 'undefined') {
			working = true;
		}
		
		if (working) {
			$obj.addClass('working');
		}
		else {
			$obj.removeClass('working');
		}
	}
	
	function updateGarageCount(count) {
		$('.itinerary-stop-count').addClass('added');
		setTimeout(function () {
			$('.itinerary-stop-count').text(count).removeClass('added');
		}, 500);
	}
	
	$('body').on('click', '.itinerary-garage-toggle', function () {
		$(this).toggleClass('active');
		$('.itinerary-garage, body').toggleClass('itinerary-garage-viewing');
		$('.itinerary-garage-contents').toggleClass('visible');
	});
	
	Itinerary = {
		cookieName: 'user_itinerary',
		cookie: false,
		
		init: function () {
			var user_itinerary = this.getCookie();
			
			if (!user_itinerary) {
				this.createItinerary();
			}
			
			console.log(user_itinerary, this);
		},
		createItinerary: function (callback) {
			var that = this;
			console.log('create: ', ajax);
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'new_itinerary',
					queriedObjectId: ajax.object_id
				},
				success: function (e) {
					console.log('created itinerary');
					console.log(e.data);
					that.setCookie(e.data.itinerary.itineraryId, e.data.itinerary.userId);
					
					if ($('.js-itinerary-add-to-placeholder').length) {
						$('.js-itinerary-add-to-placeholder').replaceWith(e.data.html);
					}
				},
				
				complete: function (e) {
					console.log(e);
				}
			})
		},
		setCookie: function (itineraryId, userId) {
			var object = {
				itineraryId: itineraryId,
				userId: userId
			};
			this.cookie = object;
			
			console.log(this.cookie);
			
			cookie.set(this.cookieName, JSON.stringify(object));
		},
		getCookie: function () {
			this.cookie = JSON.parse(cookie.get(this.cookieName, false));
			return this.cookie;
		},
		getStops: function (callback) {
			var that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'get_itinerary_stops'
				},
				success: function (e) {
					console.log(e);
					$('body').append(e.html);
					
					for (var i in e.itinerary_stops) {
						if (!e.itinerary_stops.hasOwnProperty(i)) continue;
						var id = e.itinerary_stops[i];
						
						changeItineraryAction(id, 'remove');
					}
				},
				complete: function () {
					if (typeof callback === 'function') {
						callback(that);
					}
				}
				
			});
		},
		showGarage: function () {
			var that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'get_itinerary_garage'
				},
				success: function (e) {
					$('body').append(e.html);
					
					that.allowSortable();
				}
				
			});
			
		},
		updateGarageStopOrder: function (sortedIDs) {
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'update_garage_stop_order',
					ids: sortedIDs
				},
				success: function (e) {
					App.flash(e);
				}
			});
		},
		allowSortable: function () {
			var that = this;
			$(".sortable").sortable({
				update: function () {
					var sorted = $(this).sortable('toArray', {
						attribute: 'data-stop-id'
					});
					
					that.updateGarageStopOrder(sorted);
				}
			})
		}
	};
	
	Itinerary.init();
	
	setTimeout(function () {
		$('.mh-garage-stop').matchHeight({
			byRow: false
		});
		$('.itinerary-garage.initializing').removeClass('initializing');
	}, 1000)
	
})(jQuery);