<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/9/16
 * Time: 9:27 PM
 */

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

define('ITINERARY_PATH', plugin_dir_path(__FILE__));
/**
 *
 */
define('ITINERARY_URL', plugin_dir_url(__FILE__));

define('ITINERARY_DEBUG', true);

/**
 * Paths to Atomic docs
 */
define('ITINERARY_ATOMIC', ITINERARY_PATH . 'src/components/');
/**
 * Path to Atomic organism directory
 */
define('ITINERARY_ORGANISM', ITINERARY_ATOMIC . 'organisms');
/**
 * Path to Atomic molecule directory
 */
define('ITINERARY_MOLECULE', ITINERARY_ATOMIC . 'molecules');
/**
 * Path to Atomic atom directory
 */
define('ITINERARY_ATOM', ITINERARY_ATOMIC . 'atoms');
/**
 * Path to Atomic sidebars directory
 */
define('ITINERARY_SIDEBARS', ITINERARY_ATOMIC . 'sidebars');
/**
 * Path to Atomic partials directory
 */
define('ITINERARY_PARTIALS', ITINERARY_ATOMIC . 'partials');

/**
 * Path to Atomic pages directory
 */
define('ITINERARY_PAGE', ITINERARY_ATOMIC . 'pages');
/**
 * Path to plugin templates directory
 */
define('PARTIAL', '/templates/partials');

require_once('inc/lib/Util.php');

use \Itinerary\Util;

function Autoload($class) {
	$parts = explode('_', $class);
	$type = strtolower(end($parts));
	$file = ITINERARY_PATH . '/inc/lib/' . $type . '/' . $class . '.php';

	if (file_exists($file)) {
		include($file);
	}
}

spl_autoload_register('Autoload');

function itinerary_scripts() {
	// Register and link scripts:
	wp_register_script('app-js', ITINERARY_URL . 'js/min/app.compiled.js', array('jquery'), '', true);
	wp_register_script('itinerary-js', ITINERARY_URL . 'js/min/main.compiled.js', array('jquery'), '', true);
	wp_register_style('fontawesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
	wp_register_style('itinerary-css', ITINERARY_URL . 'css/main.css');
	wp_localize_script(
		'itinerary-js', 'ajax', array(
			'url' => admin_url('admin-ajax.php'),
			'object_id' => get_queried_object_id(),
			'itinerary_converted_images' => get_option('itinerary_converted_images') ?: [],
			'isAdmin' => (int)current_user_can('administrator'),
		)
	);
	wp_enqueue_style('fontawesome');
	wp_enqueue_style('itinerary-css');
	wp_enqueue_script('app-js');
	wp_enqueue_script('itinerary-js');
	wp_enqueue_script('jquery-ui-sortable');
}

add_action('wp_enqueue_scripts', 'itinerary_scripts');

function itinerary_admin_scripts() {
	// Register and link scripts:
	wp_register_script('itinerary-js', ITINERARY_URL . 'js/min/admin.compiled.js', array('jquery'), '', true);
	wp_register_style('itinerary-css', ITINERARY_URL . 'css/main.css');
	wp_localize_script(
		'itinerary-js', 'ajax', array(
			'url' => admin_url('admin-ajax.php'),
			'object_id' => get_queried_object_id(),
		)
	);
	wp_enqueue_style('itinerary-css');
	//	wp_enqueue_script( 'itinerary-js' );
	//	wp_enqueue_script( 'jquery-ui-sortable' );
}

add_action('admin_enqueue_scripts', 'itinerary_admin_scripts');

function get_itinerary_part($file) {
	$file .= '.php';

	if (file_exists($file)) {
		include($file);
	}
}

function itinerary_activate() {
	Itinerary_Controller::install();
}

register_activation_hook(ITINERARY_PATH . 'itinerary.php', 'itinerary_activate');

add_theme_support('post-thumbnails');

require('inc/actions.php');
require('inc/filters.php');
require('inc/shortcodes.php');

//function itinerary_admin() {
//	App::v('-----------------------------------------------------------------------------------yo');
//$IS = new Itinerary_Settings();
//	$IS->load();
//}
//
//add_action('admin_init', 'itinerary_admin');

global $itineraryStylesheets;
$itineraryStylesheets = [];

add_action('wp_head', function () {
	global $itineraryStylesheets;
	global $wp_styles;

	foreach ($wp_styles->queue as $handle) {
		$src = $wp_styles->registered[$handle]->src;
		if (strpos($src, '//') !== false) {
			$itineraryStylesheets[] = $src;
		}
	}
});

add_action('init', function () {
	if (!file_exists(ITINERARY_PATH . '/tmp')) {
		mkdir(ITINERARY_PATH . '/tmp');
	}
	if (!file_exists(ITINERARY_PATH . '/tmp/pngs')) {
		mkdir(ITINERARY_PATH . '/tmp/pngs');
	}
});

add_action('wp', function () {
	global $Itinerary;
	global $post;
	$page = get_queried_object_id();

	$reportPage = get_option('report_to_pdf_page');

	if (is_object($post) && $post->ID == $reportPage) {
		echo do_shortcode('[itinerary_report_to_pdf]');
	}
	else if (isset($_GET['pdf']) && isset($_GET['i'])) {
		$Itinerary = $Itinerary::getInstance($_GET['i']);
		$stops = $Itinerary->model->getStopObjects();

		global $ItineraryStop;
		$ItineraryStopModel = new Itinerary_Stop_Model($Itinerary->model->getItineraryId());
		foreach ($stops as $stop) {
			$the_content = '';
			$ItineraryStop = $ItineraryStopModel->loadByPlaceId($stop->ID);
			get_itinerary_part(ITINERARY_ORGANISM . '/pdf-itinerary-stop');
		}

		die();
	}
});

add_filter('dkpdf_pdf_filename', function ($title) {
	return get_option('itinerary_pdf_title') ?: $title;
});
add_filter('dkpdf_header_pagination', function ($content) {
	//	$content = '<span class="header-page-{PAGENO}">Page {PAGENO} of {nb}</span>';
	$content = '<span class="header-page-{PAGENO}">{PAGENO}</span>';
	return $content;
});
add_filter('dkpdf_footer_pagination', function ($content) {
	//	$content = '<span class="footer-page-{PAGENO}">'.$content.'</span>';
	$content = '<span class="header-page-{PAGENO}"{PAGENO}</span>';
	return $content;
});
add_filter('dkpdf_pdf_filename', function ($title) {
	if ($pdfTitle = get_option('itinerary_pdf_title')) {
		$title = $pdfTitle;
	}
	return $title;
});

/**
 * @param $vars
 *
 * @return array
 */
function add_search_query_vars_filter($vars) {
	$vars[] = 'i';
	$vars[] = 'pdf';

	return $vars;
}

add_filter('query_vars', 'add_search_query_vars_filter');

function file_get_contents_curl($url) {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);

	$data = curl_exec($ch);
	curl_close($ch);

	return $data;
}