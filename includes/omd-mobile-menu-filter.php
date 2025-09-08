<?php
/**
 * Mobile Menu Filter
 *
 * Filters the navigation block to replace mobile menu content with custom template part
 */

namespace MenuDesigner\MobileMenu;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the mobileMenuSlug attribute server-side
 */
function register_navigation_block_attributes() {
	$nav_block = \WP_Block_Type_Registry::get_instance()->get_registered( 'core/navigation' );
	
	if ( ! $nav_block ) {
		return;
	}

	// Define custom attributes
	$custom_attributes = array(
		'mobileMenuSlug' => array(
			'type' => 'string',
			'default' => '',
		),
		'mobileMenuBackgroundColor' => array(
			'type' => 'string',
			'default' => '',
		),
		'customMobileMenuBackgroundColor' => array(
			'type' => 'string',
			'default' => '',
		),
		'mobileIconBackgroundColor' => array(
			'type' => 'string',
			'default' => '',
		),
		'customMobileIconBackgroundColor' => array(
			'type' => 'string',
			'default' => '',
		),
		'mobileIconColor' => array(
			'type' => 'string',
			'default' => '',
		),
		'customMobileIconColor' => array(
			'type' => 'string',
			'default' => '',
		),
		'mobileMenuBreakpointEnabled' => array(
			'type' => 'boolean',
			'default' => false,
		),
		'mobileMenuBreakpoint' => array(
			'type' => 'number',
			'default' => 600,
		),
	);

	// Merge with existing attributes
	foreach ( $custom_attributes as $name => $config ) {
		$nav_block->attributes[ $name ] = $config;
	}
}

/**
 * Extract and sanitize mobile menu attributes
 *
 * @param array $attributes Block attributes.
 * @return array Sanitized mobile menu attributes.
 */
function get_mobile_menu_attributes( $attributes ) {
	// Helper function to get color value from preset or custom
	$get_color_value = function( $preset_attr, $custom_attr ) use ( $attributes ) {
		if ( ! empty( $attributes[ $preset_attr ] ) ) {
			// If it's a preset color, convert to CSS variable
			return 'var(--wp--preset--color--' . esc_attr( $attributes[ $preset_attr ] ) . ')';
		} elseif ( ! empty( $attributes[ $custom_attr ] ) ) {
			// If it's a custom color, use it directly
			return esc_attr( $attributes[ $custom_attr ] );
		}
		return '';
	};

	return array(
		'mobile_menu_slug'      => ! empty( $attributes['mobileMenuSlug'] ) ? esc_attr( $attributes['mobileMenuSlug'] ) : '',
		'background_color'      => $get_color_value( 'mobileMenuBackgroundColor', 'customMobileMenuBackgroundColor' ),
		'icon_background_color' => $get_color_value( 'mobileIconBackgroundColor', 'customMobileIconBackgroundColor' ),
		'icon_color'           => $get_color_value( 'mobileIconColor', 'customMobileIconColor' ),
		'breakpoint_enabled'    => ! empty( $attributes['mobileMenuBreakpointEnabled'] ) ? (bool) $attributes['mobileMenuBreakpointEnabled'] : false,
		'breakpoint'           => ! empty( $attributes['mobileMenuBreakpoint'] ) ? absint( $attributes['mobileMenuBreakpoint'] ) : 600,
	);
}

/**
 * Add attributes to navigation element
 *
 * @param \WP_HTML_Tag_Processor $processor HTML processor.
 * @param array                  $menu_attrs Menu attributes.
 * @param bool                   $has_mobile_menu Whether there's a mobile menu.
 */
function add_nav_attributes( $processor, $menu_attrs, $has_mobile_menu ) {
	if ( ! $processor->next_tag( 'nav' ) ) {
		return;
	}

	if ( $has_mobile_menu ) {
		$processor->set_attribute( 'data-mobile-menu-slug', $menu_attrs['mobile_menu_slug'] );
		$processor->add_class( 'has-mobile-menu' );
		$processor->set_attribute( 'data-responsive-navigation', 'true' );
		
		if ( $menu_attrs['background_color'] ) {
			$processor->set_attribute( 'data-mobile-menu-bg', $menu_attrs['background_color'] );
		}
	}
}

/**
 * Inject mobile menu content into navigation
 *
 * @param string $content HTML content.
 * @param string $mobile_menu_slug Mobile menu template slug.
 * @return string Modified content.
 */
function inject_mobile_menu_content( $content, $mobile_menu_slug ) {
	$responsive_container_pattern = '/<div[^>]*class="[^"]*wp-block-navigation__responsive-container-content[^"]*"[^>]*id="[^"]*-content"[^>]*>/';
	
	if ( ! preg_match( $responsive_container_pattern, $content ) ) {
		return $content;
	}

	// Render the mobile menu template part
	ob_start();
	block_template_part( $mobile_menu_slug );
	$mobile_menu_content = ob_get_clean();
	
	if ( empty( $mobile_menu_content ) ) {
		return $content;
	}

	// Wrap and inject the mobile menu content
	$mobile_menu_html = sprintf(
		'<div class="wp-block-navigation__mobile-menu-content" data-mobile-menu="true">%s</div>',
		$mobile_menu_content
	);
	
	return preg_replace(
		$responsive_container_pattern,
		'$0' . $mobile_menu_html,
		$content,
		1
	);
}

/**
 * Generate CSS rules for mobile menu colors and breakpoint
 *
 * @param string $nav_id Navigation block ID.
 * @param array  $menu_attrs Menu attributes.
 * @param bool   $has_mobile_menu Whether there's a mobile menu.
 * @return array CSS rules.
 */
