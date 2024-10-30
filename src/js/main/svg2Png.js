function importSVG(sourceSVG, targetCanvas, height = null, width = null) {
	// https://developer.mozilla.org/en/XMLSerializer
	// computedStyleToInlineStyle(sourceSVG, {recursive: true});
	const svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
	
	const ctx = targetCanvas.getContext('2d');
	
	var svgSize = sourceSVG.getBoundingClientRect();
	targetCanvas.width = width ? width : svgSize.width;
	targetCanvas.height = height ? height : svgSize.height;
	
	// this is just a JavaScript (HTML) image
	let img = new Image();
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
	
	let computedStyle = getComputedStyle(element);
	for (let i = 0; i < computedStyle.length; i++) {
		let property = computedStyle.item(i);
		if (!options.properties || options.properties.indexOf(property) >= 0) {
			let value = computedStyle.getPropertyValue(property);
			element.style[property] = value;
		}
	}
}

function canvas2Png(canvas) {
	let dataUrl = canvas.toDataURL();
	
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
		success: function (response) {
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