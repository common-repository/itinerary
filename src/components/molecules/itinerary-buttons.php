<!-- src/components/molecules/itinerary-buttons.php -->
<?php

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

use \Itinerary\Util;

global $Itinerary;

$object = get_queried_object();
$postID = Util::receive('itinerary_button_post_ID', $object->ID);

if (!empty($postID)) {
	?>
	<div class="itinerary-buttons">
		<?= do_action('itinerary_button_add', $postID); ?>
	</div>
	<?php
}