<!-- src/components/pages/my-itinerary.php -->
<?php

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

Util::give('pdf_do_itinerary_buttons', false);

?>
<div id="my-itinerary">
	<div class="itinerary-loader">
		<i class="fa fa-refresh fa-spin"></i>
	</div>
</div>

<?php
add_action('wp_footer', function () {
	?>
	<script>
		wisnet.App.itinerary.showItinerary('#my-itinerary');
	</script>
	<?php
}, 99);