<?php
/**
 * Plugin Name:       Ollie Menu Designer
 * Description:       Design stunning mobile navigation and dropdown menus in minutes using the native WordPress block editor — no coding required.
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Version:           0.2.7
 * Author:            OllieWP Team
 * Author URI:        https://olliewp.com
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       ollie-menu-designer
 *
 * @package           ollie-menu-designer
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load plugin textdomain.
 *
 * @return void
 */
function omd_load_textdomain() {
	load_plugin_textdomain( 'ollie-menu-designer', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}

add_action( 'init', 'omd_load_textdomain' );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
if ( ! function_exists( 'omd_block_init' ) ) {
	function omd_block_init() {
		register_block_type( __DIR__ . '/build/blocks/mega-menu' );
	}
}

add_action( 'init', 'omd_block_init' );

/**
 * Add multisite-compatible URLs for the block editor.
 */
function omd_add_multisite_urls() {
	// Only needed in the block editor
	$current_screen = get_current_screen();
	if ( ! $current_screen || ! $current_screen->is_block_editor() ) {
		return;
	}

	// Generate a preview token for iframe authentication (cookies may not be sent)
	$preview_token = wp_generate_password( 32, false );
	set_transient( 'omd_preview_token_' . $preview_token, get_current_user_id(), HOUR_IN_SECONDS );

	// Provide correct URLs for multisite environments
	?>
	<script>
		window.menuDesignerData = {
			siteUrl: <?php echo wp_json_encode( home_url() ); ?>,
			adminUrl: <?php echo wp_json_encode( admin_url() ); ?>,
			previewToken: <?php echo wp_json_encode( $preview_token ); ?>
		};
	</script>
	<?php
}

add_action( 'admin_head', 'omd_add_multisite_urls' );

/**
 * Adds a custom template part area for dropdown menus to the list of template part areas.
 *
 * This function introduces a new area specifically for menu templates, allowing
 * the creation of sections within a dropdown menu. The new area is appended to the
 * existing list of template part areas.
 *
 * @see https://developer.wordpress.org/reference/hooks/default_wp_template_part_areas/
 *
 * @param array $areas Existing array of template part areas.
 *
 * @return array Modified array of template part areas including the new dropdown menu area.
 */
function omd_template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'menu',
		'area_tag'    => 'div',
		'description' => __( 'Menu templates are used to create dropdown menus and mobile menus.', 'ollie-menu-designer' ),
		'icon'        => 'layout',
		'label'       => __( 'Menu', 'ollie-menu-designer' ),
	);

	return $areas;
}

add_filter( 'default_wp_template_part_areas', 'omd_template_part_areas' );

add_action( 'plugins_loaded', function () {
	// Include preview functionality
	require_once plugin_dir_path( __FILE__ ) . 'includes/omd-preview.php';

// Include mobile menu functionality
	require_once plugin_dir_path( __FILE__ ) . 'includes/omd-mobile-menu-filter.php';
} );

/**
 * Display admin notice for Ollie Pro.
 *
 * @return void
 */
function omd_admin_notice_ollie_pro() {
	// Don't show if Ollie Pro is already active.
	if ( defined( 'OLPO_VERSION' ) ) {
		return;
	}

	// Only show to users who can manage options.
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Check if notice has been dismissed.
	if ( get_user_meta( get_current_user_id(), 'omd_dismissed_ollie_pro_notice', true ) ) {
		return;
	}

	?>
	<div class="notice notice-info is-dismissible omd-ollie-pro-notice">
		<p>
			<strong><?php esc_html_e( 'Love Menu Designer?', 'ollie-menu-designer' ); ?></strong>
			<?php esc_html_e( 'Unlock even more powerful features with Ollie Pro — premium blocks, patterns, and powerful editor tools for WordPress.', 'ollie-menu-designer' ); ?>
			<a href="https://olliewp.com/pro" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Learn more →', 'ollie-menu-designer' ); ?></a>
		</p>
	</div>
	<script>
		jQuery( function( $ ) {
			$( document ).on( 'click', '.omd-ollie-pro-notice .notice-dismiss', function() {
				$.post( ajaxurl, {
					action: 'omd_dismiss_ollie_pro_notice',
					nonce: '<?php echo esc_js( wp_create_nonce( 'omd_dismiss_notice' ) ); ?>'
				} );
			} );
		} );
	</script>
	<?php
}

add_action( 'admin_notices', 'omd_admin_notice_ollie_pro' );

/**
 * Handle AJAX request to dismiss the Ollie Pro notice.
 *
 * @return void
 */
function omd_dismiss_ollie_pro_notice() {
	check_ajax_referer( 'omd_dismiss_notice', 'nonce' );

	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( -1 );
	}

	update_user_meta( get_current_user_id(), 'omd_dismissed_ollie_pro_notice', true );
	wp_die();
}

add_action( 'wp_ajax_omd_dismiss_ollie_pro_notice', 'omd_dismiss_ollie_pro_notice' );
