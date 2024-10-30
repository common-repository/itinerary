<?php

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

use \Itinerary\Util;

/**
 *
 * @TODO
 *
 * Add/remove buttons are essentially deprecated.
 * They will be replace with placeholder buttons
 * and then we user JS to retrieve the itinerary id
 * from local storage and make our ajax call out from
 * there.
 *
 * Really what should be done is all itinerary items
 * be kept in local storage and then do an ajax
 * call out to the server to get any updates.
 *
 * This would really work best when it's tied
 * to a specific user.
 *
 * @TODO allow logged in users to save itinerary
 *
 */

/**
 *
 * @since v1.0.0
 *
 * @param int $postID
 * @param bool $bypassIsAllowed allow bypassing if they are using a shortcode
 */
function add_itinerary_buttons($postID = null, $bypassIsAllowed = false) {
	global $post;
	global $Itinerary;
	/**
	 * @var Itinerary_Settings_Controller $ItinerarySettings
	 */
	global $ItinerarySettings;

	ob_start();

	if ($post) {
		$postID = $post->ID;
	}
	else if (isset($_GET['post_id'])) {
		$postID = filter_input(INPUT_GET, 'post_id', FILTER_VALIDATE_INT);
	}

	if ($postID) {
		Util::give('itinerary_button_post_ID', $postID);
	}

	$isAllowed = get_post_meta($postID, 'itinerary-allowed-on-page', true);

	if (($bypassIsAllowed || $isAllowed !== 'false') && $ItinerarySettings->model->getDisplayPage() !== $postID) {
		get_itinerary_part(ITINERARY_MOLECULE . '/itinerary-buttons');
	}
	echo ob_get_clean();
}

add_action('itinerary_buttons', 'add_itinerary_buttons', 99, 2);

/**
 *
 * @since v1.0.0
 *
 * @param int $postID
 */
function itinerary_button_add($postID = null) {
	global $post;
	global $Itinerary;
	/** @global Itinerary_Settings_Controller $ItinerarySettings */
	global $ItinerarySettings;

	ob_start();

	if ($postID) {
		Util::give('itinerary_button_post_ID', $postID);
	}

	if ($Itinerary->isModelLoaded) {
		?>
		<div class="btn-itinerary add <?= $postID > 0 ? 'js-add-to-itinerary' : ''; ?>"
		     data-id="<?= esc_attr($postID); ?>"
		     data-itinerary-id="<?= esc_attr($Itinerary->model->getItineraryId()); ?>">
			<span class="icon"></span>
			<span class="text"><?= apply_filters('itinerary_button_add_text', $ItinerarySettings->model()->getAddItemText()); ?></span>
		</div>
		<?php
	}
	else {
		?>
		<div class="js-itinerary-btn-placeholder btn-itinerary add <?= $postID > 0 ? 'js-add-to-itinerary' : ''; ?>"
		     data-id="<?= esc_attr($postID); ?>"
		     data-itinerary-id="">
			<span class="icon"></span>
			<span class="text"><?= apply_filters('itinerary_button_add_text', $ItinerarySettings->model()->getAddItemText()); ?></span>
		</div>
		<?php
	}
	echo ob_get_clean();
}

add_action('itinerary_button_add', 'itinerary_button_add', 99, 1);

/**
 *
 * @since v1.0.0
 *
 * @param int $itineraryID
 * @param int $postID
 */
function itinerary_button_remove($itineraryID, $postID = null) {
	global $post;
	global $Itinerary;

	/** @global Itinerary_Settings_Controller $ItinerarySettings */
	global $ItinerarySettings;

	ob_start();
	if ($postID) {
		Util::give('itinerary_button_post_ID', $postID);
	}
	?>
	<div class="<?= apply_filters('itinerary_button_remove_filter', 'btn-itinerary remove js-remove-from-itinerary'); ?>"
	     data-itinerary-id="<?= esc_attr($Itinerary->model->getItineraryId()); ?>"
	     data-id="<?= esc_attr($postID); ?>">
		<span class="icon"></span>
		<span class="text"><?= apply_filters('itinerary_button_remove_text', $ItinerarySettings->model()->getRemoveItemText()); ?></span>
	</div>
	<?php
	echo ob_get_clean();
}

add_action('itinerary_button_remove', 'itinerary_button_remove', 99, 2);

/**
 *
 * @since v1.0.0
 *
 */
function itinerary_button_order() {
	ob_start();
	?>
	<span class="btn-itinerary order"><?= apply_filters('itinerary_button_order_icon', '<i class="fa fa-arrows"></i>'); ?></span>
	<?php
	echo ob_get_clean();
}

add_action('itinerary_button_order', 'itinerary_button_order', 99);

/**
 *
 * @since v1.0.0
 */
function itinerary_button_view() {
	/** @global Itinerary_Settings_Controller $ItinerarySettings */
	global $ItinerarySettings;
	ob_start();
	?>
	<a class="btn-itinerary view"
	   href="<?= get_the_permalink(get_option('itinerary_page')); ?>">
		<?= apply_filters('itinerary_button_view_text', $ItinerarySettings->model()->getViewItineraryText()); ?>
	</a>
	<?php
	echo ob_get_clean();
}

add_action('itinerary_button_view', 'itinerary_button_view', 99);

/**
 *
 * @since v1.0.0
 *
 */
function itinerary_button_pdf() {
	ob_start();
	/** Itinerary_Controller $Itinerary */
	global $Itinerary;
	/** Itinerary_Settings_Model */
	global $ItinerarySettings;
	?>
	<a class="btn-itinerary pdf"
	   href="<?= site_url('/report-to-pdf'); ?>?peedeef=<?= $ItinerarySettings->model->getDisplayPage() ?>&i=<?= $Itinerary->model->getItineraryId(); ?>" target="_blank">
		<?= apply_filters('itinerary_button_pdf_text', 'Create PDF'); ?>
	</a>
	<?php
	echo ob_get_clean();
}

add_action('itinerary_button_pdf', 'itinerary_button_pdf', 99);

/**
 *
 * @since v1.0.0
 *
 */
function itinerary_button_print() {
	ob_start();
	?>
	<a class="btn-itinerary print"
	   href="javascript: print();"><?= apply_filters('itinerary_button_print_text', 'Print Itinerary'); ?></a>
	<?php
	echo ob_get_clean();
}

add_action('itinerary_button_print', 'itinerary_button_print', 99);


/**
 *
 * @since v1.0.0
 *
 */
function is_itinerary_stop() {
	global $post;
	global $Itinerary;


	//    ob_start();
	//    if ($Itinerary->isModelLoaded) {
	?>
	<script>
		//            wisnet.App.getStops();
	</script>
	<?php
	//    }

	//    echo ob_get_clean();
}

add_action('is_itinerary_stop', 'is_itinerary_stop');

/**
 *
 * @since v1.0.0
 *
 */
function show_itinerary_garage() {
	global $post;
	global $Itinerary;

	$queriedObject = get_queried_object_id();

	if ($queriedObject) {
		$postID = $queriedObject;
	}
	else {
		$postID = $post->ID;
	}

	ob_start();
	?>
	<script>
		var post_id = <?= (int)$postID; ?>;
		jQuery(function ($) {
			// initialize itinerary
			wisnet.App.itinerary._run();
		});
	</script>
	<?php
	if ($Itinerary->isModelLoaded) {

		?>
		<script>
			wisnet.App.showGarage(<?= $postID; ?>);
		</script>
		<?php
	}

	echo ob_get_clean();
}

add_action('show_itinerary_garage', 'show_itinerary_garage');