if (ajax.isAdmin == 1) {
	
	(function ($) {
		
		$('body').on('render/chart', function (e, data) {
			$('.visualizer-front-' + data.id).attr('data-id', data.id).attr('data-imageURI', data.image);
		});
		
		$.each($('.visualizer-front'), function () {
			let id = $(this).attr('id').split('-')[1];
			
			$(this).wrap('<div class="admin-save-png__wrap"></div>');
			let $btn = $('<button />', {
				class: 'save-chart-as-png btn btn-info',
				type: 'button'
			}).text('Save as PNG');
			
			if (jQuery.inArray(id, ajax.itinerary_converted_images) !== -1) {
				$btn.text('Update PNG').removeClass('btn-info').addClass('btn-warning');
			}
			
			$(this).closest('.admin-save-png__wrap').append($btn);
		});
		
		$('body').on('click', '.save-chart-as-png', function () {
			let $this = $(this);
			let $chart = $(this).closest('.admin-save-png__wrap').find('.visualizer-front');
			let id = $chart.attr('data-id');
			let imageURI = $chart.attr('data-imageURI');
			
			dataUrl2Png(imageURI, id, function (response) {
				if (response.success) {
					$this.removeClass('btn-info').addClass('btn-warning').text('Update PNG');
				}
				else {
					alert('could not save image');
				}
			});
		});
	})(jQuery);
}