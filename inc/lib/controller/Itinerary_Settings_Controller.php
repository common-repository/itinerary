<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/21/16
 * Time: 10:04 PM
 */

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

class Itinerary_Settings_Controller {
	static private $instance;
	/**
	 * @var Itinerary_Settings_Model
	 */
	public $model;

	protected function __construct() {

	}

	/**
	 * @param null $id
	 *
	 * @return mixed
	 */
	public static function getInstance() {
		if (null === static::$instance) {
			self::$instance = new static();
			self::$instance->init();

			return self::$instance;
		}

		return static::$instance;

	}

	/**
	 * @return Itinerary_Settings_Model
	 */
	public function model() {
		if ($this->model === null) {
			$model = new Itinerary_Settings_Model();
			$this->model = $model;
		}
		return $this->model;
	}

	public function init() {
		add_action('admin_init', array($this, 'registerSettings'));

		$this->model = new Itinerary_Settings_Model();
	}

	public function load() {

	}

	public function loadSettings() {
		get_itinerary_part(ITINERARY_PAGE . '/itinerary-settings-index');
	}

	public function registerSettings() {
		register_setting('itinerary_settings', 'pages_allowed_on');
		register_setting('itinerary_settings', 'itinerary_show_position');
		register_setting('itinerary_settings', 'itinerary_garage_auto_display');
		register_setting('itinerary_settings', 'itinerary_page');
		register_setting('itinerary_settings', 'report_to_pdf_page');
		register_setting('itinerary_settings', 'itinerary_show_print');
		register_setting('itinerary_settings', 'itinerary_dkpdf_support');
		register_setting('itinerary_settings', 'itinerary_pdf_title');
		register_setting('itinerary_settings', 'itinerary_pdf_footer');

		register_setting('itinerary_settings', 'itinerary_garage_title');
		register_setting('itinerary_settings', 'itinerary_empty_text');
		register_setting('itinerary_settings', 'itinerary_view_text');
		register_setting('itinerary_settings', 'itinerary_add_item_text');
		register_setting('itinerary_settings', 'itinerary_remove_item_text');

		register_setting('itinerary_settings', 'itinerary_cover_page');

		register_setting('itinerary_settings', 'itinerary_svg_to_png');
	}

	public function addAdminMenu() {
		add_submenu_page(
			'itinerary',
			'Itinerary Settings',
			'Itinerary Settings',
			'manage_options',
			'itinerary-settings',
			array($this, 'loadSettings')
		);
	}
}