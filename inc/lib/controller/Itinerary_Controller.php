<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 11/22/16
 * Time: 9:23 PM
 */

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

class Itinerary_Controller extends Itinerary_Base_Controller {

	/**
	 * Singleton instance
	 *
	 * @since v1.0.0
	 * @access private
	 * @var class
	 */
	static private $instance;

	/**
	 *
	 *
	 * @since v1.0.0
	 * @access public
	 * @var Itinerary_Model
	 */
	public $model;

	/**
	 *
	 *
	 * @since v1.0.0
	 * @access public
	 * @var bool
	 */
	public $isLoaded = false;

	/**
	 *
	 *
	 * @since v1.0.0
	 * @access public
	 * @var bool
	 */
	public $isModelLoaded = false;

	/**
	 * We don't use the constructor since we are using the singleton pattern
	 *      http://www.phptherightway.com/pages/Design-Patterns.html#singleton
	 *
	 * @since v1.0.0
	 * @acess protected
	 * Itinerary constructor.
	 */
	protected function __construct() {
	}

	/**
	 * Prevent cloning
	 *
	 * @since v1.0.0
	 * @access private
	 */
	private function __clone() {
	}

	/**
	 * Prevent serialization
	 *
	 * @since v1.0.0
	 * @access private
	 */
	private function __wakeup() {
	}

	/**
	 * Get the Itinerary
	 *
	 * @since v1.0.0
	 *
	 * @param int $id
	 *
	 * @return mixed
	 */
	public static function getInstance($id = null) {
		if (null === static::$instance || $id) {
			self::$instance = new static();
			self::$instance->init();

			if ($id) {
				self::$instance->load($id);
			}

			return self::$instance;
		}

		return static::$instance;
	}

	/**
	 * Run the install functions on plugin activation
	 *
	 * @todo Create install class to handle this
	 *
	 * @since v1.0.0
	 *
	 */
	public static function install() {
		Itinerary_Model::install();
	}

	/**
	 *
	 * @since v1.0.0
	 *
	 * @param $id
	 */
	private function init() {
		$this->ajax_action('load_itinerary', 'ajaxLoadItinerary');
		$this->ajax_action('get_itinerary_stops', 'ajaxGetItineraryStops');
		$this->ajax_action('get_itinerary_garage', 'ajaxGetItineraryGarage');
		$this->ajax_action('new_itinerary', 'ajaxAdd');
		$this->ajax_action('add_itinerary_stop', 'ajaxAddStop');
		$this->ajax_action('remove_itinerary_stop', 'ajaxRemoveStop');
		$this->ajax_action('refresh_garage', 'ajaxRefreshGarage');
		$this->ajax_action('update_garage_stop_order', 'ajaxUpdateGarageStopOrder');
		$this->ajax_action('show_itinerary', 'ajaxShowItinerary');
		$this->ajax_action('itinerary_save_png', 'ajaxSavePng');

		$this->isLoaded = true;
	}

	/**
	 *
	 *
	 * @since v1.0.0
	 *
	 * @param int $id
	 */
	public function load($id = null) {
		if ($id) {
			$this->model = new Itinerary_Model($id);
		}

		if ($this->model) {
			$this->isModelLoaded = true;
		}
	}

	/**
	 *
	 *
	 * @since v1.0.0
	 *
	 * @return bool
	 */
	public function hasItinerary() {
		$Itinerary_Model = new Itinerary_Model();
		$itinerary = $Itinerary_Model->decodeCookie();

		return !empty($itinerary) ? true : false;
	}

	/**
	 *
	 * @since v1.0.0
	 */
	public function ajaxAdd() {
		$Itinerary_Model = new Itinerary_Model();
		$itinerary = $Itinerary_Model->create();

		wp_send_json_success(['itinerary' => $itinerary]);

		wp_die();
	}

