<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 11/23/16
 * Time: 10:39 AM
 */

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

class Itinerary_Model extends Itinerary_Base_Model {
	/**
	 * @var int
	 */
	private $itineraryId;
	/**
	 * @var int
	 */
	private $itineraryUser;
	/**
	 * @var
	 */
	private $itineraryName;
	/**
	 * @var string
	 */
	private $cookieName = 'user_itinerary';
	/**
	 * @var
	 */
	private $stops;
	/**
	 * @var
	 */
	private $stopObjects;
	/**
	 * @var
	 */
	public $stopIds;

	/**
	 * Itinerary_Model constructor.
	 *
	 * @param null $id
	 */
	public function __construct($id = null) {
		$this->table = \Itinerary\Util::wpdb()->prefix . 'itineraries';
		parent::__construct();

		if ($id) {
			$this->mapper($id);
		}
	}

	/**
	 * @return mixed
	 */
	public function getItineraryUser() {
		return $this->itineraryUser;
	}

	/**
	 * @param $user
	 */
	public function setItineraryUser($user) {
		$this->itineraryUser = (int)$user;
	}

	/**
	 * @return mixed
	 */
	public function getItineraryName() {
		return $this->itineraryName;
	}

	/**
	 * @param mixed $itineraryName
	 */
	public function setItineraryName($itineraryName) {
		$this->itineraryName = $itineraryName;
	}

	/**
	 * @return string
	 */
	public function getCookieName() {
		return $this->cookieName;
	}

	/**
	 * @param string $cookieName
	 */
	public function setCookieName($cookieName) {
		$this->cookieName = $cookieName;
	}

	/**
	 * @param $id
	 */
	public function setItineraryId($id) {
		$this->itineraryId = (int)$id;
	}

	/**
	 * @return mixed
	 */
	public function getItineraryId() {
		return $this->itineraryId;
	}

	/**
	 *
	 */
	public static function install() {
		global $wpdb;
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		$sql = "
			CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}itineraries` (
			  `itinerary_id` int(11) NOT NULL AUTO_INCREMENT,
			  `itinerary_name` varchar(128) NOT NULL,
			  `itinerary_user` int(11) NOT NULL,
			  `status` tinyint(1) NOT NULL DEFAULT '1',
			  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
			  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
			  PRIMARY KEY (`itinerary_id`)
			) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
			";
		dbDelta($sql);

		$sql = "
			CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}itinerary_stops` (
			  `itinerary_stop_id` int(11) NOT NULL AUTO_INCREMENT,
			  `place_id` int(11) NOT NULL,
			  `itinerary_id` int(11) NOT NULL,
			  `itinerary_stop_type` varchar(128) NOT NULL,
			  `itinerary_stop_order` int(11) NOT NULL,
			  `status` tinyint(1) NOT NULL DEFAULT '1',
			  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
			  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
			  PRIMARY KEY (`itinerary_stop_id`),
			  KEY `itinerary_id` (`itinerary_id`)
			) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
		";

		dbDelta($sql);

