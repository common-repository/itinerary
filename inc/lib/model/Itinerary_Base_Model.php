<?php

/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/7/16
 * Time: 7:32 PM
 */

use \Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

class Itinerary_Base_Model {

	protected $table;
	protected $primaryKeyColumn;
	protected $UserID;
	protected $placeholder;
	protected $select;
	protected $from;
	protected $join = '';
	protected $where = '';
	protected $order = '';
	protected $limit = '';
	protected $having = '';
	protected $returnType;
	protected $wpdb;

	/**
	 * Ai_Model_Base constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = Util::wpdb();

		$this->UserID = get_current_user_id();
		$this->placeholder = (object)array(
			'digit' => '%d',
			'string' => '%s',
			'float' => '%f',
		);
	}

	public function wpdb() {
		return $this->wpdb;
	}

	/**
	 * @return mixed
	 */
	final public function getTable() {
		return $this->getTable;
	}

	/**
	 * @return mixed
	 */
	public function getSelect() {
		if (empty($this->select)) {
			$this->setSelect('*');
		}

		return $this->select;
	}

	/**
	 * @param mixed $select
	 */
	public function setSelect($select) {
		$this->select = $select;
	}

	/**
	 * @return mixed
	 */
	public function getFrom() {
		if (empty($this->from)) {
			$this->setFrom($this->table);
		}

		return $this->from;
	}

	/**
	 * @param mixed $from
	 */
	public function setFrom($from) {
		$this->from = $from;
	}

	/**
	 * @return mixed
	 */
	public function getJoin() {
		return $this->join;
	}

	/**
	 * @param mixed $join
	 */
	public function setJoin($join) {
		$this->join = $join;
	}

	public function addJoin($join = '') {
		$joins = $this->getJoin();
		$this->setJoin($joins . "\n" . $join);
	}

	/**
	 * @return mixed
	 */
	public function getWhere() {
		if (is_array($this->where)) {
			return implode(' AND ', $this->where);
		}

		return $this->where;
	}

	/**
	 * @param array $where
	 */
	public function setWhere($where) {
		$this->where = $where;
	}

	/**
	 * @param        $where
	 * @param string $operator
	 * @param string $relation
	 */
	public function addWhere($where, $operator = '=', $relation = 'AND') {
		if (!is_array($this->where)) {
			$this->where = [];
		}

		$this->where[] = $where;
	}

	/**
	 * @param        $data
	 * @param string $operator
	 * @param string $relation
	 */
	public function addWhereGroup($data, $operator = '=', $relation = 'AND') {
		$wheres = [];
		foreach ($data as $key => $val) {
			$wheres[] = ' ' . $key . ' ' . $operator . ' \'' . $val . '\' ';
		}

		$where = '(' . implode($relation, $wheres) . ')';
		$this->addWhere($where);
	}

	/**
	 * @return mixed
	 */
	public function getOrder() {
		return $this->order;
	}

	/**
	 * @param mixed $order
	 */
	public function setOrder($order) {
		$this->order = $order;
	}

	/**
	 * @return string
	 */
	public function getLimit() {
		return $this->limit;
	}

	/**
	 * @param string $limit
	 */
	public function setLimit($limit) {
		$this->limit = $limit;
	}

	/**
	 * @return mixed
	 */
	public function getHaving() {
		return $this->having;
	}

	/**
	 * @param mixed $having
	 */
	public function setHaving($having) {
		$this->having = $having;
	}

	/**
	 * @return mixed
	 */
	public function getReturnType() {
		if (empty($this->returnType)) {
			$this->returnType = OBJECT;
		}

		return $this->returnType;
	}

	/**
	 * @param mixed $returnType
	 */
	public function setReturnType($returnType) {
		$this->returnType = $returnType;
	}

	/**
	 * @param $var
	 */
	protected function debug($var) {
		if (isset($_GET['debug'])) {
			\Itinerary\Util::p($var);
		}
	}

	/**
	 * @param null $data
	 * @param null $class
	 *
	 * @return $this
	 */
	public function mapper($data = null, $class = null) {
		if (!$class) {
			$class = $this;
		}
		if (!is_array($data) && !is_object($data) && gettype($data) === 'integer') {
			$this->quick_load($data);
		}
		if ($data) {
			foreach ($data as $column => $value) {
				$column = \Itinerary\Util::camelCase($column);
				if (method_exists($class, 'set' . $column)) {
					call_user_func(array($class, 'set' . $column), $value);
				}
			}
		}

		return $this;
	}

