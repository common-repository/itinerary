<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/22/16
 * Time: 9:33 PM
 */

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

class Itinerary_Settings_Model extends Itinerary_Base_Model {

	private $showPosition;
	private $autoDisplay;
	private $displayPage;
	private $convertReportPage;
	private $printSupport = false;
	private $dkpdfSupport = false;
	private $pdfTitle;
	private $garageTitle = 'Itinerary';
	private $viewItineraryText = 'View Itinerary';
	private $emptyItineraryText = 'You don\'t have any stops in your itinerary. you can add stops by clicking the [button_example] icon.';
	private $addItemText = 'Add';
	private $removeItemText = 'Remove';
	private $coverPage = '';
	private $pdfFooter = '';
	private $convertSvgToPng = false;

	public function __construct() {
		parent::__construct();

		$this->init();
		if ($this->getDkpdfSupport() == 1) {
			$dkpdfPath = get_theme_file_path() . '/dkpdf';
			$dkpdffile = '/dkpdf-indx.php';
			if (!file_exists($dkpdfPath . $dkpdffile)) {
				echo 'create';
				mkdir($dkpdfPath, 0755);
				file_put_contents($dkpdfPath . $dkpdffile, '<?php echo do_shortcode(\'[itinerary_dkpdf_pdf]\'); ?>');
			}
		}
	}

	/**
	 * Get the position to show the add to itinerary button
	 *
	 * @var int $postID If post ID is passed, we check to see if we should override the default position
	 *
	 * @return mixed
	 */
	public function getShowPosition($postID = null) {
		if ($postID) {
			$position = get_post_meta($postID, 'itinerary-position-override', true);

			if ($position && $position !== 'default') {
				return $position;
			}
		}
		return $this->showPosition;
	}

	/**
	 * @param mixed $showPosition
	 */
	public function setShowPosition($showPosition) {
		$this->showPosition = $showPosition;
	}

	public function getShowPositionOptions() {
		return array(
			'before-content' => 'Before Content',
			'after-content' => 'After Content',
			'shortcode' => 'Shortcode Only',
		);
	}

	/**
	 * @return mixed
	 */
	public function getAutoDisplay() {
		return $this->autoDisplay;
	}

	/**
	 * @param mixed $autoDisplay
	 */
	public function setAutoDisplay($autoDisplay) {
		$this->autoDisplay = $autoDisplay;
	}

	public function getAutoDisplayOptions() {
		return array(
			'auto' => 'On page load (Auto)',
			'shortcode' => 'Shortcode Only (or I\'ll create a link)',
		);
	}

	/**
	 * @return int
	 */
	public function getDisplayPage() {
		return (int)$this->displayPage;
	}

	/**
	 * @param mixed $displayPage
	 */
	public function setDisplayPage($displayPage) {
		$this->displayPage = $displayPage;
	}

	/**
	 * @return mixed
	 */
	public function getConvertReportPage() {
		return $this->convertReportPage;
	}

	/**
	 * @param mixed $convertReportPage
	 * @return Itinerary_Settings_Model
	 */
	public function setConvertReportPage($convertReportPage) {
		$this->convertReportPage = $convertReportPage;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getPrintSupport() {
		return $this->printSupport;
	}

	/**
	 * @param mixed $printSupport
	 * @return Itinerary_Settings_Model
	 */
	public function setPrintSupport($printSupport) {
		$this->printSupport = $printSupport;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getDkpdfSupport() {
		return $this->dkpdfSupport;
	}

	/**
	 * @param mixed $dkpdfSupport
	 * @return Itinerary_Settings_Model
	 */
	public function setDkpdfSupport($dkpdfSupport) {
		$this->dkpdfSupport = $dkpdfSupport;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getPdfTitle() {
		return $this->pdfTitle;
	}

	/**
	 * @param mixed $pdfTitle
	 * @return Itinerary_Settings_Model
	 */
	public function setPdfTitle($pdfTitle) {
		$this->pdfTitle = $pdfTitle;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getGarageTitle() {
		return $this->garageTitle;
	}

	/**
	 * @param mixed $garageTitle
	 * @return Itinerary_Settings_Model
	 */
	public function setGarageTitle($garageTitle) {
		$this->garageTitle = $garageTitle;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getViewItineraryText() {
		return $this->viewItineraryText;
	}

	/**
	 * @param mixed $viewItineraryText
	 * @return Itinerary_Settings_Model
	 */
	public function setViewItineraryText($viewItineraryText) {
		$this->viewItineraryText = $viewItineraryText;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getEmptyItineraryText() {
		return $this->emptyItineraryText;
	}

	/**
	 * @param mixed $emptyItineraryText
	 * @return Itinerary_Settings_Model
	 */
	public function setEmptyItineraryText($emptyItineraryText) {
		$this->emptyItineraryText = $emptyItineraryText;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getAddItemText() {
		return $this->addItemText;
	}

	/**
	 * @param string $addItemText
	 * @return Itinerary_Settings_Model
	 */
	public function setAddItemText($addItemText) {
		$this->addItemText = $addItemText;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getRemoveItemText() {
		return $this->removeItemText;
	}

	/**
	 * @param string $removeItemText
	 * @return Itinerary_Settings_Model
	 */
	public function setRemoveItemText($removeItemText) {
		$this->removeItemText = $removeItemText;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getCoverPage() {
		return html_entity_decode($this->coverPage);
	}

	/**
	 * @param string $coverPage
	 * @return Itinerary_Settings_Model
	 */
	public function setCoverPage($coverPage) {
		$this->coverPage = $coverPage;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getPdfFooter() {
		return $this->pdfFooter;
	}

	/**
	 * @param string $pdfFooter
	 * @return Itinerary_Settings_Model
	 */
	public function setPdfFooter($pdfFooter) {
		$this->pdfFooter = $pdfFooter;
		return $this;
	}

	/**
	 * @return bool
	 */
	public function isConvertSvgToPng() {
		return $this->convertSvgToPng;
	}

	/**
	 * @param bool $convertSvgToPng
	 * @return Itinerary_Settings_Model
	 */
	public function setConvertSvgToPng($convertSvgToPng) {
		$this->convertSvgToPng = $convertSvgToPng;
		return $this;
	}

	public function init() {
		$this->setShowPosition(get_option('itinerary_show_position'));
		$this->setAutoDisplay(get_option('itinerary_garage_auto_display'));
		$this->setDisplayPage(get_option('itinerary_page'));
		$this->setConvertReportPage(get_option('report_to_pdf_page'));
		$this->setPrintSupport(get_option('itinerary_show_print'));
		$this->setDkpdfSupport(get_option('itinerary_dkpdf_support'));
		$this->setPdfTitle(get_option('itinerary_pdf_title'));
		$this->setGarageTitle(get_option('itinerary_garage_title'));
		$this->setViewItineraryText(get_option('itinerary_view_text'));
		$this->setEmptyItineraryText(get_option('itinerary_empty_text'));
		$this->setRemoveItemText(get_option('itinerary_remove_item_text'));
		$this->setAddItemText(get_option('itinerary_add_item_text'));
		$this->setCoverPage(get_option('itinerary_cover_page'));
		$this->setConvertSvgToPng(get_option('itinerary_svg_to_png'));

		$this->setPdfFooter(get_option('itinerary_pdf_footer'));
		update_option('dkpdf_pdf_footer_text', $this->getPdfFooter());
	}
}