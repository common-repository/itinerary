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

class Itinerary_Stop_Model extends Itinerary_Base_Model {
	private $itinerary_stop_id;
	private $place_id;
	private $itinerary_id;
	private $itinerary_stop_type;
	private $itinerary_stop_order;
	private $status;
	private $updated_at;
	private $created_at;

	// WP post object
	private $postObject;
	private $postTitle;
	private $postContent;
	private $postAuthor;
	private $postStatus;
	private $postName;
	private $postModified;
	private $postParent;
	private $guid;
	private $menuOrder;
	private $postType;
	private $postDate;
	private $permalink;
	private $featuredImage;

	/**
	 * Itinerary_Stop_Model constructor.
	 */
	public function __construct() {
		$this->table = \Itinerary\Util::wpdb()->prefix . 'itinerary_stops';
		parent::__construct();
	}

	/**
	 * @return mixed
	 */
	public function getItineraryStopId() {
		return $this->itinerary_stop_id;
	}

	/**
	 * @param mixed $itinerary_stop_id
	 */
	public function setItineraryStopId($itinerary_stop_id) {
		$this->itinerary_stop_id = (int)$itinerary_stop_id;
	}

	/**
	 * @return mixed
	 */
	public function getPlaceId() {
		return $this->place_id;
	}

	/**
	 * @param mixed $place_id
	 */
	public function setPlaceId($placeId) {
		$this->place_id = (int)$placeId;
	}

	/**
	 * @return mixed
	 */
	public function getItineraryId() {
		return $this->itinerary_id;
	}

	/**
	 * @param mixed $itinerary_id
	 */
	public function setItineraryId($itinerary_id) {
		$this->itinerary_id = (int)$itinerary_id;
	}

	/**
	 * @return mixed
	 */
	public function getItineraryStopType() {
		return $this->itinerary_stop_type;
	}

	/**
	 * @param mixed $itinerary_stop_type
	 */
	public function setItineraryStopType($itinerary_stop_type) {
		$this->itinerary_stop_type = $itinerary_stop_type;
	}

	/**
	 * @return mixed
	 */
	public function getItineraryStopOrder() {
		return $this->itinerary_stop_order;
	}

	/**
	 * @param mixed $itinerary_stop_order
	 */
	public function setItineraryStopOrder($itinerary_stop_order) {
		$this->itinerary_stop_order = (int)$itinerary_stop_order;
	}

	/**
	 * @return mixed
	 */
	public function getStatus() {
		return $this->status;
	}

	/**
	 * @param mixed $status
	 */
	public function setStatus($status) {
		$this->status = (int)$status;
	}

	/**
	 * @return mixed
	 */
	public function getUpdatedAt() {
		return $this->updated_at;
	}

	/**
	 * @param mixed $updated_at
	 */
	public function setUpdatedAt($updated_at) {
		$this->updated_at = $updated_at;
	}

	/**
	 * @return mixed
	 */
	public function getCreatedAt() {
		return $this->created_at;
	}

	/**
	 * @param mixed $created_at
	 */
	public function setCreatedAt($created_at) {
		$this->created_at = $created_at;
	}

	/**
	 * @return mixed
	 */
	public function getPostObject() {
		return $this->postObject;
	}

	/**
	 * @param mixed $postObject
	 */
	public function setPostObject($postObject) {
		if ($postObject) {
			$this->load($postObject);

			if (get_the_post_thumbnail_url($this->getPlaceId())) {
				$this->setFeaturedImage(get_the_post_thumbnail_url($this->getPlaceId()));
			}
			if (get_the_permalink($this->getPlaceId())) {
				$this->setPermalink(get_the_permalink($this->getPlaceId()));
			}
		}
	}

	/**
	 * @return mixed
	 */
	public function getPostTitle() {
		return $this->postTitle;
	}

	/**
	 * @param mixed $postTitle
	 */
	public function setPostTitle($postTitle) {
		$this->postTitle = $postTitle;
	}

	/**
	 * @return mixed
	 */
	public function getPostContent($relative = false) {
		$content = $this->postContent;

		// Unyson Page Builder content
		if (function_exists('fw_ext_page_builder_get_post_content')) {
			$content = fw_ext_page_builder_get_post_content($this->getPlaceId());
		}

		if ($relative) {
			$siteUrl = get_site_url() . '/';
			$content = str_replace($siteUrl, '', $content);
		}

		$content = preg_replace('/<iframe "[^>]+\>/i', "", $content);

		return $content;
	}

