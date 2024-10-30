<!-- src/components/organisms/settings.php -->
<?php

use Itinerary\Util;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly
$ItinerarySettingsModel = new Itinerary_Settings_Model();

?>
<div class="itinerary-settings-index">
	<h1>Itinerary Settings</h1>
	<?php
	if (isset($_GET['settings-updated']) && $_GET['settings-updated']) {
		?>
		<div class="notice notice-success is-dismissible">
			<p><?php _e('Settings updated!', 'wisnet-itinerary'); ?></p>
		</div>
		<?php
	}
	?>
	<div id="poststuff">
		<div id="post-body">
			<div class="postbox">
				<div class="inside">
					<strong>Add the following shortcode to the page where you want to list out all of the itinerary
					        items</strong>
					<div>
						<code>
							[itinerary]
						</code>
					</div>
				</div>
			</div>
			<form method="post" action="options.php?wisnet=itinerary">
				<?php settings_fields('itinerary_settings'); ?>
				<?php do_settings_sections('itinerary_settings'); ?>
				<div class="postbox">
					<h3 class="hndle">Global Settings</h3>
					<div class="inside">

						<?php wp_nonce_field('itinerary_settings_nonce', 'itinerary_settings_nonce_val') ?>
						<table class="form-table">
							
							<tr valign="top">
								<th scope="row"><label for="show_position">Display Add/Remove Buttons: </label></th>
								<td>
									<select id="itinerary_show_position" class="form-control" name="itinerary_show_position">
										<?php
										foreach ($ItinerarySettingsModel->getShowPositionOptions() as $value => $nicename) {
											$selected = $ItinerarySettingsModel->getShowPosition() == $value ? 'selected' : '';
											?>
											<option value="<?= $value; ?>" <?= $selected; ?>><?= $nicename; ?></option>
											<?php
										}
										?>
									</select>
								</td>
							</tr>
							
							<tr valign="top">
								<th scope="row"><label for="show_position">Display Garage: </label></th>
								<td>
									<select id="itinerary_garage_auto_display" class="form-control"
									        name="itinerary_garage_auto_display">
										<?php
										foreach ($ItinerarySettingsModel->getAutoDisplayOptions() as $value => $nicename) {
											$selected = $ItinerarySettingsModel->getAutoDisplay() == $value ? 'selected' : '';
											?>
											<option value="<?= $value; ?>" <?= $selected; ?>><?= $nicename; ?></option>
											<?php
										}
										?>
									</select>
								</td>
							</tr>
							
							<tr valign="top">
								<th scope="row"><label for="itinerary_page">Display Page: </label></th>
								<td>
									<?php

									$pages = get_posts([
										'post_type' => 'page',
										'orderby' => 'post_title',
										'order' => 'ASC',
										'posts_per_page' => -1,
									]);

									?>
									<select id="itinerary_page" class="form-control" name="itinerary_page">
										<?php
										foreach ($pages as $page) {
											$selected = $ItinerarySettingsModel->getDisplayPage() == $page->ID ? 'selected' : '';
											?>
											<option value="<?= $page->ID; ?>" <?= $selected; ?>><?= $page->post_title; ?></option>
											<?php
										}
										?>
									</select>
									<div>
										<small>Don't forget to add the shortcode to that page!</small>
										<code>
											[itinerary]
										</code>
									</div>
								</td>
							</tr>

							<tr valign="top">
								<th scope="row"><label for="report_to_pdf_page">PDF Convert Page: </label></th>
								<td>
									<select id="report_to_pdf_page" class="form-control" name="report_to_pdf_page">
										<?php
										foreach ($pages as $page) {
											$selected = $ItinerarySettingsModel->getConvertReportPage() == $page->ID ? 'selected' : '';
											?>
											<option value="<?= $page->ID; ?>" <?= $selected; ?>><?= $page->post_title; ?></option>
											<?php
										}
										?>
									</select>
									<div>
										<small>Don't forget to add the shortcode to that page!</small>
										<code>
											[itinerary_report_to_pdf]
										</code>
									</div>
								</td>
							</tr>

							<tr valign="top">
								<th scope="row"><label for="itinerary_show_print">Print Support: </label></th>
								<td>
									<?php $print = $ItinerarySettingsModel->getPrintSupport(); ?>
									<label for="dkpdf-support">Yes
										<input type="radio" name="itinerary_show_print" value="1" <?= $print ? 'checked' : ''; ?>/>
									</label>
									<label>No
										<input type="radio" name="itinerary_show_print" value="0" <?= !$print ? 'checked' : ''; ?>/>
									</label>
								</td>
							</tr>
							
							<tr valign="top">
								<th scope="row"><label for="itinerary_dkpdf_support">DK PDF Support: </label></th>
								<td>
									<?php $dkpdfSupport = $ItinerarySettingsModel->getDkpdfSupport(); ?>
									<label for="dkpdf-support">Yes
										<input type="radio" name="itinerary_dkpdf_support" value="1" <?= $dkpdfSupport ? 'checked' : ''; ?>/>
									</label>
									<label>No
										<input type="radio" name="itinerary_dkpdf_support" value="0" <?= !$dkpdfSupport ? 'checked' : ''; ?>/>
									</label>
									<p>
										<small>Requires the
											<a href="https://wordpress.org/plugins/dk-pdf/" target="_blank">DK PDF</a> plugin
										</small>
									</p>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div class="postbox">
					<h3 class="hndle">Itinerary Text</h3>
					<div class="inside">
						<table class="form-table">
							<tr valign="top">
								<th scope="row"><label for="itinerary_garage_title">Garage Title: </label></th>
								<td>
									<input type="text" name="itinerary_garage_title" value="<?= esc_attr($ItinerarySettingsModel->getGarageTitle()); ?>" />
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label for="itinerary_empty_text">Empty Itinerary Text: </label></th>
								<td>
									<textarea name="itinerary_empty_text"><?= esc_attr($ItinerarySettingsModel->getEmptyItineraryText()); ?></textarea>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label for="itinerary_view_text">View Itinerary Text: </label></th>
								<td>
									<input type="text" name="itinerary_view_text" value="<?= esc_attr($ItinerarySettingsModel->getViewItineraryText()); ?>" />
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label for="itinerary_add_item_text">Add Item Text: </label></th>
								<td>
									<input type="text" name="itinerary_add_item_text" value="<?= esc_attr($ItinerarySettingsModel->getAddItemText()); ?>" />
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label for="itinerary_remove_item_text">Remove Item Text: </label></th>
								<td>
									<input type="text" name="itinerary_remove_item_text" value="<?= esc_attr($ItinerarySettingsModel->getRemoveItemText()); ?>" />
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div class="postbox">
					<h3 class="hndle">Itinerary Display</h3>
					<div class="inside">
						<table class="form-table">
							<tr valign="top">
								<th scope="row"><label for="itinerary_pdf_title">PDF Title: </label></th>
								<td>
									<input type="text" name="itinerary_pdf_title" value="<?= esc_attr($ItinerarySettingsModel->getPdfTitle()); ?>" />
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label for="itinerary_pdf_footer">PDF Footer: </label></th>
								<td>
									<?php
									$settings = array(
										'teeny' => false,
										'textarea_rows' => 15,
										'tabindex' => 1
									);
									wp_editor($ItinerarySettingsModel->getPdfFooter(), 'itinerary_pdf_footer', $settings);
									?>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div class="postbox">
					<h3 class="hndle">Cover Page (optional)</h3>
					<div class="inside">
						<table class="form-table">
							<tr valign="top">
								<th scope="row"><label for="itinerary_cover_page">Cover Page: </label></th>
								<td>
									<?php
									$settings = array(
										'teeny' => false,
										'textarea_rows' => 15,
										'tabindex' => 1
									);
									wp_editor($ItinerarySettingsModel->getCoverPage(), 'itinerary_cover_page', $settings);
									?>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div class="postbox">
					<h3 class="hndle">Advanced</h3>
					<div class="inside">
						<table class="form-table">
							<tr valign="top">
								<th scope="row">
									<label for="itinerary_cover_page">Convert SVG Elements to PNG images: </label></th>
								<td>
									<?php $convert = $ItinerarySettingsModel->isConvertSvgToPng(); ?>
									<label for="dkpdf-support">Yes
										<input type="radio" name="itinerary_svg_to_png" value="1" <?= $convert ? 'checked' : ''; ?>/>
									</label>
									<label>No
										<input type="radio" name="itinerary_svg_to_png" value="0" <?= !$convert ? 'checked' : ''; ?>/>
									</label>
								</td>
							</tr>
						</table>
					</div>
				</div>
				
				<div class="card-section">
					<?php submit_button(); ?>
				</div>
			</form>
		</div>
	</div>
</div>
