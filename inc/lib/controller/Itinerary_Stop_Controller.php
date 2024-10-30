<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 11/23/16
 * Time: 10:39 AM
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

class Itinerary_Stop_Controller extends Itinerary_Base_Controller {
    public $model;

    /**
     * Itinerary_Stop constructor.
     */
    public function __construct($id = null) {
        $this->init($id);
    }

    /**
     *
     */
    public function __destruct() {
        // @TODO implement __destruct()

    }

    private function init($id = null) {
        if (!$id) {
            $this->model = new Itinerary_Stop_Model();
        }
        else {
            $Itinerary_Model = new Itinerary_Stop_Model($id);
            $this->model = $Itinerary_Model->loadById($id);
        }
    }
}