/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	PanelBody,
	Popover,
	RangeControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	__experimentalSpacer as Spacer, // eslint-disable-line
	__experimentalHStack as HStack, // eslint-disable-line
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, // eslint-disable-line
} from '@wordpress/components';
import {
	alignNone,
	justifyLeft,
	justifyCenter,
	justifyRight,
	stretchWide,
	stretchFullWidth,
	settings,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './edit.scss';
import TemplateSelector from '../../components/TemplateSelector';
import MenuDesignerGuide from '../../components/MenuDesignerGuide';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		label,
		menuSlug,
		title,
		url,
		description,
		showOnHover,
		disableWhenCollapsed,
		collapsedUrl,
		justifyMenu,
		width,
		customWidth,
		topSpacing,
	} = attributes;

	// State for link popovers
	const [ isLinkPopoverOpen, setIsLinkPopoverOpen ] = useState( false );
	const [ isHoverLinkPopoverOpen, setIsHoverLinkPopoverOpen ] = useState( false );

	// Get the layout settings.
	const layout = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditorSettings()?.__experimentalFeatures
				?.layout
	);

	// Automatically set justification to center when wide or full width is selected
	useEffect( () => {
		if (
			( width === 'wide' || width === 'full' ) &&
			justifyMenu !== 'center'
		) {
			setAttributes( { justifyMenu: 'center' } );
		}
	}, [ width, justifyMenu, setAttributes ] );

	// Automatically update block metadata name when label changes
	useEffect( () => {
		if ( label && label.trim() ) {
			// Only update if the metadata name is different from the label
			const currentMetadataName = attributes.metadata?.name;
			if ( currentMetadataName !== label ) {
				setAttributes( {
					metadata: {
						...( attributes.metadata || {} ),
						name: label,
					},
				} );
			}
		}
	}, [ label, attributes.metadata, setAttributes ] );

	// Modify block props.
	const blockProps = useBlockProps( {
		className: 'wp-block-navigation-item wp-block-ollie-mega-menu__toggle',
	} );

	const justificationOptions = [
		{
			value: 'left',
			icon: justifyLeft,
			label: __( 'Justify menu left', 'ollie-menu-designer' ),
		},
		{
			value: 'center',
			icon: justifyCenter,
			label: __( 'Justify menu center', 'ollie-menu-designer' ),
		},
		{
			value: 'right',
			icon: justifyRight,
			label: __( 'Justify menu right', 'ollie-menu-designer' ),
		},
	];

	const widthOptions = [
		{
			value: 'content',
			icon: alignNone,
			label: sprintf(
				// translators: %s: container size (i.e. 600px etc)
				__( 'Content width (%s wide)', 'ollie-menu-designer' ),
				layout?.contentSize || ''
			),
		},
		{
			value: 'wide',
			icon: stretchWide,
			label: sprintf(
				// translators: %s: container size (i.e. 600px etc)
				__( 'Wide width (%s wide)', 'ollie-menu-designer' ),
				layout?.wideSize || ''
			),
		},
		{
			value: 'full',
			icon: stretchFullWidth,
			label: __( 'Full width', 'ollie-menu-designer' ),
		},
		{
			value: 'custom',
			icon: settings,
			label: __( 'Custom width', 'ollie-menu-designer' ),
		},
	];

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					className="ollie-mega-menu__settings-panel"
					title={ __( 'Settings', 'ollie-menu-designer' ) }
					initialOpen={ true }
				>
					<MenuDesignerGuide />
					<TextControl
						label={ __( 'Text', 'ollie-menu-designer' ) }
						type="text"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						autoComplete="off"
					/>
					<TemplateSelector
						value={ menuSlug }
						onChange={ ( value ) =>
							setAttributes( { menuSlug: value } )
						}
						templateArea="menu"
						previewOptions={ { width, customWidth } }
					/>
					<ToggleControl
						label={ __( 'Open on hover', 'ollie-menu-designer' ) }
						checked={ showOnHover }
						onChange={ () => {
							setAttributes( {
								showOnHover: ! showOnHover,
							} );
						} }
						help={ __(
							'Display dropdown on mouse hover',
							'ollie-menu-designer'
						) }
					/>
					{ showOnHover && (
						<div className="components-base-control">
							<label className="components-base-control__label" htmlFor="mega-menu-hover-url">
								{ __( 'Menu Item URL', 'ollie-menu-designer' ) }
							</label>
							<div id="mega-menu-hover-url" style={ { marginTop: '8px' } }>
								{ url ? (
									<div className="block-editor-url-popover__link-viewer">
										<Button
											variant="secondary"
											onClick={ () =>
												setIsHoverLinkPopoverOpen( true )
											}
											style={ {
												maxWidth: '100%',
												justifyContent:
													'flex-start',
												height: 'auto',
												minHeight: '36px',
												padding: '4px 12px',
												textAlign: 'left',
											} }
										>
											<span
												style={ {
													overflow: 'hidden',
													textOverflow:
														'ellipsis',
													whiteSpace: 'nowrap',
													display: 'block',
													flex: 1,
												} }
											>
												{ url }
											</span>
										</Button>
									</div>
								) : (
									<Button
										variant="secondary"
										onClick={ () =>
											setIsHoverLinkPopoverOpen( true )
										}
									>
										{ __(
											'Add link',
											'ollie-menu-designer'
										) }
									</Button>
								) }
								{ isHoverLinkPopoverOpen && (
									<Popover
										position="bottom left"
										onClose={ () =>
											setIsHoverLinkPopoverOpen( false )
										}
										focusOnMount="firstElement"
										anchor={ document.activeElement }
										aria-label={
											url
												? __(
														'Edit link URL',
														'ollie-menu-designer'
												  )
												: __(
														'Add link URL',
														'ollie-menu-designer'
												  )
										}
									>
										<LinkControl
											value={
												url
													? { url: url }
													: null
											}
											onChange={ ( linkValue ) => {
												setAttributes( {
													url:
														linkValue?.url ||
														'',
												} );
												setIsHoverLinkPopoverOpen(
													false
												);
											} }
											onRemove={ () => {
												setAttributes( {
													url: '',
												} );
												setIsHoverLinkPopoverOpen(
													false
												);
											} }
											showInitialSuggestions={ true }
											withCreateSuggestion={ false }
											settings={ [] }
										/>
									</Popover>
								) }
							</div>
							<p className="ollie-mega-menu__layout-help">
								{ __(
									'When hover is enabled, clicking the menu item will navigate to this URL.',
									'ollie-menu-designer'
								) }
							</p>
						</div>
					) }
					<ToggleControl
						label={ __(
							'Disable in mobile menu',
							'ollie-menu-designer'
						) }
						checked={ disableWhenCollapsed }
						onChange={ () => {
							setAttributes( {
								disableWhenCollapsed: ! disableWhenCollapsed,
							} );
						} }
						help={ __(
							'Hide on mobile or link to a URL',
							'ollie-menu-designer'
						) }
					/>
					{ disableWhenCollapsed && (
						<>
							<div className="components-base-control">
								<label className="components-base-control__label" htmlFor="mega-menu-fallback-url">
									{ __( 'Fallback URL', 'ollie-menu-designer' ) }
								</label>
								<div id="mega-menu-fallback-url" style={ { marginTop: '8px' } }>
									{ collapsedUrl ? (
										<div className="block-editor-url-popover__link-viewer">
											<Button
												variant="secondary"
												onClick={ () =>
													setIsLinkPopoverOpen( true )
												}
												style={ {
													maxWidth: '100%',
													justifyContent:
														'flex-start',
													height: 'auto',
													minHeight: '36px',
													padding: '4px 12px',
													textAlign: 'left',
												} }
											>
												<span
													style={ {
														overflow: 'hidden',
														textOverflow:
															'ellipsis',
														whiteSpace: 'nowrap',
														display: 'block',
														flex: 1,
													} }
												>
													{ collapsedUrl }
												</span>
											</Button>
										</div>
									) : (
										<Button
											variant="secondary"
											onClick={ () =>
												setIsLinkPopoverOpen( true )
											}
										>
											{ __(
												'Add mobile link',
												'ollie-menu-designer'
											) }
										</Button>
									) }
									{ isLinkPopoverOpen && (
										<Popover
											position="bottom left"
											onClose={ () =>
												setIsLinkPopoverOpen( false )
											}
											focusOnMount="firstElement"
											anchor={ document.activeElement }
											aria-label={
												collapsedUrl
													? __(
															'Edit fallback URL',
															'ollie-menu-designer'
													  )
													: __(
															'Add fallback URL',
															'ollie-menu-designer'
													  )
											}
										>
											<LinkControl
												value={
													collapsedUrl
														? { url: collapsedUrl }
														: null
												}
												onChange={ ( linkValue ) => {
													setAttributes( {
														collapsedUrl:
															linkValue?.url ||
															'',
													} );
													setIsLinkPopoverOpen(
														false
													);
												} }
												onRemove={ () => {
													setAttributes( {
														collapsedUrl: '',
													} );
													setIsLinkPopoverOpen(
														false
													);
												} }
												showInitialSuggestions={ true }
												withCreateSuggestion={ false }
												settings={ [] }
											/>
										</Popover>
									) }
								</div>
								<p className="ollie-mega-menu__layout-help">
									{ __(
										'Link to a URL instead of displaying the dropdown on mobile.',
										'ollie-menu-designer'
									) }
								</p>
							</div>
						</>
					) }
				</PanelBody>
				<PanelBody
					className="ollie-mega-menu__layout-panel"
					title={ __( 'Layout', 'ollie-menu-designer' ) }
					initialOpen={ true }
				>
					<HStack alignment="top" justify="space-between">
						<ToggleGroupControl
							className="block-editor-hooks__flex-layout-justification-controls"
							label={ __( 'Width', 'ollie-menu-designer' ) }
							value={ width || 'content' }
							onChange={ ( widthValue ) => {
								setAttributes( {
									width: widthValue,
								} );
							} }
							__nextHasNoMarginBottom
						>
							{ widthOptions.map( ( option ) => {
								return (
									<ToggleGroupControlOptionIcon
										key={ option.value }
										value={ option.value }
										icon={ option.icon }
										label={ option.label }
									/>
								);
							} ) }
						</ToggleGroupControl>
						<ToggleGroupControl
							className={ `block-editor-hooks__flex-layout-justification-controls ${
								width === 'wide' || width === 'full'
									? 'is-disabled'
									: ''
							}` }
							label={ __( 'Justification', 'ollie-menu-designer' ) }
							value={ justifyMenu }
							onChange={ ( justificationValue ) => {
								setAttributes( {
									justifyMenu: justificationValue,
								} );
							} }
							isDeselectable={ true }
						>
							{ justificationOptions.map(
								( option ) => {
									return (
										<ToggleGroupControlOptionIcon
											key={ option.value }
											value={ option.value }
											icon={ option.icon }
											label={ option.label }
										/>
									);
								}
							) }
						</ToggleGroupControl>
					</HStack>
					{ ( width === 'wide' || width === 'full' ) && (
						<>
							<p className="ollie-mega-menu__layout-help">
								{ __(
									'When using wide or full width, the menu will be auto centered on the page.',
									'ollie-menu-designer'
								) }
							</p>
							<Spacer marginBottom={ 6 } />
						</>
					) }
					{ width === 'custom' && (
						<>
							<Spacer marginTop={ 6 } />
							<RangeControl
								__nextHasNoMarginBottom
								label={ __(
									'Custom width',
									'ollie-menu-designer'
								) }
								help={ __(
									'Set a custom width in pixels.',
									'ollie-menu-designer'
								) }
								value={ customWidth }
								onChange={ ( newCustomWidth ) =>
									setAttributes( {
										customWidth: newCustomWidth,
									} )
								}
								min={ 200 }
								max={ 1260 }
								step={ 1 }
								required
								__next40pxDefaultSize
							/>
						</>
					) }
					<Spacer marginTop={ 6 } />
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Top spacing', 'ollie-menu-designer' ) }
						help={ __(
							'The amount of space between the dropdown and the navigation item.',
							'ollie-menu-designer'
						) }
						value={ topSpacing }
						onChange={ ( newTopSpacing ) =>
							setAttributes( { topSpacing: newTopSpacing } )
						}
						min={ 0 }
						max={ 300 }
						step={ 1 }
						required
						__next40pxDefaultSize
					/>
				</PanelBody>
				<PanelBody
					className="ollie-mega-menu__link-attributes-panel"
					title={ __( 'Link Attributes', 'ollie-menu-designer' ) }
					initialOpen={ false }
				>
					<TextareaControl
						className="settings-panel__description"
						label={ __( 'Description', 'ollie-menu-designer' ) }
						type="text"
						value={ description || '' }
						onChange={ ( descriptionValue ) => {
							setAttributes( { description: descriptionValue } );
						} }
						help={ __(
							'The description will be displayed in the menu if the current theme supports it.',
							'ollie-menu-designer'
						) }
						autoComplete="off"
					/>
					<TextControl
						label={ __( 'Title Attribute', 'ollie-menu-designer' ) }
						type="text"
						value={ title || '' }
						onChange={ ( titleValue ) => {
							setAttributes( { title: titleValue } );
						} }
						help={ __(
							'Additional information to help clarify the purpose of the link.',
							'ollie-menu-designer'
						) }
						autoComplete="off"
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<button className="wp-block-navigation-item__content wp-block-ollie-mega-menu__toggle">
					<RichText
						identifier="label"
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( labelValue ) =>
							setAttributes( {
								label: labelValue,
							} )
						}
						aria-label={ __(
							'Dropdown link text',
							'ollie-menu-designer'
						) }
						placeholder={ __( 'Add label…', 'ollie-menu-designer' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/image',
							'core/strikethrough',
						] }
					/>
					<span className="wp-block-ollie-mega-menu__toggle-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
							focusable="false"
						>
							<path
								d="M1.50002 4L6.00002 8L10.5 4"
								strokeWidth="1.5"
							></path>
						</svg>
					</span>
					{ description && (
						<span className="wp-block-navigation-item__description">
							{ description }
						</span>
					) }
				</button>
			</div>
		</>
	);
}
