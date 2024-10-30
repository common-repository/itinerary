<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/9/16
 * Time: 8:54 PM
 */

namespace Itinerary;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Util {


    public static function camelCase($input, $separator = '_') {
        /**
         * we cannot take advantage of ucwords second parameter (delimeter)
         * because WPEngine doesn't like it :'(
         */
        return str_replace(' ', '', ucwords(str_replace($separator, ' ', $input)));
    }

    /**
     * Give a variable to be accessed globally
     *
     * @param $name  The name of the variable (how it will also be "retrieved"
     * @param $value The value to be assigned
     */
    static function give($name, $value) {
        $GLOBALS[$name] = $value;

        if ($value === null) {
            unset($GLOBALS[$name]);
        }
    }


    /**
     * Receive a value of a variable previously set using give();
     *
     * @param $name    The name of the variable to be retrieved
     * @param $default The default value to return if index is not set
     *
     * @return mixed|null returns the value of the variable called, else null if it is not set
     */
    static function receive($name, $default = null) {
        return (isset($GLOBALS[$name]) ? $GLOBALS[$name] : $default);
    }


    /**
     * Pretty version of @see var_dump()
     */
    static function v() {
        if (ITINERARY_DEBUG) {
            if (function_exists('xdebug_get_code_coverage')) {
                foreach (func_get_args() as $arg) {
                    var_dump($arg);
                }
            }
            else {
                foreach (func_get_args() as $arg) {
                    echo '<pre>';
                    var_dump($arg);
                    echo '</pre>';
                }
            }
        }
    }


    /**
     * Output debug (or any) info to the page
     */
    static function d() {
        if (ITINERARY_DEBUG) {
            foreach (func_get_args() as $arg) {
                echo '<pre>';
                echo $arg;
                echo '</pre>';
            }
        }
    }

    /**
     * Pretty version of @see print_r()
     */
    static function p() {
        if (ITINERARY_DEBUG) {
            foreach (func_get_args() as $arg) {
                if (is_array($arg)) {
                    echo '<pre>';
                    print_r($arg);
                    echo '</pre>';
                }
                else {
                    self::v($arg);
                }
            }
        }
    }

    static function wpdb() {
        global $wpdb;
        return $wpdb;
    }

}