<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
get_itinerary_part(ITINERARY_PARTIALS . '/header');

$Itinerary_Model = new Itinerary_Model();


if (isset($_GET['id']) && !empty($_GET['id'])) {
    $itinerary = new Itinerary_Model(filter_input(INPUT_GET,'id', FILTER_VALIDATE_INT));
    ?>
    <h1><?= $itinerary->getItineraryName(); ?>
        <small>(<?= $itinerary->getItineraryId(); ?>)</small>
    </h1>
    <div class="itinerary-container">
        <div class="itinerary-row">
            <?php
            $stops = $Itinerary_Model->getStopIds($itinerary);
            $i = 1;
            foreach ($stops as $stop) {
                $ISM = new Itinerary_Stop_Model();
                $stop = $ISM->loadByPlaceId($stop, $itinerary->getItineraryId());
                ?>
                <div class="admin-itinerary itinerary-col-xs-12 itinerary-col-sm-4">
                    <?= get_the_post_thumbnail($stop->getPlaceId(), 'full', array('class' => 'img-responsive img-center')); ?>

                    <h3><?= get_the_title($stop->getPlaceId()); ?></h3>
                    <?= get_the_excerpt($stop->getPlaceId()); ?>
                </div>
                <?php
                $i++;
            }
            ?>
        </div>
    </div>
    <?php
}
else {
    get_itinerary_part(ITINERARY_PAGE . '/admin-itinerary-list');
    /*
    $itineraries = $Itinerary_Model->fetchAll();
    ?>
    <div class="table-responsive">
        <table class="table table-striped tabled-bordered table-hover">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
            </tr>
            </thead>
            <?php
            foreach ($itineraries as $itinerary) {
                $itinerary = new Itinerary_Model($itinerary->itinerary_id);
                ?>
                <tr>

                    <td>
                        <a href="admin.php?page=itinerary&id=<?= $itinerary->getItineraryId(); ?>"><?= $itinerary->getItineraryId(); ?></a>
                    </td>
                    <td><?= $itinerary->getItineraryName(); ?></td>

                </tr>
                <?php
            }
            ?>
        </table>
    </div>
    <?php
    */
}

get_itinerary_part(ITINERARY_PARTIALS . '/footer');