	/**
	 * @param null $id
	 *
	 * @return array|bool
	 */
	protected function quick_load($id = null) {
		if (!$id || !isset($this->table) || !isset($this->primaryKeyColumn)) {
			return false;
		}
		$sql = '
				SELECT *
				FROM ' . $this->table . '
				WHERE ' . $this->primaryKeyColumn . ' = ' . $this->placeholder->digit . '
			';
		$data = array($id);

		return $this->prepare($sql, $data);
	}

	/**
	 * @param $sql
	 * @param $data
	 *
	 * @return array
	 */
	protected function prepare($sql, $data) {
		$returnSql = \Itinerary\Util::wpdb()->prepare($sql, $data);

		if ($returnSql) {
			return $returnSql;
		}

		return array(
			'error' => \Itinerary\Util::wpdb()->last_error,
			'sql' => $sql,
			'data' => $data,
		);
	}

	/**
	 * @param      $sql
	 * @param null $data
	 *
	 * @return WP_Error|object
	 */
	protected function get_row($sql, $data = null) {
		if ($data) {
			$sql = $this->prepare($sql, $data);
		}

		$results = \Itinerary\Util::wpdb()->get_row($sql, $this->getReturnType());
		if ($results) {
			return $results;
		}

		return new WP_Error('1002333', 'Error fetching results', \Itinerary\Util::wpdb());
	}

	/**
	 * @param      $sql
	 * @param null $data
	 *
	 * @return WP_Error|object
	 */
	protected function get_var($sql, $data = null) {
		if ($data) {
			$sql = $this->prepare($sql, $data);
		}

		$results = \Itinerary\Util::wpdb()->get_var($sql);
		if ($results) {
			return $results;
		}

		return new WP_Error('1002333', 'Error fetching results', \Itinerary\Util::wpdb());
	}

	/**
	 * @param      $sql
	 * @param null $data
	 *
	 * @return WP_Error|array
	 */
	protected function get_results($sql, $data = null) {
		if ($data) {
			$sql = $this->prepare($sql, $data);
		}

		$results = \Itinerary\Util::wpdb()->get_results($sql, $this->getReturnType());

		if ($results) {
			return $results;
		}

		return new WP_Error('1002334', 'Error fetching results', $data);
	}

	/**
	 * @param       $data
	 * @param       $where
	 * @param array $format
	 * @param array $whereFormat
	 * @param null $table
	 *
	 * @return mixed
	 */
	protected function update($data, $where, $format = array(), $whereFormat = array(), $table = null) {
		$updated = Util::wpdb()->update(
			($table ?: $this->table), $data, $where, $format, $whereFormat
		);

		return $updated;
	}

	/**
	 * @param       $data
	 * @param array $format
	 * @param null $table
	 *
	 * @return bool|WP_Error
	 */
	protected function insert($data, $format = array(), $table = null) {
		$inserted = \Itinerary\Util::wpdb()->insert(
			($table ?: $this->table), $data, $format
		);

		if ($inserted) {
			return \Itinerary\Util::wpdb()->insert_id;
		}

		return new WP_Error('1002335', 'Error inserting record', array($this->table, $data));
	}

	/**
	 * @param       $data
	 * @param array $format
	 * @param null $table
	 *
	 * @return bool|WP_Error
	 */
	protected function replace($data, $format = array(), $table = null) {
		$inserted = \Itinerary\Util::wpdb()->replace(
			($table ?: $this->table), $data, $format
		);

		if ($inserted) {
			return true;
		}

		return new WP_Error('1002335', 'Error inserting record', array($this->table, $data));
	}

	/**
	 * @return WP_Error
	 */
	public function query() {
		$sql = 'SELECT ' . $this->getSelect();
		$sql .= ' FROM ' . $this->getFrom();
		$sql .= ' ' . $this->getJoin();
		$sql .= ($this->getWhere() ? ' WHERE ' . $this->getWhere() : '');
		$sql .= ($this->getOrder() ? ' ORDER BY ' . $this->getOrder() : '');
		$sql .= ($this->getHaving() ? ' HAVING' . $this->getHaving() : '');
		$sql .= ($this->getLimit() ? ' LIMIT ' . $this->getLimit() : '');

		$results = $this->get_results($sql);

		return $results;
	}

	public function toJson() {
		return json_encode($this->toArray());
	}

	public function toArray() {
		return get_object_vars($this);

	}

	protected function load($data = null, $class = null) {
		if (!$class) {
			$class = $this;
		}
		if ($data) {
			foreach ($data as $column => $value) {
				$column = Util::camelCase($column);
				if (method_exists($class, 'set' . $column)) {
					call_user_func(array($class, 'set' . $column), $value);
				}
			}
		}
	}

}