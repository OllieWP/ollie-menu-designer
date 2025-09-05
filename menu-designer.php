<?php
/**
 * Plugin Name:       Menu Designer
 * Description:       Design stunning mobile navigation and dropdown menus in minutes using the native WordPress block editor — no coding required.
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Version:           0.1.7
 * Author:            Mike McAlister
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       menu-designer
 *
 * @package           menu-designer
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function menu_designer_block_init() {
	register_block_type( __DIR__ . '/build/blocks/mega-menu' );
}

add_action( 'init', 'menu_designer_block_init' );

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
function menu_designer_template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'menu',
		'area_tag'    => 'div',
		'description' => __( 'Menu templates are used to create dropdown menus and mobile menus.', 'menu-designer' ),
		'icon'        => 'layout',
		'label'       => __( 'Menu', 'menu-designer' ),
	);

	return $areas;
}

add_filter( 'default_wp_template_part_areas', 'menu_designer_template_part_areas' );

// Include preview functionality
require_once plugin_dir_path( __FILE__ ) . 'includes/preview.php';

// Include mobile menu functionality
require_once plugin_dir_path( __FILE__ ) . 'includes/mobile-menu-filter.php';

