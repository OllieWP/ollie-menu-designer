/**
 * WordPress dependencies
 */
import {
	store,
	getContext,
	getElement,
	withScope,
	withSyncEvent,
} from '@wordpress/interactivity';

// Configuration constants
const CONFIG = {
	// Viewport breakpoints
	MOBILE_BREAKPOINT: 600, // px - Below this is considered mobile

	// Hover behavior
	HOVER: {
		BASE_DELAY: 300, // ms - Base hover intent delay
		DELAY_PER_PX: 2, // ms - Additional delay per pixel of top spacing
	},

	// Menu dimensions
	MENU: {
		MIN_WIDTH: 200, // px - Minimum width for menus
		MIN_WIDTH_BEFORE_ANCHOR: 400, // px - Minimum width before switching to anchoring
		VIEWPORT_OFFSET: 120, // px - Space reserved for modal header
		MOBILE_BG_OPACITY: 1, // Opacity for mobile background color
		DEFAULT_BG_FALLBACK: 'rgba(255, 255, 255, 1)', // Fallback mobile background
	},

	// CSS classes
	CLASSES: {
		MENU_CONTAINER: '.wp-block-ollie-mega-menu__menu-container',
		NAV_BLOCK: '.wp-block-navigation',
		RESPONSIVE_CONTAINER: '.wp-block-navigation__responsive-container',
	},
};

// Menu utility functions
const menuUtils = {
	// DOM query helpers
	getMenu: ( ref ) => ref.querySelector( CONFIG.CLASSES.MENU_CONTAINER ),
	getNavBlock: ( menu ) => menu.closest( CONFIG.CLASSES.NAV_BLOCK ),
	getResponsiveContainer: ( menu ) =>
		menu.closest( CONFIG.CLASSES.RESPONSIVE_CONTAINER ),

	// Color parsing utilities
	parseRgbColor: ( colorString ) => {
		if (
			! colorString ||
			colorString === 'transparent' ||
			colorString === 'rgba(0, 0, 0, 0)'
		) {
			return null;
		}

		const rgbaMatch = colorString.match(
			/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/
		);
		if ( rgbaMatch ) {
			const [ , r, g, b, a ] = rgbaMatch;
			return { r, g, b, a: a || 1 };
		}

		return null;
	},

	// Create RGBA string with specified opacity
	createRgba: ( r, g, b, opacity ) =>
		`rgba(${ r }, ${ g }, ${ b }, ${ opacity })`,

	// Check if element has specific width class
	hasWidthClass: ( menu, widthType ) => {
		const widthClasses = {
			custom: 'menu-width-custom',
			content: 'menu-width-content',
			wide: 'menu-width-wide',
			full: 'menu-width-full',
		};
		return menu.classList.contains( widthClasses[ widthType ] );
	},

	// Check if element has specific justification class
	hasJustificationClass: ( element, justification ) => {
		const justificationClasses = {
			left: [ 'menu-justified-left', 'items-justified-left' ],
			center: [
				'menu-justified-center',
				'items-justified-center',
				'items-justified-space-between',
			],
			right: [ 'menu-justified-right', 'items-justified-right' ],
		};

		return justificationClasses[ justification ].some( ( className ) =>
			element.classList.contains( className )
		);
	},
};

// Track the currently open hover menu globally
let currentHoverMenu = null;

