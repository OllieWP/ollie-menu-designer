# Ollie Menu Designer

### Create beautiful, content-rich mobile menus and dropdown menus in WordPress using the power of the block editor.

[![Ollie Menu Designer Screenshot](https://olliewp.com/wp-content/uploads/2025/08/menu-designer-readme.webp)](https://olliewp.com/menu-designer)

[![License](https://img.shields.io/badge/license-GPL--3.0%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)
[![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net)

## Overview

Create stunning, content-rich navigation menus using the WordPress block editor. [Ollie Menu Designer](https://olliewp.com/menu-designer) lets you build beautiful dropdown menus and mobile navigation with images, buttons, call-to-actions, and any other blocks – giving you the same creative freedom you have when designing your pages.

Menu Designer puts you in complete control of how your menus look and function. Best of all, if you're using the [free Ollie theme](https://olliewp.com/download/), you'll get access to a collection of beautifully pre-designed menu templates to help you get started quickly.

## Features

- **Visual Design** - Build your menus in the Site Editor with live preview
- **Block-Based** - Use any WordPress block to create rich menu content
- **Responsive** - Responsive patterns, intelligent edge detection, and optinal fallback URLs for mobile
- **Smart Positioning** - Multiple alignment options and settings to customize dropdown positioning
- **Accessible** - Follows best practices for dropdowns and mobile menus
- **Performance First** - Menu assets load only when needed.

## Getting Started

[![Ollie Menu Designer Tutorial](https://olliewp.com/wp-content/uploads/2025/08/menu-designer-tutorial-readme.webp)](https://youtu.be/UXWOafpBn38)

[Check out our complete video walkthrough on YouTube](https://youtu.be/UXWOafpBn38) to learn how to create beautiful dropdown menus and mobile navigation with Ollie Menu Designer.

### Installation

1. Download the latest release or clone this repository
3. Activate the plugin through the WordPress admin
4. Start adding mobile menus and dropdown menus

### Adding Mobile Menus with Ollie Menu Designer

Watch the [full video tutorial](https://youtu.be/UXWOafpBn38) for a detailed walkthrough.

1. Navigate to Appearance → Editor → Patterns and edit your Header template part
2. Click the Navigation block
3. In the Navigation block Settings tab, find the Mobile Menu panel
4. Click "Create a new one" or select from existing mobile menu templates
5. Choose from pre-designed Ollie patterns or build custom with blocks
6. Save your menu and select it in the Mobile Menu panel
7. Customize background colors and menu icon in the mobile menu settings

### Adding Dropdown Menus with Ollie Menu Designer

Watch the [full video tutorial](https://youtu.be/UXWOafpBn38) for a detailed walkthrough.

1. Navigate to Appearance → Editor → Patterns and edit your Header template part
2. Click Add Block and search for "Dropdown Menu"
3. Name your dropdown and position it in your navigation
4. In the Dropdown Menu block Settings tab, find the dropdown menu panel
5. Click "Create a new one" or select from existing dropdown menu templates
6. Choose from pre-designed Ollie patterns or build custom with blocks
7. Save your menu and select it in the dropdown menu panel
8. Configure additional customization settings

## Adding Starter Patterns

You can create custom starter patterns for menu templates to give users quick starting points for their menus. This is especially useful for theme developers who want to provide pre-designed menu layouts.

### How to Add Starter Patterns

1. Create a `/patterns` folder in your theme or plugin directory
2. Add your pattern files (PHP format) to this folder
3. In each pattern file, ensure you include the following in your pattern header:

```php
/**
 * Title: My Mobile Menu Pattern
 * Slug: mytheme/my-mobile-pattern
 * Categories: menu
 * Block Types: core/template-part/menu
 */
```

The key requirement is the `Block Types: core/template-part/menu` line - this ensures your pattern appears as an option when creating new menu template parts.

## License

Menu Designer is licensed under the GPL v3 or later - see the [LICENSE](LICENSE) file for details.

## Credits

Built with love by the [OllieWP](https://olliewp.com) team. Shout out to [Nick Diego](https://x.com/nickmdiego) who created the initial [proof of concept](https://github.com/ndiego/mega-menu-block) that Menu Designer is inspired by.
