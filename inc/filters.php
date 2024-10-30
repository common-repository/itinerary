<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/9/16
 * Time: 8:44 PM
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

add_filter('itinerary_button_view_text', 'itinerary_button_view_text', 10, 1);
/**
 *
 * @since v1.0.0
 *
 * @param string $text
 *
 * @return string
 */
function itinerary_button_view_text($text = '') {
    if (!$text) {
        $text = 'View Itinerary';
    }

    return $text;
}

add_filter('itinerary_button_pdf_text', 'itinerary_button_pdf_text', 10, 1);
/**
 * @since v1.0.0
 *
 * @param string $text
 *
 * @return string
 */
function itinerary_button_pdf_text($text = '') {
    if (!$text) {
        $text = 'Create PDF';
    }

    return $text;
}

add_filter('itinerary_button_print_text', 'itinerary_button_print_text', 10, 1);
/**
 *
 * @since v1.0.0
 *
 * @param string $text
 *
 * @return string
 */
function itinerary_button_print_text($text = '') {
    if (!$text) {
        $text = 'Print';
    }

    return $text;
}

/**
 *
 * @since v1.0.0
 *
 * @param $content
 *
 * @return string
 */
function filter_add_to_garage($content) {
    /**
     * @var Itinerary_Settings_Controller $ItinerarySettings
     */
    global $ItinerarySettings;
    global $post;

    ob_start();
    echo do_action('itinerary_buttons');
    $itineraryButton = ob_get_clean();

    $position = $ItinerarySettings->model->getShowPosition($post->ID);

    if ($position === 'before-content') {
        $custom_content = ($itineraryButton . $content);
    }
    else if ($position === 'after-content') {
        $custom_content = ($content . $itineraryButton);
    }
    else {
        $custom_content = $content;
    }

    return $custom_content;
}

add_filter('the_content', 'filter_add_to_garage');

add_filter('itinerary_button_remove_filter', 'filter_itinerary_button_remove', 9, 1);

function filter_itinerary_button_remove($class) {
    $class .= ' btn-garage';
    return $class;
}