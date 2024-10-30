<?php
/**
 * report-to-pdf.php
 */

ob_start();

use Itinerary\Util;

add_filter('dkpdf_pdf_filename', function ($title) {
	return get_option('itinerary_pdf_title') ?: $title;
});

add_action('wp_footer', function () {
	ob_flush();
	ob_start();
	global $itineraryStylesheets;
	global $post;
	/** @global Itinerary_Controller $Itinerary */
	global $Itinerary;
	/** @global Itinerary_Settings_Controller $ItinerarySettings */
	global $ItinerarySettings;

	$pdf = intval(get_query_var('pdf'));
	$itineraryPage = $ItinerarySettings->model->getDisplayPage();

	?>

	<div class="itinerary-stops__wrap">

		<?php
		foreach ($itineraryStylesheets as $stylesheet) {
			?>
			<link href="<?= $stylesheet; ?>" rel="stylesheet" />
			<?php
		}

		if (isset($_GET['i'])) {
			$Itinerary = $Itinerary::getInstance($_GET['i']);
		}

		$stops = $Itinerary->model->getStopObjects();

		global $ItineraryStop;
		$ItineraryStopModel = new Itinerary_Stop_Model($Itinerary->model->getItineraryId());
		echo '<br>';
		echo '<br>';
		echo '<br>';
		$total = count($stops);
		$i = 0;
		foreach ($stops as $stop) {
			$the_content = '';
			$ItineraryStop = $ItineraryStopModel->loadByPlaceId($stop->ID);
			get_itinerary_part(ITINERARY_ORGANISM . '/pdf-itinerary-stop');
			$i++;

			if ($i < $total) {
				echo '<div style="page-break-after: always;"></div>';
			}
		}
		?>
	</div>

	<?php
	$html = ob_get_clean();

	//	echo($html);
	//	die();
	$html = preg_replace('#<title(.*?)>(.*?)</title>#is', '', $html);
	$html = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $html);
	$html = preg_replace('#<iframe(.*?)>(.*?)</iframe>#is', '', $html);
	$html = preg_replace('#<form(.*?)>(.*?)</form>#is', '', $html);
	$html = str_replace(chr(130), ',', $html);    // baseline single quote
	$html = str_replace(chr(132), '"', $html);    // baseline double quote
	$html = str_replace(chr(133), '...', $html);  // ellipsis
	$html = str_replace(chr(145), "'", $html);    // left single quote
	$html = str_replace(chr(146), "'", $html);    // right single quote
	$html = str_replace(chr(147), '"', $html);    // left double quote
	$html = str_replace(chr(148), '"', $html);    // right double quote

	$html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');

	libxml_use_internal_errors(true);
	$dom = new DOMDocument();
	$dom->loadHTML($html);
	$finder = new DomXPath($dom);

	$nodes = $finder->query("//*[contains(@class, 'visualizer-front')]");

	foreach ($nodes as $node) {
		$image = $dom->createElement('img');
		$class = $node->getAttribute('class');
		$id = str_replace(['visualizer-front ', ' ', 'visualizer-front-'], '', $class);

		$image->setAttribute('src', site_url() . '/wp-content/plugins/itinerary/tmp/pngs/' . $id . '.png');

		if (file_exists(ITINERARY_PATH . 'tmp/pngs/' . $id . '.png')) {
			$node->parentNode->replaceChild($image, $node);
		}
	}
	$html = $dom->saveHTML();

	$filename = md5(get_query_var('i')) . '.html';
	$put = false;
	$put = file_put_contents(ITINERARY_PATH . '/tmp/' . $filename, $html);

	echo $html;

	if ($put) {
		wp_redirect(site_url($ItinerarySettings->model()->getDisplayPage()) . '?pdf=' . $_GET['peedeef'] . '&i=' . get_query_var('i'));
	}
	else {
		wp_die('There was an error generating your PDF.');
	}
}, 999);


