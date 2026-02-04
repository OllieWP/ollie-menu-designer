/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import {
	Button,
	ComboboxControl,
	__experimentalSpacer as Spacer,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { seen, edit } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import useTemplateCreation from '../hooks/useTemplateCreation';
import TemplatePreviewModal from '../components/TemplatePreviewModal';
import TemplateHelpText from '../components/TemplateHelpText';
import { getSecureUrl } from '../utils/template-utils';

/**
 * Template selector component for menu templates
 *
 * @param {Object}   props                       Component props
 * @param {string}   props.value                 Selected template slug
 * @param {Function} props.onChange              Callback when template changes
 * @param {string}   props.templateArea          Template area (default: 'menu')
 * @param {string}   props.label                 Label for the selector
 * @param {string}   props.help                  Help text for the selector
 * @param {Object}   props.previewOptions        Preview modal options (width, customWidth, etc.)
 * @param {string}   props.previewBackgroundColor Background color for preview
 */
export default function TemplateSelector( {
	value,
	onChange,
	templateArea = 'menu',
	label = __( 'Dropdown Menu', 'ollie-menu-designer' ),
	help = null,
	previewOptions = {},
	previewBackgroundColor = null,
} ) {
	const [ isPreviewOpen, setIsPreviewOpen ] = useState( false );

	// Get site data and editor settings
	const { siteUrl, currentTheme, layout } = useSelect( ( select ) => {
		const { getSite, getCurrentTheme } = select( 'core' );
		const editorSettings = select( 'core/editor' ).getEditorSettings();
		return {
			siteUrl: getSite()?.url,
			currentTheme: getCurrentTheme()?.stylesheet,
			layout: editorSettings?.__experimentalFeatures?.layout,
		};
	}, [] );

	// Use multisite-aware URLs from localized data
	const actualSiteUrl = window.menuDesignerData?.siteUrl || siteUrl || window.location.origin;
	const adminUrl = window.menuDesignerData?.adminUrl || `${actualSiteUrl}/wp-admin/`;

	const secureSiteUrl = getSecureUrl( actualSiteUrl );

	// Fetch all template parts
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	// Define slug prefixes that indicate menu templates
	// This helps find templates that lost their area during theme export
	const menuSlugPrefixes = [
		'dropdown-menu',
		'mobile-menu',
		'mega-menu',
		'menu-',
	];

	// Filter templates by area, with fallback to slug-based matching
	// This ensures templates are still found if their area was lost during theme export
	const templateOptions = hasResolved && records
		? records
			.filter( ( item ) => {
				// Primary match: correct area
				if ( item.area === templateArea ) {
					return true;
				}
				// Fallback for 'menu' area: match by slug prefix
				if ( templateArea === 'menu' ) {
					return menuSlugPrefixes.some( ( prefix ) =>
						item.slug.startsWith( prefix )
					);
				}
				return false;
			} )
			.map( ( item ) => ( {
				label: decodeEntities( item.title.rendered ),
				value: item.slug,
			} ) )
		: [];

	const hasTemplates = templateOptions.length > 0;
	const isValidSelection = ! value || templateOptions.some( ( option ) => option.value === value );

	// Use the shared template creation hook
	const baseSlug = templateArea === 'menu' ? 'dropdown-menu' : templateArea;
	const baseTitle = templateArea === 'menu' ? __( 'Dropdown Menu', 'ollie-menu-designer' ) : templateArea;

	const { createTemplate: createNewTemplate, isCreating } = useTemplateCreation( {
		templateArea,
		baseSlug,
		baseTitle,
		existingTemplates: records,
		currentTheme,
		onSuccess: ( newTemplate ) => {
			// Update the selected value when template is created
			onChange( newTemplate.slug );
		},
	} );

	/**
	 * Get current template label
	 */
	const getCurrentTemplateLabel = () => {
		const template = templateOptions.find( ( option ) => option.value === value );
		return template?.label || value;
	};

	return (
		<>
			<ComboboxControl
				label={ label }
				value={ value }
				options={ templateOptions }
				onChange={ onChange }
				help={ help || (
					<TemplateHelpText
						hasTemplates={ hasTemplates }
						templateArea={ templateArea }
						siteUrl={ secureSiteUrl }
						adminUrl={ adminUrl }
						onCreateClick={ createNewTemplate }
						isCreating={ isCreating }
					/>
				) }
			/>

			{ value && isValidSelection && (
				<>
					<Spacer marginTop={ 5 } />
					<HStack>
						<Button
							variant="secondary"
							icon={ seen }
							onClick={ () => setIsPreviewOpen( true ) }
						>
							{ __( 'Preview', 'ollie-menu-designer' ) }
						</Button>
						<Button
							variant="tertiary"
							icon={ edit }
							href={ `${ adminUrl }/site-editor.php?p=%2Fwp_template_part%2F${ currentTheme || '' }%2F%2F${ value }&canvas=edit` }
							target="_blank"
						>
							{ __( 'Edit Template', 'ollie-menu-designer' ) }
						</Button>
					</HStack>
					<Spacer marginTop={ 6 } />
				</>
			) }

			<TemplatePreviewModal
				isOpen={ isPreviewOpen }
				onClose={ () => setIsPreviewOpen( false ) }
				templateSlug={ value }
				templateLabel={ getCurrentTemplateLabel() }
				siteUrl={ secureSiteUrl }
				previewOptions={ previewOptions }
				backgroundColor={ previewBackgroundColor }
				layout={ layout }
			/>
		</>
	);
}