	/**
	 *
	 *
	 * @since v1.0.0
	 *
	 */
	public function ajaxAddStop() {
		global $Itinerary;
		/** @global Itinerary_Settings_Controller $ItinerarySettings */
		global $ItinerarySettings;
		$itineraryId = filter_input(INPUT_GET, 'itinerary', FILTER_VALIDATE_INT);
		$placeId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

		$Itinerary = Itinerary_Controller::getInstance($itineraryId);
		$ItineraryStop = new Itinerary_Stop_Controller();
		$added = $ItineraryStop->model->add($Itinerary->model->getItineraryId(), $placeId, $_GET['type']);

		if ($added) {
			ob_start();
			global $post;
			$post = get_post($placeId);

			if ($post) {
				$status = true;
				$Itinerary_Stop_Model = new Itinerary_Stop_Model();
				$stop = $Itinerary_Stop_Model->loadByPlaceId($post->ID);

				Util::give('itinerary_stop_stop', $stop);
				get_itinerary_part(ITINERARY_MOLECULE . '/itinerary-garage-stop');

				$content = ob_get_clean(); // clean the output buffer and put the contents of it in a variable

				wp_reset_postdata();
			}
			else {
				$status = false;
				$message = 'An unexpected error has occurred.';
				$content = 'Nope.';
			}
		}

		wp_send_json(
			[
				'status' => $status,
				'itineraryId' => $Itinerary->model->getItineraryId(),
				'stopId' => $placeId,
				'stopCount' => $Itinerary->model->getNumberOfStops(),
				'itinerary_stops' => $Itinerary->model->getStopIds(),
				'message' => $message,
				'html' => $content,
				'extra' => [
					'addText' => $ItinerarySettings->model()->getAddItemText(),
					'removeText' => $ItinerarySettings->model()->getRemoveItemText(),
				],
			]
		);

		wp_die();
	}

	/**
	 *
	 *
	 * @since v1.0.0
	 *
	 */
	public function ajaxRemoveStop() {
		global $Itinerary;
		/** @global Itinerary_Settings_Controller $ItinerarySettings */
		global $ItinerarySettings;
		$itineraryId = filter_input(INPUT_GET, 'itinerary', FILTER_VALIDATE_INT);
		$placeId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

		$Itinerary = Itinerary_Controller::getInstance($itineraryId);
		$ItineraryStop = new Itinerary_Stop_Controller();
		$removed = $ItineraryStop->model->remove($placeId, $Itinerary->model->getItineraryId());

		if ($removed) {
			wp_send_json(
				array(
					'status' => true,
					'message' => 'Stop added to itinerary',
					'stopId' => $placeId,
					'stopCount' => $Itinerary->model->getNumberOfStops(),
					'itinerary_stops' => $Itinerary->model->getStopIds(),
					'extra' => [
						'addText' => $ItinerarySettings->model()->getAddItemText(),
						'removeText' => $ItinerarySettings->model()->getRemoveItemText(),
					],
				)
			);
		}

		wp_die();
	}

	/**
	 *
	 *
	 * @since v1.0.0
	 *
	 */
	public function ajaxRefreshGarage() {
		ob_start();

		Util::give('search_results_do_itinerary_buttons', false);
		get_itinerary_part(ITINERARY_ORGANISM . '/itinerary-garage-stops');

		wp_send_json(array('html' => ob_get_clean(), 'stopCount' => $this->model->getNumberOfStops()));

		wp_die();
	}

	/**
	 *
	 *
	 * @since v1.0.0
	 *
	 */
	public function ajaxUpdateGarageStopOrder() {
		global $Itinerary;
		/** @global Itinerary_Settings_Controller $ItinerarySettings */
		global $ItinerarySettings;
		$ids = (array)$_GET['ids'];

		$ItineraryStop = new Itinerary_Stop_Controller();

		ob_start();
		$orderUpdated = $ItineraryStop->model->updateStopsOrder($ids);
		$contents = ob_get_clean();

		wp_send_json(
			array(
				'status' => true,
				'message' => 'Order updated.',
				'html' => $contents,
			)
		);

		wp_die();
	}

	/**
	 * Retrieve itinerary stops and send back as json
	 *
	 * @since v1.0.0
	 *
	 * @access public
	 */
	public function ajaxGetItineraryStops() {
		ob_start();

		wp_send_json(
			array(
				'status' => true,
				'itinerary_stops' => ($this->model ? $this->model->getStopIds() : false),
			)
		);

		wp_die();
	}

