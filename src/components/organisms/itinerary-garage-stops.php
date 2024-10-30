<!-- src/components/organisms/itinerary-garage-stops.php -->
<?php


use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly
?>
<section class="itinerary-garage-stops">
	<div class="itinerary-container">
		<div class="itinerary-row sortable">
			<?php
			global $Itinerary;

			if ($Itinerary) {

				$stops = $Itinerary->model->getStops();
				if ($stops) {
					$i = 1;
					foreach ($stops as $stop) {
						$Itinerary_Stop_Model = new Itinerary_Stop_Model();
						$stop = $Itinerary_Stop_Model->loadByPlaceId($stop->place_id);

						Util::give('itinerary_stop_stop', $stop);

						Util::give('itinerary_stop_iterator', $i);
						get_itinerary_part(ITINERARY_MOLECULE . '/itinerary-garage-stop');

						$i++;
					}
					wp_reset_postdata();
				}
				else {
					?>
					<div class="itinerary-column itinerary-col-xs-12 no-stops-text">
						<h3><?= apply_filters('itinerary_empty_text', get_option('itinerary_empty_text')); ?></h3>
					</div>
					<?php
				}
			}
			?>
		</div>
	</div>
</section>