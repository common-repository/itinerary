<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 11/20/16
 * Time: 7:39 AM
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Search {
	
	private static $instance;
	private $fields = [];
	
	/**
	 * Controller_Draft constructor.
	 */
	protected function __construct() {
		
	}
	
	public static function getInstance() {
		
		if (null === static::$instance) {
			self::$instance = new static();
		}
		
		return static::$instance;
		
	}
	
	public function addField($termObj, $name, $type, $allowMultiple = false) {
		$term = new SearchTerm($termObj, $name, $type);
		
		if ($term->getParent() && !is_array($this->fields[$term->getParent()])) {
			$this->fields[$term->getParent()] = [];
		}
		$this->fields[$term->getParent()][] = $term;
	}
	
	public function addFields($termObjects, $name, $type, $allowMultiple = false) {
		
		if (!is_array($termObjects)) {
			$termObjects = array($termObjects);
		}
		
		foreach ($termObjects as $obj) {
			$this->addField($obj, $name, $type);
		}
	}
}