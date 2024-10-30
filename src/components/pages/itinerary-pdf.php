<?php
/**
 * dkpdf-index.php
 * This template is used to display the content in the PDF
 *
 * Do not edit this template directly,
 * copy this template and paste in your theme inside a directory named dkpdf
 */

use Itinerary\Util;

$filename = md5(get_query_var('i'));
$htmlFile = $filename . '.html';
$pdfFile = $filename . '.pdf';
$htmlpath = ITINERARY_PATH . '/tmp/' . $htmlFile;
$pdfpath = ITINERARY_PATH . '/tmp/' . $pdfFile;

if (file_exists($pdfpath)) {
	header('Content-disposition: inline; filename="' . $pdfpath . '"');
	readfile($pdfpath);

	die();
}

ob_start();
?>

	<html>
	<head>

		<link type="text/css" rel="stylesheet" href="<?php echo get_bloginfo('stylesheet_url'); ?>" media="all" />
		<link type="text/css" rel="stylesheet" href="<?php echo ITINERARY_URL . 'css/main.css'; ?>" media="all" />

		<?php
		$wp_head = get_option('dkpdf_print_wp_head', '');
		if ($wp_head == 'on') {
			wp_head();

		}
		?>

		<style type="text/css">

			body {
				background: #FFF;
				font-size: 100%;

			}

			html body * {
				color: #333 !important;
			}

			h1,
			h2,
			h3,
			h4,
			h5,
			h6 {
				text-align: left !important;
				font-weight: 600 !important;
			}

			h1 {
				font-size: 48px;
			}

			h2 {
				font-size: 42px;
			}

			h3 {
				font-size: 36px;
			}

			h4 {
				font-size: 28px;
			}

			#breadcrumbs {
				display: none;
			}

			.pdf-stop-title {
				text-align: center;
				font-size: 48px;
			}

			.collapse {
				display: block;
				padding-left: 50px;
			}

			.pdf-content-wrap img {
				/*display: none;*/
			}

			<?php
				// get pdf custom css option
				echo file_get_contents_curl(get_bloginfo('stylesheet_url'));
				$css = get_option( 'dkpdf_pdf_custom_css', '' );

				echo $css;
			?>

		</style>

	</head>

	<body>

	<?php
	$coverPage = get_option('itinerary_cover_page');

	if (!empty($coverPage)) {

		echo do_shortcode($coverPage);
		?>
		<style>
			.header-page-1,
			.footer-page-1 {
				display: none;
			}
		</style>
		<div style="page-break-after: always"></div>
		<?php
	}

	?>

	<header>
		<h1><?= get_option('itinerary_pdf_title'); ?></h1>
	</header>

	<div class="pdf-content-wrap">
		<?php
		$content = ob_get_clean() . file_get_contents($htmlpath);
		?>
	</div>
	<?php
	$urls = [get_site_url(), str_replace('https://', 'http://', get_site_url())];

	$html = str_replace($urls, '', $content);

	ob_start();
	?>
	</body>
	</html>
<?php
$html .= ob_get_clean();


echo $html;