function generate_css_rules( $nav_id, $menu_attrs, $has_mobile_menu ) {
	$css_rules = array();
	$escaped_id = esc_attr( $nav_id );
	
	// Add custom breakpoint CSS if enabled
	if ( $menu_attrs['breakpoint_enabled'] && $menu_attrs['breakpoint'] ) {
		$breakpoint = absint( $menu_attrs['breakpoint'] );
		
		// Show mobile menu toggle and hide desktop menu below breakpoint
		$css_rules[] = sprintf(
			'@media (max-width: %1$dpx) { #%2$s .wp-block-navigation__responsive-container-open:not(.always-shown) { display: flex !important; } #%2$s .wp-block-navigation__responsive-container:not(.is-menu-open) { display: none !important; }  }',
			$breakpoint - 1,
			$escaped_id
		);
	}
	
	// Background color only applies with mobile menu
	if ( $menu_attrs['background_color'] && $has_mobile_menu ) {
		$css_rules[] = sprintf(
			'#%1$s .wp-block-navigation__responsive-container.is-menu-open { background-color: %2$s !important; }',
			$escaped_id,
			esc_attr( $menu_attrs['background_color'] )
		);
	}
	
	// Icon colors apply regardless of mobile menu
	if ( $menu_attrs['icon_background_color'] ) {
		$css_rules[] = sprintf(
			'#%1$s .wp-block-navigation__responsive-container-open, #%1$s .wp-block-navigation__responsive-container-close { background-color: %2$s !important; }',
			$escaped_id,
			esc_attr( $menu_attrs['icon_background_color'] )
		);
	}
	
	if ( $menu_attrs['icon_color'] ) {
		$css_rules[] = sprintf(
			'#%1$s .wp-block-navigation__responsive-container-open svg, #%1$s .wp-block-navigation__responsive-container-close svg { fill: %2$s !important; }',
			$escaped_id,
			esc_attr( $menu_attrs['icon_color'] )
		);
	}
	
	return $css_rules;
}

/**
 * Add inline styles to navigation block
 *
 * @param string $content HTML content.
 * @param array  $css_rules CSS rules to add.
 * @param string $nav_id Navigation ID.
 * @return string Modified content with styles.
 */
function add_inline_styles( $content, $css_rules, $nav_id ) {
	if ( empty( $css_rules ) ) {
		return $content;
	}

	// Add ID to nav element
	$processor = new \WP_HTML_Tag_Processor( $content );
	if ( $processor->next_tag( 'nav' ) ) {
		$processor->set_attribute( 'id', $nav_id );
	}
	$content = $processor->get_updated_html();
	
	// Prepend inline styles
	$inline_css = '<style>' . implode( ' ', $css_rules ) . '</style>';
	return $inline_css . $content;
}

/**
 * Add mobile menu content to the navigation block
 *
 * @param string $block_content The block content.
 * @param array  $block The block data.
 * @return string The modified block content.
 */
function add_mobile_menu_to_navigation( $block_content, $block ) {
	// Only process navigation blocks
	if ( 'core/navigation' !== $block['blockName'] ) {
		return $block_content;
	}

	$attributes = $block['attrs'] ?? array();
	$menu_attrs = get_mobile_menu_attributes( $attributes );
	$has_mobile_menu = ! empty( $menu_attrs['mobile_menu_slug'] );
	$has_breakpoint = $menu_attrs['breakpoint_enabled'] && $menu_attrs['breakpoint'];
	$has_colors = $menu_attrs['icon_background_color'] || $menu_attrs['icon_color'] || ( $menu_attrs['background_color'] && $has_mobile_menu );
	
	// Early return if nothing to do
	if ( ! $has_mobile_menu && ! $has_colors && ! $has_breakpoint ) {
		return $block_content;
	}

	// Add navigation attributes
	$processor = new \WP_HTML_Tag_Processor( $block_content );
	add_nav_attributes( $processor, $menu_attrs, $has_mobile_menu );
	$modified_content = $processor->get_updated_html();
	
	// Inject mobile menu content if available
	if ( $has_mobile_menu ) {
		$modified_content = inject_mobile_menu_content( $modified_content, $menu_attrs['mobile_menu_slug'] );
	}
	
	// Add inline CSS for colors and/or breakpoint if needed
	if ( $has_colors || $has_breakpoint ) {
		$nav_id = 'nav-' . wp_unique_id();
		$css_rules = generate_css_rules( $nav_id, $menu_attrs, $has_mobile_menu );
		$modified_content = add_inline_styles( $modified_content, $css_rules, $nav_id );
	}

	return $modified_content;
}

/**
 * Enqueue mobile menu styles
 */
function enqueue_mobile_menu_assets() {
	$inline_css = '
		.wp-block-navigation__mobile-menu-content {
			display: none;
			width: 100%;
		}
		.wp-block-navigation__responsive-container:not(.is-menu-open) .wp-block-navigation__mobile-menu-content {
			display: none !important;
		}
		.wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__mobile-menu-content {
			display: block;
		}
		.wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__mobile-menu-content ~ * {
			display: none !important;
		}
	';

	wp_add_inline_style( 'wp-block-navigation', $inline_css );
}

// Add filters and actions
add_action( 'init', __NAMESPACE__ . '\register_navigation_block_attributes', 100 );
add_filter( 'render_block', __NAMESPACE__ . '\add_mobile_menu_to_navigation', 10, 2 );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_mobile_menu_assets' );