	/**
	 * @param mixed $postContent
	 */
	public function setPostContent($postContent) {
		$this->postContent = $postContent;
	}

	/**
	 * @return mixed
	 */
	public function getPostAuthor() {
		return $this->postAuthor;
	}

	/**
	 * @param mixed $postAuthor
	 */
	public function setPostAuthor($postAuthor) {
		$this->postAuthor = $postAuthor;
	}

	/**
	 * @return mixed
	 */
	public function getPostStatus() {
		return $this->postStatus;
	}

	/**
	 * @param mixed $postStatus
	 */
	public function setPostStatus($postStatus) {
		$this->postStatus = $postStatus;
	}

	/**
	 * @return mixed
	 */
	public function getPostName() {
		return $this->postName;
	}

	/**
	 * @param mixed $postName
	 */
	public function setPostName($postName) {
		$this->postName = $postName;
	}

	/**
	 * @return mixed
	 */
	public function getPostModified() {
		return $this->postModified;
	}

	/**
	 * @param mixed $postModified
	 */
	public function setPostModified($postModified) {
		$this->postModified = $postModified;
	}

	/**
	 * @return mixed
	 */
	public function getPostParent() {
		return $this->postParent;
	}

	/**
	 * @param mixed $postParent
	 */
	public function setPostParent($postParent) {
		$this->postParent = $postParent;
	}

	/**
	 * @return mixed
	 */
	public function getGuid() {
		return $this->guid;
	}

	/**
	 * @param mixed $guid
	 */
	public function setGuid($guid) {
		$this->guid = $guid;
	}

	/**
	 * @return mixed
	 */
	public function getMenuOrder() {
		return $this->menuOrder;
	}

	/**
	 * @param mixed $menuOrder
	 */
	public function setMenuOrder($menuOrder) {
		$this->menuOrder = $menuOrder;
	}

	/**
	 * @return mixed
	 */
	public function getPostType() {
		return $this->postType;
	}

	/**
	 * @param mixed $postType
	 */
	public function setPostType($postType) {
		$this->postType = $postType;
	}

	/**
	 * @return mixed
	 */
	public function getPostDate() {
		return $this->postDate;
	}

	/**
	 * @param mixed $postDate
	 */
	public function setPostDate($postDate) {
		$this->postDate = $postDate;
	}

	/**
	 * @return mixed
	 */
	public function getPermalink() {
		return $this->permalink;
	}

	/**
	 * @param mixed $permalink
	 */
	public function setPermalink($permalink) {
		$this->permalink = $permalink;
	}

	/**
	 * @return mixed
	 */
	public function getFeaturedImage($relative = false) {
		$image = $this->featuredImage;
		if ($relative) {
			$siteUrl = get_site_url() . '/';
			$image = str_replace($siteUrl, '', $image);
		}
		return $image;
	}

	/**
	 * @param mixed $featuredImage
	 */
	public function setFeaturedImage($featuredImage) {
		$this->featuredImage = $featuredImage;
	}

	public function hasFeaturedImage() {
		return $this->getFeaturedImage() ? true : false;
	}

	public function loadData($data) {
		if ($data) {
			$this->load($data);
			$thePost = get_post($this->getPlaceId());
			$this->setPostObject($thePost);
		}
	}

	public function loadById($stopId) {
		$stop = $this->fetch($stopId);
		$this->loadData($stop);

		return $this;
	}

	/**
	 * @param int $stopId The ID of the post that is the "stop"
	 *
	 * @param null $itineraryId
	 * @return $this
	 */
	public function loadByPlaceId($stopId, $itineraryId = null) {
		$Itinerary_Stop_Model = new Itinerary_Stop_Model();
		$stop = $Itinerary_Stop_Model->fetchStopByPlaceId($stopId, $itineraryId);
		$this->loadData($stop);

		return $this;
	}

