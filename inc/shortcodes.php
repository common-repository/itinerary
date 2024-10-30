<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/12/16
 * Time: 9:42 PM
 */

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

add_shortcode('itinerary', 'itinerary_shortcode');

function itinerary_shortcode($attrs) {

	remove_action('itinerary_buttons', 99, 2);

	$settings = shortcode_atts(
		array(),
		$attrs
	);

	ob_start();

	get_itinerary_part(ITINERARY_PAGE . '/my-itinerary');

	return ob_get_clean();
}

add_shortcode('itinerary_report_to_pdf', 'itinerary_report_to_pdf');

function itinerary_report_to_pdf($attrs) {
	$settings = shortcode_atts(
		array(),
		$attrs
	);

	ob_start();

	get_itinerary_part(ITINERARY_PAGE . '/report-to-pdf');

	return ob_get_clean();
}

add_shortcode('itinerary_garage', 'itinerary_garage_shortcode');

function itinerary_garage_shortcode($attrs) {
	$settings = shortcode_atts(
		array(),
		$attrs
	);

	ob_start();

	add_action('wp_footer', 'do_show_itinerary_garage', 100);

	return ob_get_clean();
}

add_shortcode('itinerary_buttons', 'itinerary_buttons_shortcode');

function itinerary_buttons_shortcode($attrs) {
	$settings = shortcode_atts(
		array(),
		$attrs
	);

	ob_start();

	do_action('itinerary_buttons');

	return ob_get_clean();
}

add_shortcode('itinerary_dkpdf_pdf', 'itinerary_dkpdf_pdf');

function itinerary_dkpdf_pdf($attrs) {

	$settings = shortcode_atts(
		array(),
		$attrs
	);
	ob_start();

	get_itinerary_part(ITINERARY_PAGE . '/itinerary-pdf');

	return ob_get_clean();
}

add_shortcode('itinerary_timestamp', 'itinerary_timestamp');

function itinerary_timestamp($attrs) {

	$settings = shortcode_atts([
		'format' => 'Y-m-d h:i:s'
	],
		$attrs
	);

	return date($settings['format']);
}