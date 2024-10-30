<!-- src/components/organisms/pdf-itinerary-stop.php -->
<?php

use Itinerary\Util;

global $ItineraryStop;

if ($ItineraryStop && ($ItineraryStop instanceof Itinerary_Stop_Model)) {
	?>
	<div class="pdf-stop">
		<div class="pdf-stop-text">
			<a href="<?= $ItineraryStop->getPermalink(); ?>">
				<h3 class="pdf-stop-title"><?= esc_html($ItineraryStop->getPostTitle()); ?></h3>
			</a>
			<?php

			if ($ItineraryStop->hasFeaturedImage()) {
				?>
				<div class="pdf-stop-image">
					<img class="img-responsive img-center" src="<?= $ItineraryStop->getFeaturedImage(true); ?>">
				</div>
				<?php
			}
			?>
			<div><?= do_shortcode($ItineraryStop->getPostContent(true)); ?></div>
			<?php
			if (Util::receive('pdf_do_itinerary_buttons', false)) {
				do_action('itinerary_buttons', get_the_ID());
			}
			?>
		</div>
	</div>
	<?php
}
else if ($ItineraryStop) {
	?>
	<div class="pdf-stop">
		<?php
		$post = $ItineraryStop;
		setup_postdata($post);
		?>
		<div class="pdf-stop-text">
			<a href="<?= the_permalink(); ?>">
				<h3 class="pdf-stop-title"><?php the_title(); ?></h3>
			</a>
			<div><?php the_content(); ?></div>
			<?php
			if (Util::receive('pdf_do_itinerary_buttons', false)) {
				do_action('itinerary_buttons', get_the_ID());
			}
			?>
		</div>
	</div>
	<?php
	wp_reset_postdata();
}
