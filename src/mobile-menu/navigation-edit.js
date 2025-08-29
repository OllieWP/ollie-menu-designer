/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { useEffect } from '@wordpress/element';
import { createInterpolateElement } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import TemplateSelector from '../components/TemplateSelector';
import MenuDesignerGuide from '../components/MenuDesignerGuide';
import useTemplateCreation from '../hooks/useTemplateCreation';
import MobileMenuColorControls from './mobile-menu-color-controls';

/**
 * Add mobile menu controls to the navigation block
 */
const withMobileMenuControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		// Only add controls to navigation block
		if ( name !== 'core/navigation' ) {
			return <BlockEdit { ...props } />;
		}

		const {
			mobileMenuSlug,
			mobileMenuBackgroundColor,
			mobileIconBackgroundColor,
			mobileIconColor
		} = attributes;

		// Check if menu templates are available
		const { records: templates, isResolving } = useEntityRecords( 'postType', 'wp_template_part', {
			per_page: -1,
			area: 'menu',
		} );
		const hasTemplates = !isResolving && templates && templates.length > 0;

		// Get the active theme slug for creating new template parts
		const themeSlug = useSelect( ( select ) => {
			const currentTheme = select( 'core' ).getCurrentTheme();
			return currentTheme?.stylesheet || 'theme';
		}, [] );

		// Use the shared template creation hook
		const { createTemplate: createMobileMenuTemplate, isCreating } = useTemplateCreation( {
			templateArea: 'menu',
			baseSlug: 'mobile-menu',
			baseTitle: __( 'Mobile Menu', 'menu-designer' ),
			existingTemplates: templates,
			currentTheme: themeSlug,
			onSuccess: ( newTemplate ) => {
				// Update the selected mobile menu template
				setAttributes( { mobileMenuSlug: newTemplate.slug } );
			},
		} );


		// Inject styles for mobile icon preview
		useEffect( () => {
			if ( ! mobileIconBackgroundColor && ! mobileIconColor ) return;

			const styleId = 'menu-designer-mobile-icon-styles';
			let styleElement = document.getElementById( styleId );

			if ( ! styleElement ) {
				styleElement = document.createElement( 'style' );
				styleElement.id = styleId;
				document.head.appendChild( styleElement );
			}

			const styles = `
				${ mobileIconBackgroundColor ? `.wp-block-navigation__overlay-menu-preview svg { background-color: ${mobileIconBackgroundColor} !important; }` : '' }
				${ mobileIconColor ? `.wp-block-navigation__overlay-menu-preview svg { fill: ${mobileIconColor} !important; }` : '' }
			`;

			styleElement.textContent = styles;

			return () => {
				// Don't remove on cleanup as other blocks might use it
			};
		}, [ mobileIconBackgroundColor, mobileIconColor ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<PanelBody
						title={ __( 'Mobile Menu', 'menu-designer' ) }
						initialOpen={ true }
					>
						<MenuDesignerGuide />
						<TemplateSelector
							value={ mobileMenuSlug }
							onChange={ ( value ) =>
								setAttributes( { mobileMenuSlug: value } )
							}
							templateArea="menu"
							label={ __(
								'Mobile Menu',
								'menu-designer'
							) }
							help={
								isResolving ? (
									__( 'Loading templates...', 'menu-designer' )
								) : hasTemplates ? (
									createInterpolateElement(
										__( 'Select a menu to use as the mobile menu or <create>create a new one</create> in the <editor>Site Editor</editor>.', 'menu-designer' ),
										{
											create: (
												<a
													href="#"
													onClick={ ( e ) => {
														e.preventDefault();
														if ( ! isCreating ) {
															createMobileMenuTemplate();
														}
													} }
													style={{
														textDecoration: 'underline',
														cursor: isCreating ? 'default' : 'pointer',
														opacity: isCreating ? 0.6 : 1
													}}
												/>
											),
											editor: (
												<a
													href={ `${window.location.origin}/wp-admin/site-editor.php?postType=wp_template_part&categoryId=menu` }
													target="_blank"
													rel="noreferrer"
													style={{ textDecoration: 'underline' }}
												/>
											),
										}
									)
								) : (
									createInterpolateElement(
										__( 'No menus found. <a>Create your first menu</a>.', 'menu-designer' ),
										{
											a: (
												<a
													href="#"
													onClick={ ( e ) => {
														e.preventDefault();
														if ( ! isCreating ) {
															createMobileMenuTemplate();
														}
													} }
													style={{
														textDecoration: 'underline',
														cursor: isCreating ? 'default' : 'pointer',
														opacity: isCreating ? 0.6 : 1
													}}
												/>
											),
										}
									)
								)
							}
							previewBackgroundColor={ mobileMenuBackgroundColor }
						/>
					</PanelBody>
				</InspectorControls>
				<InspectorControls group="color">
					<MobileMenuColorControls
						attributes={ attributes }
						setAttributes={ setAttributes }
						clientId={ props.clientId }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withMobileMenuControls' );

/**
 * Add the mobile menu attributes to the navigation block
 */
const addMobileMenuAttribute = ( settings, name ) => {
	if ( name !== 'core/navigation' ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			mobileMenuSlug: {
				type: 'string',
				default: '',
			},
			mobileMenuBackgroundColor: {
				type: 'string',
				default: '',
			},
			customMobileMenuBackgroundColor: {
				type: 'string',
				default: '',
			},
			mobileIconBackgroundColor: {
				type: 'string',
				default: '',
			},
			customMobileIconBackgroundColor: {
				type: 'string',
				default: '',
			},
			mobileIconColor: {
				type: 'string',
				default: '',
			},
			customMobileIconColor: {
				type: 'string',
				default: '',
			},
		},
	};
};

// Add filters
addFilter(
	'blocks.registerBlockType',
	'menu-designer/add-mobile-menu-attribute',
	addMobileMenuAttribute
);

addFilter(
	'editor.BlockEdit',
	'menu-designer/with-mobile-menu-controls',
	withMobileMenuControls
);
