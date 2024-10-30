<?php

/**
 * Client List Table
 *
 * User: michael
 * Date: 3/8/17
 * Time: 8:06 PM
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Itinerary_List_Itineraries_View extends Itinerary_List_Table_View {

    function __construct() {
        global $status, $page;

        //Set parent defaults
        parent::__construct(array(
            'singular' => 'itinerary',     //singular name of the listed records
            'plural' => 'itineraries',    //plural name of the listed records
            'ajax' => false,        //does this table support ajax?
        ));

    }

    function column_default($item, $column_name) {
        return $item[$column_name];
    }

    function column_id($item) {
        $row_id = $item['id'];
//        $actions = array(
//            'edit' => sprintf('<a href="admin.php?page=voice-ai-clients&add_edit=%s">Edit</a>', $row_id),
//            'delete' => sprintf('<a href="admin.php?page=slm-main&action=delete_license&id=%s" onclick="return confirm(\'Are you sure you want to delete this record?\')">Delete</a>', $row_id),
//        );
//        return sprintf('%1$s <span style="color:silver"></span>%2$s',
//            /*$1%s*/
//            $item['id'],
//            /*$2%s*/
//            $this->row_actions($actions)
//        );
    }


    function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="%1$s[]" value="%2$s" />',
            /*$1%s*/
            $this->_args['singular'],  //Let's simply re-purpose the table's singular label
            /*$2%s*/
            $item['ClientID']               //The value of the checkbox should be the record's id
        );
    }

    function column_active($item) {
        if ($item['active'] == 1) {
            return 'active';
        }
        else {
            return 'inactive';
        }
    }


    function get_columns() {
        $columns = array(
            'cb' => '<input type="checkbox" />', //Render a checkbox
            'itinerary_id' => 'ID',
            'itinerary_name' => 'Name',
//            'itinerary_user' => 'User',
            'created_at' => 'Created At',
        );
        return $columns;
    }

    function get_sortable_columns() {
        $sortable_columns = array(
            'itinerary_id' => array('itinerary_id', false),
//            'itinerary_name' => array('itinerary_name', false),
            'itinerary_user' => array('itinerary_user', false),
        );
        return $sortable_columns;
    }

//    function get_bulk_actions() {
//        $actions = array(
//            'activate' => 'Activate',
//            'deactivate' => 'Deactivate',
//            'suspend' => 'Suspend',
//            'delete' => 'Delete',
//        );
//        return $actions;
//    }

    function process_bulk_action() {
//        $actions = array(
//            'activate',
//            'deactivate',
//            'delete',
//            'suspend',
//        );
//
//        if (in_array($this->current_action(), $actions)) {
//
//            $Client = new Ai_Controller_Voice_Client();
//
//            $success = $Client->bulkAction($this->current_action(), $_GET['client']);
//
//        }
//
//        if ('delete' === $this->current_action()) {
//            //Process delete bulk actions
//            if (!isset($_GET['client'])) {
//                $error_msg = '<p>' . __('Error - Please select some records using the checkboxes', 'slm') . '</p>';
//                echo '<div id="message" class="error fade">' . $error_msg . '</div>';
//                return;
//            }
//            else {
//                echo '<div id="message" class="updated fade"><p>Selected records deleted successfully!</p></div>';
//            }
//        }
//        else if ($this->current_action() === 'deactivate') {
//        }
    }


    function prepare_items() {
        /**
         * First, lets decide how many records per page to show
         */
        $per_page = 20;
        $columns = $this->get_columns();
        $hidden = [];
        $data = [];
        $sortable = $this->get_sortable_columns();

        $this->_column_headers = array($columns, $hidden, $sortable);

        $this->process_bulk_action();

        /* -- Ordering parameters -- */
        //Parameters that are going to be used to order the result
        $orderby = !empty($_GET["orderby"]) ? filter_input(INPUT_GET, 'orderby', FILTER_SANITIZE_STRING) : 'itinerary_id';
        $order = !empty($_GET["order"]) ? filter_input(INPUT_GET, 'order', FILTER_SANITIZE_STRING) : 'ASC';

        $IModel = new Itinerary_Model();
        $IModel->setOrder($orderby . ' ' . $order);
        $IModel->setReturnType(ARRAY_A);
//        $IModel->addWhere('Status < 10');


//        if (isset($_GET['vui_client_search'])) {
//            $search_term = trim(strip_tags($_GET['vui_client_search']));
//
//            $data = array(
//                'ClientID' => '%' . $search_term . '%',
//                'ClientName' => '%' . $search_term . '%',
//                'ClientKey' => '%' . $search_term . '%',
//                'SecretKey' => '%' . $search_term . '%',
//            );
//            $IModel->addWhereGroup($data, 'LIKE', 'OR');
//            $data = $IModel->query();
//        }
//        else {
        $data = $IModel->query();
//        }

        $current_page = $this->get_pagenum();
        $total_items = count($data);
        $data = array_slice($data, (($current_page - 1) * $per_page), $per_page);
        $dataWithEdit = [];
        foreach ($data as $itinerary) {
            $itinerary['itinerary_id'] = '<a href="' . admin_url() . '/admin.php?page=itinerary&id=' . $itinerary['itinerary_id'] . '" title="View itinerary ' . $itinerary['itinerary_id'] . '">' . $itinerary['itinerary_id'] . '</a>';
            $dataWithEdit[] = $itinerary;
        }

        $this->items = $dataWithEdit;
        $this->set_pagination_args(array(
            'total_items' => $total_items,                  //WE have to calculate the total number of items
            'per_page' => $per_page,                     //WE have to determine how many items to show on a page
            'total_pages' => ceil($total_items / $per_page)   //WE have to calculate the total number of pages
        ));
    }
}