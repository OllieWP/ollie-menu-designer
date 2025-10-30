/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Template Help Text Component
 * Generates help text with links for template creation
 *
 * @param {Object} props Component props
 * @param {boolean} props.hasTemplates - Whether templates exist
 * @param {string} props.templateArea - Template area name
 * @param {string} props.siteUrl - Site URL for links
 * @param {string} props.adminUrl - Admin URL for links
 * @param {Function} props.onCreateClick - Callback when create is clicked
 * @param {boolean} props.isCreating - Whether template is being created
 */
export default function TemplateHelpText( {
	hasTemplates,
	templateArea,
	siteUrl,
	adminUrl,
	onCreateClick,
	isCreating = false,
} ) {
	if ( hasTemplates ) {
		return createInterpolateElement(
			sprintf(
				__( 'Select a menu to use as a dropdown or <create>create a new one</create> in the <editor>Site Editor</editor>.', 'ollie-menu-designer' )
			),
			{
				create: (
					< a
						href    = "#"
						onClick = { ( e ) => {
							e.preventDefault();
							if ( ! isCreating ) {
								onCreateClick();
							}
							} }
						style = {{
							textDecoration: 'underline',
							cursor: isCreating ? 'default' : 'pointer',
							opacity: isCreating ? 0.6 : 1
							}}
					/ >
				),
			editor: (
					< a
						href   = { `${ adminUrl }site - editor.php ? postType = wp_template_part & categoryId = ${ templateArea }` }
						target = "_blank"
						rel    = "noreferrer"
						style  = {{ textDecoration: 'underline' }}
					/ >
				),
			}
		);
	}

	// Special case for menu templates
	const noTemplatesMessage = templateArea === 'menu'
		? __( 'No menus found. <a>Create your first menu</a>.', 'ollie-menu-designer' )
		: sprintf(
			__( 'No %s templates found. <a>Create your first template</a>.', 'ollie-menu-designer' ),
			templateArea
		);

	return createInterpolateElement(
		noTemplatesMessage,
		{
			a: (
				< a
					href    = "#"
					onClick = { ( e ) => {
						e.preventDefault();
						if ( ! isCreating ) {
							onCreateClick();
						}
						} }
					style = {{
						textDecoration: 'underline',
						cursor: isCreating ? 'default' : 'pointer',
						opacity: isCreating ? 0.6 : 1
						}}
				/ >
			),
		}
	);
}
