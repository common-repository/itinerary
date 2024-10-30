<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 1/5/17
 * Time: 8:12 PM
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Itinerary_Admin_Controller {

    static private $instance;
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

    public function init() {
        add_action('admin_menu', array($this, 'add_menus'));
    }

    public function load() {
        get_itinerary_part(ITINERARY_PAGE . '/list-created-itineraries');
    }

    public function add_menus() {
        global $ItinerarySettings;

        add_menu_page(
            __('Itinerary', 'Itinerary'),
            'Itinerary',
            'manage_options',
            'itinerary',
            array($this, 'load'),
            'dashicons-screenoptions',
            2
        );

        $ItinerarySettings->addAdminMenu();
    }
}