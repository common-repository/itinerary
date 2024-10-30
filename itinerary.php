<?php
/**
 * Plugin Name: Itinerary
 * Plugin URI: https://www.wisnet.com
 * Description: Easily aggregate posts so a user of your site can view them later or print them off
 * Version: 1.3.9
 * Author: wisnet.com, LLC
 * Author URI: https://www.wisnet.com/about
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

require('functions.php');

global $Itinerary;
global $ItinerarySettings;

if (!($Itinerary instanceof Itinerary_Controller)) {
    /**
     * @var Itinerary_Controller $Itinerary
     */
    $Itinerary = Itinerary_Controller::getInstance(filter_input(INPUT_GET,'itinerary', FILTER_VALIDATE_INT));

    $Itinerary->load();
}

if (is_admin()) {
    require('inc/admin-meta-box.php');
}

if (!($ItinerarySettings instanceof Itinerary_Settings_Controller)) {
    /**
     * @var Itinerary_Settings_Controller
     */
    $ItinerarySettings = Itinerary_Settings_Controller::getInstance();

    $ItinerarySettings->load();
}
if (is_admin()) {
    global $Itinerary_Admin;
    $Itinerary_Admin = Itinerary_Admin_Controller::getInstance();
}

function do_show_itinerary_garage() {
    do_action('show_itinerary_garage');
}

if (!is_admin() && $ItinerarySettings->model->getAutoDisplay() === 'auto') {
    add_action('wp_footer', 'do_show_itinerary_garage', 100);
}

