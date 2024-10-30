<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/22/16
 * Time: 7:27 AM
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

/**
 * Register meta box(es).
 */
function itinerary_register_meta_boxes() {
    add_meta_box(
        'itinerary-meta-box', __('Itinerary', 'wp-itienrary'), 'itinerary_display', array(
        'post',
        'page',
    ), "side", "core", null
    );
}

add_action('add_meta_boxes', 'itinerary_register_meta_boxes');

/**
 * Meta box display callback.
 *
 * @param WP_Post $post Current post object.
 */
function itinerary_display($post, $metabox) {
    wp_nonce_field(basename(__FILE__), "itinerary-meta-box-nonce");
    ?>
    <div>
        <div class="itinerary-setting">
            <label for="allow-itinerary"> Allow Itinerary?</label>
            <?php
            $allowed = get_post_meta($post->ID, "itinerary-allowed-on-page", true);
            $position = get_post_meta($post->ID, "itinerary-position-override", true);

            if ($allowed == "false") {
                ?>
                <input id="allow-itinerary" name="allow-itinerary" type="checkbox" value="false">
                <?php
            }
            else {
                ?>
                <input id="allow-itinerary" name="allow-itinerary" type="checkbox" value="true" checked>
                <?php
            }
            ?>
        </div>
        <br>
        <div class="itinerary-setting">
            <?php
            $ItinerarySettingsModel = new Itinerary_Settings_Model();
            ?>
            <label for="itinerary-position-override">Position</label>
            <select id="itinerary-position-override" name="itinerary-position-override">
                <option value="default">Default</option>
                <?php

                foreach ($ItinerarySettingsModel->getShowPositionOptions() as $value => $nicename) {
                    $selected = $position == $value ? 'selected' : '';
                    ?>
                    <option value="<?= $value; ?>" <?= $selected; ?>><?= $nicename; ?></option>
                    <?php
                }
                ?>
            </select>
            <div>
                <small>(Default Position: <?= $ItinerarySettingsModel->getShowPosition(); ?>)</small>
            </div>
        </div>
    </div>
    <?php
}

/**
 * Save meta box content.
 *
 * @param int $post_id Post ID
 */
function itinerary_save_meta_box($post_id) {

    if (!isset($_POST["itinerary-meta-box-nonce"]) || !wp_verify_nonce($_POST["itinerary-meta-box-nonce"], basename(__FILE__))) {
        return $post_id;
    }

    if (!current_user_can("edit_post", $post_id)) {
        return $post_id;
    }

    if (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE) {
        return $post_id;
    }

    $allowed = '';

    $position = filter_input(INPUT_POST, 'itinerary-position-override', FILTER_SANITIZE_STRING);
    $allowed = isset($_POST['allow-itinerary']) ? 'true' : 'false';

    update_post_meta($post_id, "itinerary-allowed-on-page", $allowed);
    update_post_meta($post_id, "itinerary-position-override", $position);
}

add_action('save_post', 'itinerary_save_meta_box');