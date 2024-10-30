<!-- src/components/organisms/itinerary-garage.php -->
<?php

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

global $Itinerary;
/** Itinerary_Settings_Controller */
global $ItinerarySettings;

if ($Itinerary) {
	?>
	<section class="itinerary-garage initializing">
		<div class="itinerary-garage-inner">
			
			<div class="itinerary-garage-contents">
				<div class="itinerary-garage-toggle__wrap">
					<?= do_shortcode('[itinerary_buttons]'); ?>

					<div class="itinerary-garage-toggle">
						<h4 class=""><?= apply_filters('itinerary_garage_title', $ItinerarySettings->model()->getGarageTitle()); ?>
							<small class="itinerary-stop-count"><?= $Itinerary->model->getNumberOfStops(); ?></small>
						</h4>
					</div>
				</div>
				<section class="itinerary-garage-stops-wrap">
					<?php
					$dkpdfPost = (object)array('ID' => 'custom');
					add_filter('itinerary_button_view_text', function ($text) {
						return $text;
					}, 99);
					?>
					<div class="text-right">
						<?php
						do_action('itinerary_button_view');
						?>
					</div>
					<?php
					Util::give('search_results_do_itinerary_buttons', false);
					get_itinerary_part(ITINERARY_ORGANISM . '/itinerary-garage-stops');
					?>
				</section>
			</div>
		</div>
	</section>
	<?php
}