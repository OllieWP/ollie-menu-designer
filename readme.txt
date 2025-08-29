=== Ollie Menu Designer ===
Contributors: mmcalister, patrickposner
Tags: mobile menu, dropdown menu, navigation, block, mega menu
Requires at least: 6.5
Tested up to: 6.8
Stable tag: 0.1.7
Requires PHP: 7.4
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Create custom dropdown & mobile menus using WordPress blocks. Design rich, responsive navigation with any block content in the block editor.

== Description ==

**Menu Designer** brings the full power of the WordPress block editor to your navigation menus! Create stunning dropdown menus and custom mobile menus with rich content, images, columns, and any blocks you love – all without leaving the familiar WordPress interface.

Unlike traditional menu plugins that require complex configurations and custom interfaces, Menu Designer integrates seamlessly with WordPress's native navigation block. Simply add the Menu Designer block to any navigation menu or configure a custom mobile menu template, and start designing!

= Key Features =

* **Block-Based Design** - Use any WordPress blocks to build your dropdown menus and mobile menus
* **Visual Editing** - Design your menus with the Site Editor's live preview
* **Template Parts** - Menus are saved as reusable and portable template parts
* **Custom Mobile Menus** - Replace default mobile navigation with custom designed templates
* **Responsive Controls** - Choose different behaviors for mobile devices
* **Flexible Layouts** - Content, wide, full, or custom width options for dropdown menus
* **Smart Positioning** - Automatic edge detection prevents off-screen menus
* **Performance Focused** - Menus load only when needed
* **Accessibility Ready** - Keyboard navigation and screen reader support

= Design Freedom =

Create dropdown menus and mobile menus that match your vision:

* Multi-column layouts with the Columns block
* Featured images and galleries
* Rich text with custom typography
* Buttons and call-to-action elements
* Recent posts or product grids
* Search bars and forms
* Custom HTML and shortcodes
* And literally any other block!

= Mobile-First Options =

Your menus look great on every device:

* Custom mobile menu designs that replace default navigation
* Disable dropdowns on mobile with fallback URLs
* Custom breakpoints for responsive behavior
* Touch-friendly interaction patterns
* Optimized performance for mobile devices

= Easy to Use =

**For Dropdown Menus:**
1. Add a Navigation block to your header
2. Insert the Menu Designer block as a navigation item
3. Choose or create a menu template
4. Design your dropdown menu in the Site Editor
5. Publish and enjoy!

**For Mobile Menus:**
1. Add a Navigation block to your header
2. Open the Navigation block settings
3. In the Mobile Menu panel, select a mobile design template
4. Design your mobile menu in the Site Editor
5. Your custom mobile menu appears automatically on mobile devices!

= Developer Friendly =

* Built with modern WordPress development practices
* Clean, semantic markup
* Works with block themes

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/menu-designer` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Add a Navigation block to your site (usually in the header)
4. Click the + button to add a block to your navigation
5. Search for "Menu Designer" and insert the block
6. Configure your dropdown menu settings and create your content!

= Requirements =

* WordPress 6.0 or higher
* PHP 7.4 or higher
* A theme that supports navigation blocks

== Frequently Asked Questions ==

= How do I create my first dropdown menu? =

After installing the plugin, add a Navigation block to your site (usually in your header template). Then add the Menu Designer block inside the navigation. Click "Create New" to design your menu template in the Site Editor.

= How do I create a custom mobile menu? =

In any Navigation block, go to the block settings and find the Mobile Menu panel. Select a mobile design template or create a new one. Your custom mobile menu will automatically replace the default mobile navigation on smaller screens.

= Can I use this with my existing theme? =

Yes! Menu Designer works with any theme that supports navigation blocks. This includes all block themes and many classic themes with navigation block support.

= How do I make different menus for different pages? =

Both dropdown menus and mobile menus are saved as template parts. You can create multiple template parts and use different ones on different navigation menus throughout your site.

= Can I disable dropdown menus on mobile? =

Absolutely! Each dropdown menu has a "Disable in mobile menu" option. You can also specify a fallback URL that mobile users will navigate to instead.

= Is this accessible? =

Yes! The plugin follows WordPress accessibility standards with proper ARIA attributes, keyboard navigation support, and screen reader compatibility.

= Will this slow down my site? =

No. Dropdown menus are loaded efficiently only when needed. The plugin uses modern performance techniques including lazy loading and optimized asset delivery.

== Screenshots ==

1. Adding a dropdown menu block to your navigation - it's as easy as adding any other block!
2. Designing your dropdown menu with the visual Site Editor - use columns, images, and any blocks
3. Settings panel showing width options, mobile controls, and link attributes
4. Live preview of a multi-column dropdown menu with images and styled content
5. Mobile view showing the fallback behavior options
6. Managing multiple menu templates in the Site Editor

== Changelog ==

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
