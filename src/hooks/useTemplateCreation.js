/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Custom hook for creating template parts
 *
 * @param {Object} options Configuration options
 * @param {string} options.templateArea - The template area (e.g., 'menu', 'header', 'footer')
 * @param {string} options.baseSlug - Base slug for the template (e.g., 'mobile-menu', 'dropdown-menu')
 * @param {string} options.baseTitle - Base title for the template (e.g., 'Mobile Menu', 'Dropdown Menu')
 * @param {Array} options.existingTemplates - Array of existing templates to check for duplicates
 * @param {string} options.currentTheme - Current theme slug
 * @param {Function} options.onSuccess - Callback when template is created successfully
 * @returns {Object} Object containing createTemplate function and isCreating state
 */
export default function useTemplateCreation( {
	templateArea,
	baseSlug,
	baseTitle,
	existingTemplates = [],
	currentTheme,
	onSuccess = () => {},
} ) {
	const [ isCreating, setIsCreating ] = useState( false );
	const { saveEntityRecord } = useDispatch( 'core' );

	/**
	 * Generate a unique slug and title
	 */
	const generateUniqueSlugAndTitle = () => {
		// Count existing templates with our base slug pattern
		const existingCount = existingTemplates?.filter( t => {
			if ( !t.area || t.area === templateArea ) {
				return t.slug === baseSlug || t.slug.startsWith( `${baseSlug}-` );
			}
			return false;
		} ).length || 0;

		let slug = baseSlug;
		let displayNumber = existingCount + 1;

		// If this is not the first template, add a number
		if ( existingCount > 0 ) {
			// Find the next available slug
			let counter = existingCount;
			do {
				counter++;
				slug = `${baseSlug}-${counter}`;
			} while ( existingTemplates?.find(
				t => t.slug === slug && ( !t.area || t.area === templateArea )
			) );
			displayNumber = counter;
		}

		// Generate the title
		const title = existingCount > 0
			? sprintf( __( '%s %d', 'ollie-menu-designer' ), baseTitle, displayNumber )
			: baseTitle;

		return { slug, title };
	};

	/**
	 * Create a new template part
	 */
	const createTemplate = async () => {
		if ( isCreating ) return;

		setIsCreating( true );

		try {
			const { slug, title } = generateUniqueSlugAndTitle();

			const newTemplate = await saveEntityRecord( 'postType', 'wp_template_part', {
				slug: slug,
				theme: currentTheme || 'theme',
				type: 'wp_template_part',
				area: templateArea,
				title: {
					raw: title,
					rendered: title
				},
				content: '',
				status: 'publish',
			} );

			if ( newTemplate && newTemplate.id ) {
				// Call success callback with the new template
				onSuccess( newTemplate );

				// Small delay to ensure the template is fully saved
				setTimeout( () => {
					// Navigate to the new template in the site editor
					const editUrl = `${window.menuDesignerData.adminUrl}site-editor.php?postId=${encodeURIComponent( newTemplate.id )}&postType=wp_template_part&canvas=edit`;
					window.open( editUrl, '_blank' );
				}, 500 );
			} else {
				console.error( 'Template was created but no ID was returned' );
			}
		} catch ( error ) {
			console.error( 'Error creating template:', error );
			alert( __( 'Failed to create template. Please try again.', 'ollie-menu-designer' ) );
		} finally {
			setIsCreating( false );
		}
	};

	return {
		createTemplate,
		isCreating,
	};
}
