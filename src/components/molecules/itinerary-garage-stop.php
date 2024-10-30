<!-- src/components/molecules/itinerary-garage-stop.php -->
<?php

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

/** @var Itinerary_Stop_Model $stop */
$stop = Util::receive('itinerary_stop_stop', false);
global $Itinerary;

?>
<div class="itinerary-col-xs-12 itinerary-col-sm-4 itinerary-col-md-3 itinerary-garage-stop-wrap js-order"
     data-id="<?= esc_attr($stop->getPlaceId()); ?>">
	<section class="itinerary-garage-stop">
		<div class="activity-box">
			<?php
			if ($stop->getPermalink()){
			?>
			<a href="<?= esc_url($stop->getPermalink()); ?>">
				<?php
				}
				?>
				<div class="activity-box-image"
				     style="background-image: url(<?= esc_url($stop->getFeaturedImage()); ?>);">
					<img class="img-responsive" src="<?= esc_url($stop->getFeaturedImage()); ?>">
				</div>
				<div class="activity-box-text">
					<span><?= esc_html($stop->getPostTitle()); ?></span>
					<p><?= do_action('itinerary_button_remove', $Itinerary->model->getItineraryId(), $stop->getPlaceId()); ?></p>
				</div>
				<?php
				if ($stop->getPermalink()){
				?>
			</a>
		<?php
		echo do_action('itinerary_button_order');
		}
		?>

		</div>

	</section>
</div>