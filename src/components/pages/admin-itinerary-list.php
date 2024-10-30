<!-- src/components/pages/admin-itinerary-list.php -->
<?php

use Itinerary\Util;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
$button = array(
    'title' => 'Add New',
//    'href' => Ai_Controller_Voice_Client::route('add'),
    'attr' => array('title' => 'Add a new client'),
    'element' => 'span',
);
Util::give('button', $button);
?>
<div class="wrap">
    <h2>View Itineraries</h2>
    <div id="poststuff">
        <div id="post-body">

            <?php /*
            <div class="postbox">
                <h3 class="hndle"><label for="title">Client Search</label></h3>
                <div class="inside">
                    Search for a client by using email, name, domain, or key
                    <br/><br/>
                    <form method="GET" action="<?php echo $_SERVER["REQUEST_URI"]; ?>">
                        <?php
                        foreach ($_GET as $key => $val) {
                            ?>
                            <input type="hidden" name="<?= esc_attr($key); ?>" value="<?= esc_attr($val); ?>">
                            <?php
                        }
                        ?>
                        <input name="vui_client_search" type="text" size="40"
                               value="<?= filter_input(INPUT_GET, 'vui_client_search', FILTER_SANITIZE_STRING); ?>"/>
                        <input type="submit" name="vui_search_btn" class="button" value="Search"/>
                    </form>
                </div>
            </div>
            */ ?>

            <div class="postbox">
                <h3 class="hndle"><label for="title">Itineraries</label></h3>
                <div class="inside">
                    <form method="GET">
                        <input type="hidden" name="page" value="<?php echo esc_attr($_REQUEST['page']); ?>"/>
                        <?php
                        $ItineraryList = new Itinerary_List_Itineraries_View();
                        //Fetch, prepare, sort, and filter our data...
                        $ItineraryList->prepare_items();
                        $ItineraryList->display();
                        ?>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>