const { state, actions } = store( 'ollie/mega-menu', {
	state: {
		get isMenuOpen() {
			// The menu is opened if either `click`, `focus`, or `hover` is true.
			return (
				Object.values( state.menuOpenedBy ).filter( Boolean ).length > 0
			);
		},
		get menuOpenedBy() {
			const context = getContext();
			return context.menuOpenedBy;
		},
		get isDesktop() {
			return window.innerWidth >= CONFIG.MOBILE_BREAKPOINT;
		},
		hoverTimeout: null,
		get dynamicHoverDelay() {
			const context = getContext();
			const topSpacing = context.topSpacing || 0;
			// Add delay based on top spacing to give users more time
			const extraDelay = topSpacing * CONFIG.HOVER.DELAY_PER_PX;
			return CONFIG.HOVER.BASE_DELAY + extraDelay;
		},
		isProcessingClick: false,
	},
	actions: {
		// Helper to close all menu states
		closeAllMenus() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
			actions.closeMenu( 'hover' );
		},
		// Apply mobile background color from responsive container
		applyMobileBackgroundColor( menu ) {
			if ( ! state.isDesktop && state.isMenuOpen ) {
				const responsiveContainer =
					menuUtils.getResponsiveContainer( menu );
				if ( responsiveContainer ) {
					// Get computed background color of the responsive container
					const computedStyle =
						window.getComputedStyle( responsiveContainer );
					const parsedColor = menuUtils.parseRgbColor(
						computedStyle.backgroundColor
					);

					if ( parsedColor ) {
						// Apply the color with configured opacity
						menu.style.backgroundColor = menuUtils.createRgba(
							parsedColor.r,
							parsedColor.g,
							parsedColor.b,
							CONFIG.MENU.MOBILE_BG_OPACITY
						);
					} else {
						// Fallback if no background color is set
						menu.style.backgroundColor =
							CONFIG.MENU.DEFAULT_BG_FALLBACK;
					}
				}
			} else {
				// Reset background color on desktop
				menu.style.backgroundColor = '';
			}
		},
		// Apply top spacing to menu based on configuration
		applyTopSpacing( menu ) {
			const topSpacing = menu.dataset.topSpacing;
			if ( topSpacing && parseInt( topSpacing ) > 0 && state.isDesktop ) {
				menu.style.top = `${ topSpacing }px`;
			} else if ( ! state.isDesktop ) {
				// Reset top spacing on mobile
				menu.style.top = '';
			}
		},
		// Apply appropriate width to menu based on its type
		applyMenuWidth( menu ) {
			if ( menuUtils.hasWidthClass( menu, 'custom' ) ) {
				const customWidth = menu.dataset.customWidth;
				if ( customWidth && parseInt( customWidth ) > 0 ) {
					menu.style.width = `${ customWidth }px`;
					menu.style.maxWidth = `${ customWidth }px`;
				}
			} else if ( menuUtils.hasWidthClass( menu, 'content' ) ) {
				// Reset content width menus to auto so they can expand
				menu.style.width = '';
				menu.style.maxWidth = '';
			} else if (
				menuUtils.hasWidthClass( menu, 'wide' ) ||
				menuUtils.hasWidthClass( menu, 'full' )
			) {
				// Reset wide/full menus to their original widths
				menu.style.width = '';
				menu.style.maxWidth = '';
			}
		},
		// Determine menu justification based on menu and nav block classes
		determineJustification( menu, navBlock ) {
			// Check menu-specific justification first (higher priority)
			if ( menu.classList.contains( 'menu-justified-center' ) ) {
				return 'center';
			} else if ( menu.classList.contains( 'menu-justified-right' ) ) {
				return 'right';
			} else if ( menu.classList.contains( 'menu-justified-left' ) ) {
				return 'left';
			}

			// Fall back to nav block justification
			if (
				navBlock.classList.contains( 'items-justified-center' ) ||
				navBlock.classList.contains( 'items-justified-space-between' )
			) {
				return 'center';
			} else if (
				navBlock.classList.contains( 'items-justified-right' )
			) {
				return 'right';
			}

			return 'left'; // Default
		},
		// Get menu measurements for positioning calculations
		getMenuMeasurements( menu, navBlock ) {
			const windowSpace = window.innerWidth;
			let originalMenuWidth = menu.offsetWidth;

			// For custom width menus, use the configured width
			if (
				menuUtils.hasWidthClass( menu, 'custom' ) &&
				menu.dataset.customWidth
			) {
				originalMenuWidth = parseInt( menu.dataset.customWidth );
			}

			return {
				windowSpace,
				originalMenuWidth,
				menuRect: menu.getBoundingClientRect(),
				navBlockRect: navBlock.getBoundingClientRect(),
				leftOffset: navBlock.getBoundingClientRect().left,
				leftSpace: ( windowSpace - originalMenuWidth ) / 2,
			};
		},
		// Adjust a single dropdown menu
		adjustMegaMenu() {
			const { ref } = getElement();
			const menu = menuUtils.getMenu( ref );
			if ( ! menu ) return;

			const navBlock = menuUtils.getNavBlock( menu );
			if ( ! navBlock ) return;

			// Apply positioning helpers
			actions.applyTopSpacing( menu );
			actions.applyMobileBackgroundColor( menu );
			actions.applyMenuWidth( menu );

			// Determine justification
			const justification = actions.determineJustification(
				menu,
				navBlock
			);

			// Get measurements
			const measurements = actions.getMenuMeasurements( menu, navBlock );

			// Apply justification-based positioning
			actions.applyJustificationPositioning(
				menu,
				justification,
				measurements.windowSpace,
				measurements.originalMenuWidth,
				measurements.menuRect,
				measurements.leftOffset,
				measurements.leftSpace,
				measurements.navBlockRect
			);
		},
		// Apply justification-based positioning
		applyJustificationPositioning(
			menu,
			justification,
			windowSpace,
			menuWidth,
			menuRect
		) {
			const minWidth = CONFIG.MENU.MIN_WIDTH;

			// Step 1: Handle width constraints for ALL menus
			if ( menuWidth > windowSpace ) {
				const newWidth = Math.max( windowSpace, minWidth );
				menu.style.width = `${ newWidth }px`;
				// Update dimensions to use constrained width for calculations
				menuWidth = newWidth;
			}

			// Step 2: Handle positioning based on width type and justification

			// Wide/Full menus - always center on page when justified center
			if (
				menuUtils.hasWidthClass( menu, 'wide' ) ||
				menuUtils.hasWidthClass( menu, 'full' )
			) {
				if ( justification === 'center' ) {
					// Center the menu on the screen
					const screenCenter = windowSpace / 2;
					const menuCenter = menuWidth / 2;
					const currentLeft = menuRect.left;
					const targetLeft = screenCenter - menuCenter;
					const offset = targetLeft - currentLeft;
					const newLeft = parseFloat( menu.style.left || 0 ) + offset;
					menu.style.left = `${ newLeft }px`;
				}
				return; // Wide/full menus don't need edge detection
			}

			// Content/Custom menus - handle centering if needed
			if ( justification === 'center' ) {
				// Custom width needs dynamic centering calculation
				if ( menuUtils.hasWidthClass( menu, 'custom' ) ) {
					const customWidth = parseInt( menu.dataset.customWidth );
					if ( customWidth ) {
						// Apply the same CSS pattern as content-width, but with custom width
						// Use the actual menuWidth in case it was constrained by viewport
						menu.style.left = `calc( ( -1 * ${ menuWidth }px / 2 ) + 50% )`;
						// Defer position update until needed for edge detection
					}
				}
			}

			// Step 3: Edge detection for content/custom menus (all justifications)
			if (
				menuUtils.hasWidthClass( menu, 'content' ) ||
				menuUtils.hasWidthClass( menu, 'custom' )
			) {
				// Get fresh position only when needed for edge detection
				const freshMenuRect = menu.getBoundingClientRect();
				const currentLeft = freshMenuRect.left;
				const currentRight = freshMenuRect.right;

				// Check if menu goes off either edge
				if ( currentLeft < 0 || currentRight > windowSpace ) {
					if ( justification === 'center' ) {
						// For centered menus, adjust position to keep on screen
						let overflowAmount = 0;
						if ( currentLeft < 0 ) {
							overflowAmount = Math.abs( currentLeft );
						} else if ( currentRight > windowSpace ) {
							overflowAmount = -( currentRight - windowSpace );
						}

						// For custom width menus that use calc(), update the calc formula
						if ( menuUtils.hasWidthClass( menu, 'custom' ) ) {
							menu.style.left = `calc( ( -1 * ${ menuWidth }px / 2 ) + 50% + ${ overflowAmount }px )`;
						} else {
							// For content width menus, adjust the position directly
							const currentRelativeLeft = parseFloat(
								menu.style.left ||
									window.getComputedStyle( menu ).left ||
									0
							);
							menu.style.left = `${
								currentRelativeLeft + overflowAmount
							}px`;
						}
					} else {
						// For left/right justified menus, check if they would become too small
						let newWidth = menuWidth;
						let wouldBeTooSmall = false;

						// Calculate the new width after overflow adjustment
						if ( currentLeft < 0 ) {
							const overflowLeft = Math.abs( currentLeft );
							newWidth = Math.min( newWidth, menuWidth - overflowLeft );
						}
						if ( currentRight > windowSpace ) {
							const overflowRight = currentRight - windowSpace;
							newWidth = Math.min( newWidth, menuWidth - overflowRight );
						}

						// Check if width would be below minimum threshold
						wouldBeTooSmall = newWidth < CONFIG.MENU.MIN_WIDTH_BEFORE_ANCHOR;

						// If menu would be too small and hasn't been swapped yet, swap justification
						if ( wouldBeTooSmall && menu.dataset.justificationSwapped !== 'true' ) {
							// Determine new justification (opposite of current)
							const newJustification = justification === 'left' ? 'right' : 'left';
							
							// Remove all justification classes and add the new one
							menu.classList.remove( 'menu-justified-left', 'menu-justified-right', 'menu-justified-center' );
							menu.classList.add( `menu-justified-${newJustification}` );
							
							// Mark as swapped and reset styles
							menu.dataset.justificationSwapped = 'true';
							menu.style.width = '';
							menu.style.left = '';
							menu.style.maxWidth = '';
							
							// Re-run adjustment with new justification
							return actions.adjustMegaMenu();
						}

						// If no swap occurred, apply the calculated width reduction
						if ( !wouldBeTooSmall ) {
							const finalWidth = Math.max( newWidth, CONFIG.MENU.MIN_WIDTH );
							menu.style.width = `${ finalWidth }px`;
						}
					}
				}
			}
		},
		// Handle window resize using Interactivity API
		handleResize() {
			const { ref } = getElement();
			const menu = menuUtils.getMenu( ref );
			if ( ! menu ) return;

			// Clear any hover timeouts on resize
			actions.clearHoverTimeout();

			// Close hover menus if we resize below desktop breakpoint
			if ( ! state.isDesktop && state.menuOpenedBy.hover ) {
				actions.closeMenu( 'hover' );
			}

			// Reset justification swap flag on resize to allow re-evaluation
			delete menu.dataset.justificationSwapped;

			// Re-apply full positioning logic on resize
			actions.adjustMegaMenu();

			// Reapply mobile background color on resize
			if ( state.isMenuOpen ) {
				actions.applyMobileBackgroundColor( menu );
			}
		},
		toggleMenuOnClick: withSyncEvent( ( event ) => {
			const context = getContext();
			const { ref } = getElement();

			// Safari fix: Set flag to prevent focusout from interfering with click handling
			state.isProcessingClick = true;

			// On mobile, always toggle the menu even if it's a link with hover enabled
			// On desktop with hover enabled and URL, allow default link behavior
			if ( context.showOnHover && context.url && state.isDesktop ) {
				// Let the link navigate on desktop when hover is enabled with URL
				state.isProcessingClick = false;
				return;
			}

			// Prevent default link navigation on mobile or when no URL
			if ( event && event.preventDefault ) {
				event.preventDefault();
			}

			// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
			if ( window.document.activeElement !== ref ) ref.focus();

			if ( state.menuOpenedBy.click || state.menuOpenedBy.focus ) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			} else {
				context.previousFocus = ref;
				actions.openMenu( 'click' );
			}

			// Safari fix: Clear flag after focus events have settled
			// This prevents focusout from closing the menu during click processing
			setTimeout( () => {
				state.isProcessingClick = false;
			}, 100 );
		} ),
		closeMenuOnClick() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},

		// ========== HOVER FUNCTIONALITY ==========
		// Hover timeout management
		clearHoverTimeout() {
			if ( state.hoverTimeout ) {
				clearTimeout( state.hoverTimeout );
				state.hoverTimeout = null;
			}
		},
		setHoverTimeout( callback, delay ) {
			actions.clearHoverTimeout();
			state.hoverTimeout = setTimeout( withScope( callback ), delay );
		},
		// Check if hover should be active
		shouldActivateHover() {
			const context = getContext();
			return context.showOnHover && state.isDesktop;
		},
		// Handle mouse enter on toggle button
		handleMouseEnter() {
			if ( ! actions.shouldActivateHover() ) return;

			actions.setHoverTimeout( () => {
				if ( ! state.menuOpenedBy.click ) {
					// Close the previously open hover menu if it exists
					if ( currentHoverMenu && currentHoverMenu !== getContext() ) {
						currentHoverMenu.menuOpenedBy.hover = false;
					}
					// Track this as the current hover menu
					currentHoverMenu = getContext();
					// Don't interfere with click-opened menus
					actions.openMenu( 'hover' );
				}
			}, CONFIG.HOVER.BASE_DELAY );
		},
		// Handle mouse leave from toggle button
		handleMouseLeave() {
			if ( ! actions.shouldActivateHover() ) return;

			actions.setHoverTimeout( () => {
				actions.closeMenu( 'hover' );
			}, state.dynamicHoverDelay ); // Use dynamic delay based on top spacing
		},
		// Handle mouse enter on menu container
		handleMenuMouseEnter() {
			if ( ! actions.shouldActivateHover() ) return;

			// Clear any close timeout to keep menu open
			actions.clearHoverTimeout();
		},
		// Handle mouse leave from menu container
		handleMenuMouseLeave() {
			if ( ! actions.shouldActivateHover() ) return;

			actions.setHoverTimeout( () => {
				actions.closeMenu( 'hover' );
			}, CONFIG.HOVER.BASE_DELAY ); // Use base delay when leaving menu
		},
		// ========== END HOVER FUNCTIONALITY ==========

		handleMenuKeydown( event ) {
			if ( state.menuOpenedBy.click ) {
				// If Escape close the menu.
				if ( event?.key === 'Escape' ) {
					actions.closeMenu( 'click' );
					actions.closeMenu( 'focus' );
				}
			}
		},
		handleMenuFocusout( event ) {
			// Safari fix: Ignore focusout during click processing
			// When clicking the toggle, Safari fires focusout events that can interfere
			if ( state.isProcessingClick ) {
				return;
			}

			const context = getContext();
			const { ref } = getElement();
			const menuContainer = context.megaMenu?.querySelector(
				'.wp-block-ollie-mega-menu__menu-container'
			);

			// Safari fix: Don't close when focus moves to navigation UI elements
			// These elements are part of the navigation system but outside the menu container
			if ( event.relatedTarget ) {
				const isNavigationUI =
					event.relatedTarget.classList?.contains('wp-block-navigation__responsive-close') ||
					event.relatedTarget === ref;

				if ( isNavigationUI ) {
					return;
				}
			}

			// Close menu if focus leaves the menu container
			// event.target === The element losing focus
			// event.relatedTarget === The element receiving focus (if any)
			// When focusout is outside the document, activeElement doesn't change
			if (
				event.relatedTarget === null ||
				( ! menuContainer?.contains( event.relatedTarget ) &&
					event.target !== window.document.activeElement )
			) {
				actions.closeAllMenus();
			}
		},
		openMenu( menuOpenedOn = 'click' ) {
			state.menuOpenedBy[ menuOpenedOn ] = true;
		},
		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();
			state.menuOpenedBy[ menuClosedOn ] = false;

			// Reset the menu reference and button focus when closed.
			if ( ! state.isMenuOpen ) {
				// Clear the global hover menu reference if this was the hover menu
				if ( currentHoverMenu === context ) {
					currentHoverMenu = null;
				}
				
				if (
					context.megaMenu?.contains( window.document.activeElement )
				) {
					context.previousFocus?.focus();
				}
				context.previousFocus = null;
				
				// Reset justification swap flag when menu closes
				if ( context.megaMenu ) {
					const menu = menuUtils.getMenu( context.megaMenu );
					if ( menu ) {
						delete menu.dataset.justificationSwapped;
					}
				}
				
				context.megaMenu = null;
			}
		},
	},
	callbacks: {
		initMenu() {
			const context = getContext();
			const { ref } = getElement();

			// Set the menu reference when initialized.
			if ( state.isMenuOpen ) {
				context.megaMenu = ref;

				// Apply mobile background color when menu opens
				const menu = menuUtils.getMenu( ref );
				if ( menu ) {
					actions.applyMobileBackgroundColor( menu );
				}
			}
		},
		// Initialize and adjust menu on component ready
		initMenuLayout() {
			// Adjust this specific menu
			actions.adjustMegaMenu();
		},
	},
} );
