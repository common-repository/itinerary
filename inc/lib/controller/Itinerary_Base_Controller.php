<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/7/16
 * Time: 8:17 PM
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

class Itinerary_Base_Controller {

    /**
     * @param      $action
     * @param      $callback
     * @param null $class
     */
    protected function ajax_action($action, $callback, $class = null) {
        if (!$class) {
            $class = $this;
        }

        if (method_exists($class, $callback)) {
            add_action('wp_ajax_' . $action, array($class, $callback));
            add_action('wp_ajax_nopriv_' . $action, array($class, $callback));
        }
        else {
            add_action('wp_ajax_' . $action, array($class, 'invalid_method'));
            add_action('wp_ajax_nopriv_' . $action, array($class, 'invalid_method'));
        }
    }

    /**
     * @param $callback
     */
    public function invalid_method($callback) {
        wp_send_json(array('status' => false, 'message' => 'Invalid method call for action: ' . filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING)));

        wp_die();
    }

    /**
     * @param $var
     */
    protected function debug($var) {
        if (isset($_GET['debug'])) {
            p($var);
        }
    }
}