		add_option('show_position', 'auto');
		add_option('itinerary_garage_auto_display', 'before-content');
		add_option('itinerary_garage_auto_display', 'before-content');
		add_option('itinerary_pdf_title', 'Itinerary');
		add_option('itinerary_garage_title', 'Itinerary');
		add_option('itinerary_view_text', 'View Itinerary');
		add_option('itinerary_empty_text', 'You don\'t have any stops in your itinerary. you can add stops by clicking the [button_example] icon.');
		add_option('itinerary_add_item_text', 'Add');
		add_option('itinerary_remove_item_text', 'Remove');
		add_option('itinerary_show_print', false);
		add_option('itinerary_dkpdf_support', false);
	}

	/**
	 * @param null $id
	 */
	public function get($id = null) {
		if ($id) {
			$sql = "
				SELECT i.itinerary_id, i.itinerary_name, i.itinerary_user, i.status
				FROM wp_itineraries AS i
				WHERE 1 = 1
				AND i.itinerary_id = $id
				AND i.status = 1
			";

			$results = $this->wpdb->get_row($sql);

			return $results;
		}
	}

	/**
	 *
	 */
	public function fetch() {
	}

	/**
	 * @return array|null|object
	 */
	public function fetchAll() {
		$sql = "
				SELECT i.itinerary_id, i.itinerary_name, i.itinerary_user, i.status
				FROM wp_itineraries AS i
				WHERE 1 = 1
			";

		$results = $this->wpdb->get_results($sql);

		return $results;
	}

	/**
	 * @param        $user
	 * @param string $name
	 *
	 * @return bool|int
	 */
	public function add($user, $name = 'Untitled') {
		$add = $this->wpdb->insert(
			'wp_itineraries', array(
			'itinerary_name' => $name,
			'itinerary_user' => $user,
		), array(
				'%s',
				'%d',
			)
		);

		if ($add) {
			//			$this->encodeCookie( array( 'user' => $this->getItineraryUser(), 'itinerary' => $this->wpdb->insert_id ) );

			return $this->wpdb->insert_id;
		}

		return false;
	}

	/**
	 *
	 */
	//    public function update() {

	//    }

	/**
	 *
	 */
	public function delete() {
	}

	/**
	 * @return array
	 */
	public function create() {
		$user = time();

		$this->setItineraryUser($user);
		$itineraryId = $this->add($this->getItineraryUser());

		return array('userId' => $this->getItineraryUser(), 'itineraryId' => $itineraryId);
	}

	/**
	 * @param $id
	 */
	public function loadById($id) {
		return $this->load($id);
	}

	/**
	 * @param $id
	 *
	 * @return $this
	 */
	public function mapper($data = null, $class = null) {
		if (filter_var($data, FILTER_VALIDATE_INT)) {
			$this->load($this->get($data), $this);
		}

		return $this;
	}

	/**
	 * @return Itinerary_Model
	 */
	public function loadFromCookie() {
		$cookie = $this->decodeCookie();
		$itinerary = $this->mapper($cookie->itineraryId);

		return $itinerary;
	}

	/**
	 * @param      $contents
	 * @param null $cookieName
	 */
	private function setCookie($contents, $cookieName = null) {
		$fullDomain = $_SERVER['SERVER_NAME'];
		$domainParts = explode('.', $fullDomain);
		$tld = end($domainParts);
		$name = $domainParts[(count($domainParts) - 2)];
		$domain = '.' . $name . '.' . $tld;

		if (!$cookieName) {
			$cookieName = $this->cookieName;
		}
		setcookie($cookieName, $contents, time() + (20 * 365 * 24 * 60 * 60), '/');
	}

	/**
	 *
	 */
	private function destroyCookie() {
		setcookie($this->cookieName, '', time() - 3600, '/');
	}

	/**
	 * @param null $cookieName
	 *
	 * @return mixed
	 */
	public function getCookie($cookieName = null) {
		if (!$cookieName) {
			$cookieName = $this->cookieName;
		}

		return $_COOKIE[$cookieName];
	}

	/**
	 * @return bool
	 */
	public function hasCookie() {
		return $this->getCookie() ? true : false;
	}

	/**
	 * @return mixed
	 */
	public function decodeCookie() {
		try {
			$cookie = json_decode(stripslashes($this->getCookie()));

			return $cookie;
		} catch (Exception $e) {
			return false;
		}
	}

	/**
	 * @param $contents
	 */
	public function encodeCookie($contents) {
		$this->setCookie(base64_encode(serialize($contents)));
	}

	/**
	 * @return array|null|object returns post ID
	 */
	public function getStops(Itinerary_Model $IM = null) {
		$Itinerary_Stop_Model = new Itinerary_Stop_Model();

		if (!$IM) {
			$IM = $this;
		}

		if ($IM || !$this->model->stops) {
			$this->stops = $Itinerary_Stop_Model->fetchAllFrom($IM->getItineraryId());
			$this->stopIds = array();

			foreach ($this->stops ?: [] as $stop) {
				$this->stopIds[] = $stop->place_id;
			}
		}

		return $this->stops;
	}

	/**
	 * @return mixed
	 */
	public function getStopIds(Itinerary_Model $IM = null) {
		if (!$IM) {
			$IM = $this;
		}

		if ($IM || !$this->stopIds) {
			$this->getStops($IM);
		}

		return $this->stopIds;
	}

	/**
	 * @return array
	 */
	public function getStopObjects(Itinerary_Model $IM = null) {
		if (!$IM) {
			$Itinerary_Model = $this;
		}
		else {
			$Itinerary_Model = $IM;
		}

		if ($IM || !$this->stopObjects) {
			$stops = array();
			foreach ($this->getStopIds($Itinerary_Model) as $stopID) {
				$stops[] = get_post($stopID);
			}

			$this->stopObjects = $stops;
		}

		return $this->stopObjects;
	}

	/**
	 * @return int
	 */
	public function getNumberOfStops() {
		return count($this->getStopIds());
	}

}