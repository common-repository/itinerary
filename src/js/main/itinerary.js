/**
 * Created by michael on 11/21/16.
 */
function ItineraryStop(id, itineraryId, type) {
	
	let _id;
	let _itineraryId;
	let _type;
	let self = this;
	
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

let Itinerary;

function flash(e) {
	window.console.log('-----------FLASH------------');
	console.log(e);
	window.console.log('-----------FLASH------------');
}

wisnet.App.flash = flash;

(function ($) {
	
	$.itinerary = function () {
		let version = '1.0.0';
		let self = this;
		
		this._run = function (e) {
			self.init();
			return self;
		};
		this._loadItinerary = function (e) {
			self.loadItinerary(e);
			return self;
		};
	};
	
	let $itinerary = $.itinerary;
	
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
		init: function () {
			let that = this;
			localforage.config({
				driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
				name: 'Itinerary',
				version: that.version,
				size: 4980736, // Size of database, in bytes. WebSQL-only for now.
				storeName: 'wp_itinerary', // Should be alphanumeric, with underscores.
				description: 'Itinerary plugin for WordPress.'
			});
			
			let user_itinerary;
			
			this.getCookie(function (itinerary) {
				that.user_itinerary = itinerary;
				
				if (!itinerary || typeof itinerary.itineraryId === 'undefined') {
					that.createItinerary(that._loadItinerary);
				}
				else {
					that._loadItinerary(itinerary.itineraryId);
				}
			});
			
			this.registerEvents();
		},
		
		registerEvents: function () {
			let that = this;
			
			$('body').on('click', '.js-add-to-itinerary', function () {
				let $this = $(this);
				let type = $this.attr('data-type');
				let id = $this.attr('data-id');
				let itineraryId = $this.attr('data-itinerary-id');
				let itineraryStop = new ItineraryStop(id, itineraryId, type);
				
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
				
				let $this = $(this);
				let type = $this.attr('data-type');
				let id = $this.attr('data-id');
				let itineraryStop = new ItineraryStop(id, type);
				
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
		addItineraryStop: function (itineraryStop, success, failed) {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'add_itinerary_stop',
					id: itineraryStop.getId(),
					itinerary: itineraryStop.getItineraryId(),
					type: itineraryStop.getType()
				},
				success: function (e) {
					if (e.status && typeof success === 'function') {
						success(e);
					}
					else if (typeof failed === 'function') {
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
		removeItineraryStop: function (itineraryStop, success, failed) {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'remove_itinerary_stop',
					itinerary: that.user_itinerary.itineraryId,
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
					
					that.user_itinerary.stops = e.itinerary_stops;
				}
			});
		},
		
		/**
		 * Remove an HTML itinerary stop from the garage
		 *
		 * @param stopID
		 */
		removeStopElement: function (stopID) {
			let $stop = $('.itinerary-garage-stop-wrap[data-id="' + stopID + '"]');
			$stop.slideUp(500);
		},
		
		/**
		 * Change the itinerary action on the post. switchTo
		 * action defaults to "add"
		 *
		 * @param stopID
		 * @param switchTo
		 */
		changeItineraryAction: function (data, switchTo) {
			let $target = $('.btn-itinerary[data-id="' + data.stopID + '"]');
			let addClass = 'js-add-to-itinerary add';
			let removeClass = 'js-remove-from-itinerary remove';
			
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
		refreshGarage: function () {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'refresh_garage'
				},
				success: function (e) {
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
		itineraryButtonWorking: function ($obj, working) {
			if (typeof working === 'undefined') {
				working = true;
			}
			
			if (working) {
				$obj.addClass('working');
			}
			else {
				$obj.removeClass('working');
			}
		},
		
		/**
		 * Update the HTML itinerary stop count on the garage
		 *
		 * @param count
		 */
		updateGarageCount: function (count) {
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
		createItinerary: function (callback) {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'new_itinerary',
					queriedObjectId: ajax.object_id
				},
				success: function (e) {
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
				complete: function (e) {
				
				}
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
		setCookie: function (itineraryId, userId, callback) {
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
		getCookie: function (callback) {
			let that = this;
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
		getStops: function (callback) {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'get_itinerary_stops'
				},
				success: function (e) {
					$('body').append(e.html);
					
					for (let i in e.itinerary_stops) {
						if (!e.itinerary_stops.hasOwnProperty(i)) continue;
						let id = e.itinerary_stops[i];
						
						that.changeItineraryAction({
							stopID: id,
							addText: e.extra.addText,
							removeText: e.extra.removeText
						}, 'remove');
					}
				},
				complete: function () {
					if (typeof callback === 'function') {
						callback(that);
					}
				}
				
			});
		},
		/**
		 * Load the itinerary and set the action buttons accordingly
		 */
		loadItinerary: function () {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'load_itinerary',
					itinerary: that.user_itinerary.itineraryId,
					post_id: typeof post_id != 'undefined' ? post_id : 0
				},
				success: function (e) {
					$('body').append(e.html);
					that.user_itinerary.stops = e.itinerary_stops;
					
					$('[data-itinerary-id]').attr('data-itinerary-id', that.user_itinerary.itineraryId);
					
					for (let i in e.itinerary_stops) {
						if (!e.itinerary_stops.hasOwnProperty(i)) continue;
						let id = e.itinerary_stops[i];
						
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
		showGarage: function (postID = 0) {
			let that = this;
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: {
					action: 'get_itinerary_garage',
					itinerary: that.user_itinerary.itineraryId,
					post_id: postID
				},
				success: function (e) {
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
		updateGarageStopOrder: function (sortedIDs) {
			let that = this;
			let data = {
				action: 'update_garage_stop_order',
				ids: sortedIDs,
				itinerary: that.user_itinerary.itineraryId
			};
			
			$.ajax({
				type: 'get',
				url: ajax.url,
				data: data,
				success: function (e) {
					wisnet.App.flash(e);
				}
			});
		},
		allowSortable: function () {
			let that = this;
			$('.sortable').sortable({
				containment: 'parent',
				tolerance: 'pointer',
				start: function (event, ui) {
					let $contents = $(ui.helper).html();
					$('.ui-sortable-placeholder').html($contents);
				},
				update: function () {
					let sorted = $(this).sortable('toArray', {
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
		showItinerary: function (element) {
			let that = this;
			
			if (this.user_itinerary.isLoaded) {
				$.ajax({
					type: 'get',
					url: ajax.url,
					data: {
						action: 'show_itinerary',
						itinerary: that.user_itinerary.itineraryId
					},
					success: function (e) {
						if (typeof e.data !== 'undefined' && e.data.stops) {
							$(element).html(e.data.stops);
						}
					}
				});
			}
			else {
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
	
})
(jQuery);