	/**
	 * @TODO verify permission to edit
	 *
	 * Update the order of the itinerary
	 *
	 * @param $ids
	 *
	 * @return bool
	 */
	public function updateStopsOrder($ids, $itineraryId = null) {
		if (!$itineraryId) {
			/**
			 * @var Itinerary_Controller $Itinerary
			 */
			global $Itinerary;
			$Itinerary = Itinerary_Controller::getInstance(filter_input(INPUT_GET, 'itinerary', FILTER_VALIDATE_INT));
			$itineraryId = $Itinerary->model->getItineraryId();
		}

		if ($itineraryId) {

			foreach ($ids as $index => $stopID) {
				$data = array('itinerary_stop_order' => $index);
				$where = array('place_id' => $stopID, 'itinerary_id' => $itineraryId);
				$format = array('%d');
				$where_format = array('%d');

				$update = $this->update($data, $where, $format, $where_format);
			}

			return true;
		}
		return false;
	}

	/**
	 * @param null $id
	 *
	 * @return array|null|object|void
	 */
	public function fetch($id = null) {

		if ($id) {
			$sql = "
		SELECT stop.itinerary_stop_id, stop.place_id, stop.itinerary_id, stop.itinerary_stop_type, stop.itinerary_stop_order, stop.status
		FROM wp_itinerary_stops AS stop
		WHERE 1 = 1
		AND stop.itinerary_stop_id = $id
		AND stop.status = 1
		";

			return $this->wpdb->get_row($sql);
		}
	}

	/**
	 * @param null $itineraryId
	 *
	 * @return array|null|object
	 */
	public function fetchAllFrom($itineraryId = null) {
		if ($itineraryId) {
			$sql = "
		SELECT stop.itinerary_stop_id, stop.place_id, stop.itinerary_id, stop.itinerary_stop_type, stop.itinerary_stop_order, stop.status
		FROM wp_itinerary_stops AS stop
		WHERE 1 = 1
		AND stop.itinerary_id = $itineraryId
		AND stop.status = 1
		ORDER BY stop.itinerary_stop_order
		";


			return $this->wpdb->get_results($sql);
		}
	}


	/**
	 * @param null $itineraryId
	 *
	 * @return array|null|object
	 */
	public function fetchStopByPlaceId($placeId, $itineraryId = null) {
		global $Itinerary;

		if (!$itineraryId) {
			$itineraryId = $Itinerary->model->getItineraryId();
		}

		$sql = "
			SELECT stop.itinerary_stop_id, stop.place_id, stop.itinerary_id, stop.itinerary_stop_type, stop.itinerary_stop_order, stop.status
			FROM wp_itinerary_stops AS stop
			WHERE 1 = 1
			AND stop.itinerary_id = $itineraryId
			AND stop.place_id = $placeId
			AND stop.status = 1
			ORDER BY stop.itinerary_stop_order
		";

		$row = $this->wpdb->get_row($sql);

		return $row;
	}

	/**
	 * @param        $id
	 * @param string $type
	 *
	 * @return bool|int
	 */
	public function add($itineraryId, $id, $type = '') {
		$itinerary = Itinerary_Controller::getInstance();

		$this->debug('Itinerary: ', $itineraryId);

		$added = $this->wpdb->insert(
			'wp_itinerary_stops', array(
			'itinerary_id' => $itineraryId,
			'place_id' => $id,
			'itinerary_stop_type' => $type,
		), array(
				'%d',
				'%d',
				'%s',
			)
		);

		if ($added) {
			return $this->wpdb->insert_id;
		}

		return false;
	}

	/**
	 * @param       $data
	 * @param       $where
	 * @param array $format
	 * @param array $where_format
	 *
	 * @return false|int
	 */
	//    public function update($data, $where, $format = array(), $where_format = array()) {
	//        return \Itinerary\Util::wpdb()->update(
	//            'wp_itinerary_stops', $data, $where, $format, $where_format
	//        );
	//    }


	/**
	 * @TODO verify permission to edit
	 *
	 * @param $stopId
	 * @param $itineraryId
	 *
	 * @return false|int
	 */
	public function remove($stopId, $itineraryId) {
		return $this->wpdb->update(
			'wp_itinerary_stops', array(
			'status' => 0,
		), array(
			'itinerary_id' => $itineraryId,
			'place_id' => $stopId,
		), array(
			'%d',
		), array(
				'%d',
				'%d',
			)
		);
	}

}