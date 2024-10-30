<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 11/20/16
 * Time: 7:39 AM
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class SearchTerm {
	
	/**
	 * @var name of the field [input name="$name"]
	 */
	private $name;
	
	/**
	 * @var
	 */
	private $label;
	
	/**
	 * @var type of the field [input type="$type"]
	 */
	private $type;
	
	/**
	 * @var value of the field [input type="$value"]
	 */
	private $value;
	
	private $parent;
	
	/**
	 * @var
	 */
	private $termObject;
	
	public function __construct($termObj, $name, $type, $allowMultiple = false) {
		
		if (empty($name)) {
			trigger_error("Missing parameter 2: name must be set", E_USER_WARNING);
		}
		if (empty($type)) {
			trigger_error("Missing parameter 3: name must be set", E_USER_WARNING);
		}
	
		if( !($termObj instanceof WP_Term)) {
			$termObj = get_term($termObj);
		}
		
		$this->setName($name);
		$this->setType($type);
		$this->setValue($termObj->term_id);
		$this->setLabel($termObj->name);
		$this->setParent($termObj->parent);
		
		
	}
	
	/**
	 * @return name
	 */
	public function getName() {
		return $this->name;
	}
	
	/**
	 * @param name $name
	 */
	public function setName($name) {
		$this->name = $name;
	}
	
	/**
	 * @return type
	 */
	public function getType() {
		return $this->type;
	}
	
	/**
	 * @param type $type
	 */
	public function setType($type) {
		$this->type = $type;
	}
	
	/**
	 * @return value
	 */
	public function getValue() {
		return $this->value;
	}
	
	/**
	 * @param value $value
	 */
	public function setValue($value) {
		$this->value = $value;
	}
	
	/**
	 * @return mixed
	 */
	public function getLabel() {
		return $this->label;
	}
	
	/**
	 * @param mixed $label
	 */
	public function setLabel($label) {
		$this->label = $label;
	}
	
	/**
	 * @return mixed
	 */
	public function getParent() {
		return $this->parent;
	}
	
	/**
	 * @param mixed $parent
	 */
	public function setParent($parent) {
		$this->parent = $parent;
	}
	
	
	
}