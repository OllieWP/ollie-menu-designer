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
	label = __( 'Dropdown Menu', 'menu-designer' ),
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

	const secureSiteUrl = getSecureUrl( siteUrl );

	// Fetch all template parts
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	// Filter templates by area
	const templateOptions = hasResolved && records
		? records
			.filter( ( item ) => item.area === templateArea )
			.map( ( item ) => ( {
				label: decodeEntities( item.title.rendered ),
				value: item.slug,
			} ) )
		: [];

	const hasTemplates = templateOptions.length > 0;
	const isValidSelection = ! value || templateOptions.some( ( option ) => option.value === value );

	// Use the shared template creation hook
	const baseSlug = templateArea === 'menu' ? 'dropdown-menu' : templateArea;
	const baseTitle = templateArea === 'menu' ? __( 'Dropdown Menu', 'menu-designer' ) : templateArea;

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
							{ __( 'Preview', 'menu-designer' ) }
						</Button>
						<Button
							variant="tertiary"
							icon={ edit }
							href={ `${ secureSiteUrl }/wp-admin/site-editor.php?p=%2Fwp_template_part%2F${ currentTheme || '' }%2F%2F${ value }&canvas=edit` }
							target="_blank"
						>
							{ __( 'Edit Template', 'menu-designer' ) }
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