	/**
	 *
	 */
	public function ajaxGetItineraryGarage() {
		ob_start();

		global $Itinerary;
		/** @global Itinerary_Settings_Controller $ItinerarySettings */
		global $ItinerarySettings;
		$itineraryId = filter_input(INPUT_GET, 'itinerary', FILTER_VALIDATE_INT);

		$Itinerary = new Itinerary_Controller();
		$Itinerary->load($itineraryId);

		get_itinerary_part(ITINERARY_ORGANISM . '/itinerary-garage');

		$contents = ob_get_clean();

		wp_send_json(
			array(
				'status' => true,
				'message' => 'Show Garage',
				'itinerary' => $Itinerary->model->getItineraryId(),
				'itinerary_stops' => $Itinerary->model->getStopIds(),
				'html' => $contents,
				'extra' => [
					'addText' => $ItinerarySettings->model()->getAddItemText(),
					'removeText' => $ItinerarySettings->model()->getRemoveItemText(),
				],
			)
		);

		wp_die();
	}

	public function ajaxLoadItinerary() {
		ob_start();

		global $Itinerary;
		/** @global Itinerary_Settings_Controller $ItinerarySettings */
		global $ItinerarySettings;
		$itineraryId = filter_input(INPUT_GET, 'itinerary', FILTER_VALIDATE_INT);
		$postID = filter_input(INPUT_GET, 'post_id', FILTER_VALIDATE_INT);

		$Itinerary = new Itinerary_Controller();
		$Itinerary->load($itineraryId);

		get_itinerary_part(ITINERARY_ORGANISM . '/itinerary-garage');

		$contents = ob_get_clean();

		wp_send_json(
			array(
				'status' => true,
				'message' => 'Show Garage',
				'itinerary' => $Itinerary->model->getItineraryId(),
				'itinerary_stops' => $Itinerary->model->getStopIds(),
				'html' => $contents,
				'extra' => [
					'addText' => $ItinerarySettings->model()->getAddItemText(),
					'removeText' => $ItinerarySettings->model()->getRemoveItemText(),
				],
			)
		);

		wp_die();
	}

	public function ajaxShowItinerary() {
		global $Itinerary;
		/** @global Itinerary_Settings_Controller $ItinerarySettings */
		global $ItinerarySettings;

		$itineraryId = filter_input(INPUT_GET, 'itinerary', FILTER_VALIDATE_INT);

		$Itinerary = new Itinerary_Controller();
		$Itinerary->load($itineraryId);

		ob_start();

		global $post;

		$stops = $Itinerary->model->getStopIds();

		if ($ItinerarySettings->model()->getDkpdfSupport()) {
			echo do_action('itinerary_button_pdf');
		}

		if ($ItinerarySettings->model()->getPrintSupport()) {
			echo do_action('itinerary_button_print');
		}

		foreach ($stops as $stop) {
			$post = $stop;
			setup_postdata($post);

			if (function_exists('fw_ext_page_builder_get_post_content')) {
				$content = do_shortcode(fw_ext_page_builder_get_post_content($stop));
			}
			else {
				$content = do_shortcode($stop);
			}
			$excerpt = substr(strip_tags($content), 0, 200);
			?>
			<section class="itinerary-stop">
				<div class="row">
					<div class="col-xs-12 col-sm-12">
						<h3><?php the_title(); ?></h3>
						<?= $excerpt; ?>...
					</div>
			</section>
			<?php
		}
		wp_reset_postdata();

		$stops = ob_get_clean();

		wp_send_json_success([
			'stops' => $stops,
		]);
	}

	public static function ajaxSavePng() {
		if (!current_user_can('administrator')) {
			wp_send_json_error([false]);
		}

		$data = $_POST['image'];
		$id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);
		$convertedImages = get_option('itinerary_converted_images') ?: [];

		if (!$id) {
			return 0;
		}

		if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
			$data = substr($data, strpos($data, ',') + 1);
			$type = strtolower($type[1]); // jpg, png, gif

			if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
				throw new \Exception('invalid image type');
			}

			$data = base64_decode($data);

			if ($data === false) {
				wp_send_json_error(['message' => 'base64_decode failed']);
			}
		}
		else {
			wp_send_json_error(['message' => 'did not match data URI with image data']);
			die();
			//			throw new \Exception('did not match data URI with image data');
		}

		file_put_contents(ITINERARY_PATH . '/tmp/pngs/' . $id . '.png', $data);

		if (!$convertedImages) {
			$convertedImages = [];
		}

		$convertedImages[] = $id;

		update_option('itinerary_converted_images', $convertedImages);

		wp_send_json_success(['message' => 'image saved']);
		die();
	}
}