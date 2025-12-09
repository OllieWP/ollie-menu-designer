=== Ollie Menu Designer ===
Contributors: mmcalister, patrickposner
Donate link: https://olliewp.com
Tags: mobile menu, dropdown menu, navigation, block, mega menu
Requires at least: 6.5
Tested up to: 6.9
Stable tag: 0.2.4
Requires PHP: 7.4
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Create custom dropdown & mobile menus using WordPress blocks. Design rich, responsive navigation with any block content in the block editor.

== Description ==

https://youtu.be/UXWOafpBn38

Create stunning, content-rich dropdown, mobile, and mega menus using the WordPress block editor and full site editing. [Ollie Menu Designer](https://olliewp.com/menu-designer) lets you build beautiful dropdown menus and mobile navigation with images, buttons, call-to-actions, and any other blocks – giving you the same creative freedom you have when designing your pages.

Menu Designer puts you in complete control of how your menus look and function. Best of all, if you're using the [free Ollie theme](https://olliewp.com/download/), you'll get access to a collection of beautifully pre-designed menu templates to help you get started quickly.

= Design Freedom =
Create dropdown menus and mobile menus that match your vision using any WordPress block you can imagine. Whether you need multi-column layouts, featured images and galleries, rich text with custom typography, or buttons and call-to-action elements, Menu Designer gives you complete creative control. You can even include recent posts, product grids, search bars, forms, custom HTML, and literally any other block to build exactly the navigation experience your site needs.

* Multi-column layouts with images, text, and buttons
* Rich content like galleries, forms, and product grids
* Complete creative control with any WordPress block

= Mobile-First Options =
Your menus look great on every device with Ollie Menu Designer's mobile-optimized approach. Design custom mobile menu experiences that replace default navigation with beautiful, touch-friendly interfaces. You have complete control over responsive behavior, including the ability to disable dropdowns on mobile with fallback URLs, set custom breakpoints, and ensure optimized performance across all devices.

* Fast, beautiful mobile menu designs with touch-friendly interactions
* Choose from several pre-designed menu patterns
* Optimized performance across all devices

= Build faster with Ollie =

Get started instantly with the [free Ollie block theme](https://wordpress.org/themes/ollie/), which comes packed with beautiful pre-designed menu templates and patterns built specifically for Ollie Menu Designer. Instead of starting from scratch, you'll have access to professionally-crafted mobile menus, dropdown designs, and mega menu layouts that seamlessly integrate with Ollie's design system. Simply install the theme, browse the menu pattern library, and customize the designs to match your brand – no design experience required.

* Pre-designed menu templates and patterns included
* Seamless integration with Ollie's design system
* Professional designs ready to customize for your brand

= Adding Mobile Menus with Ollie Menu Designer =

**We've created a [full video tutorial](https://youtu.be/UXWOafpBn38?t=150) on creating mobile menus.**

1. Navigate to Appearance → Editor → Patterns and edit your Header template part
2. Click the Navigation block
3. In the Navigation block Settings tab, find the Mobile Menu panel
4. Click "Create a new one" or select from existing mobile menu templates
5. Choose from pre-designed Ollie patterns or build custom with blocks
6. Save your menu and select it in the Mobile Menu panel
7. Customize background colors and menu icon in the mobile menu settings

= Adding Dropdowns and Mega Menus with Ollie Menu Designer =

**We've created a [full video tutorial](https://youtu.be/UXWOafpBn38?t=421) on creating drop down and mega menus.**

1. Navigate to Appearance → Editor → Patterns and edit your Header template part
2. Click Add Block and search for "Dropdown Menu"
3. Name your dropdown and position it in your navigation
4. In the Dropdown Menu block Settings tab, find the dropdown menu panel
5. Click "Create a new one" or select from existing dropdown menu templates
6. Choose from pre-designed Ollie patterns or build custom with blocks
7. Save your menu and select it in the dropdown menu panel
8. Configure additional customization settings


= Adding Starter Patterns =

You can create custom starter patterns for menu templates to give users quick starting points for their menus. This is especially useful for theme developers who want to provide pre-designed menu layouts.

**How to Add Starter Patterns**

1. Create a `/patterns` folder in your theme or plugin directory
2. Add your pattern files (PHP format) to this folder
3. In each pattern file, ensure you include the following in your pattern header:

`Block Types: core/template-part/menu`

This ensures your pattern appears as an option when creating new menu template parts.

= Requirements =

* WordPress 6.5 or higher
* A WordPress block theme like [Ollie](https://olliewp.com) that supports the WordPress navigation block

== Frequently Asked Questions ==

= Does this work with my existing theme? =

Yes! Ollie Menu Designer works with any theme that supports WordPress navigation blocks. This includes all block themes and many classic themes with navigation block support. For the best experience with pre-designed menu patterns, we recommend using the free Ollie theme. You can search for "Ollie" on your Themes page in the WordPress dashboard, or visit olliewp.com to download and learn more about the theme.

= Where can I get more templates and patterns? =

Ollie Menu Designer comes with several starter patterns, but for access to hundreds of professionally-designed menu templates and patterns, check out Ollie Pro. [Ollie Pro](https://olliewp.com/pro) includes an extensive pattern library with multiple menu collections, dropdown designs, and mobile menu layouts that work seamlessly with Menu Designer.

= How is this different from other menu plugins? =

Unlike traditional menu plugins built for classic themes, Ollie Menu Designer is built specifically for the WordPress block editor. You design menus using the same blocks you use for pages - no separate interface or complex settings screens.

= Can I have different menus on different pages? =

Absolutely! Since menus are saved as template parts, you can create multiple dropdown and mobile menu designs and use different ones throughout your site by adding them to different navigation blocks.

= What happens to my menus if I deactivate the plugin? =

Your menu template parts remain in your site as regular template parts. However, the dropdown and mobile menu functionality will stop working until you reactivate the plugin.

= Can I import/export my menu designs? =

Yes! Since menus are built with WordPress blocks, you can copy and paste menu designs between sites, or export them as part of your theme's pattern library.

= Will this conflict with other menu plugins? =

Ollie Menu Designer is designed to work alongside WordPress's native navigation system. However, we recommend deactivating other menu plugins to avoid potential conflicts and ensure the best performance.

= Is this plugin accessible? =

Yes! Ollie Menu Designer follows WordPress accessibility standards with proper ARIA attributes, keyboard navigation support, and screen reader compatibility.

= Will this slow down my website? =

No. Ollie Menu Designer uses modern performance techniques including efficient loading, optimized CSS delivery, and follows WordPress best practices.

= Can I style menus with custom CSS? =

While Ollie Menu Designer gives you extensive design control through blocks and Global Styles, you can also add custom CSS if needed. All menu elements use semantic HTML with proper CSS classes for easy targeting.

== Screenshots ==

1. Create stunning full-width mega menus using WordPress blocks - no coding required.
2. Design beautiful, content-rich dropdown menus with the WordPress block editor.
3. Control your dropdown width and alignment with flexible positioning options.
4. Install the free Ollie theme to access beautiful pre-designed mobile menu patterns.
5. Customize dropdown menus directly in the block editor with intuitive settings.
6. Preview your menu designs instantly while building them in the block editor.
7. Browse and select from professionally-designed menu patterns in Ollie's pattern library.
8. Design any style of navigation - from simple dropdowns to complex mega menus with rich content.

== Changelog ==

= 0.2.4 =
* Wait until page is loaded to calculate menu position
* Increase z-index to ensure drop menu overlays content


= 0.2.3 =
* Fix dropdown behavior in Safari
* Fix deprecated warning in PHP 8.2

= 0.2.2 =
* Make drop down arrows consistent with default drop downs
* Fix behavior when window loses focus

= 0.2.1 =
* Fix mega menu toggle on mobile

= 0.2.0 =
* Add overflow fixes for dropdown menus
* Add style reset to prevent cascading on dropdown menus

= 0.1.9 =
* Fix keyboard nav with open on hover
* Fix hardcoded /wp-admin/ paths for subdirectory WordPress installations
* Fix proper textdomain loading in main plugin file
* fail-safe init function for Git-based deployments

= 0.1.8 =
* Fix Safari bug where menu won't toggle closed
* Fix console error for deprecated function

= 0.1.7 =
* Fix bug with missing package dependency

= 0.1.6 =
* Add pop up guide to settings panel to help with onboarding

= 0.1.5 =
* Fix hover stacking bug
* Update plugin name and text domain

= 0.1.4 =
* Add GitHub updater for short term updates

= 0.1.3 =
* Add menu item link when hover is in use
* Default hover behavior to click on mobile
* Make sure fallback url is hidden by default

= 0.1.0 =
* Initial release
