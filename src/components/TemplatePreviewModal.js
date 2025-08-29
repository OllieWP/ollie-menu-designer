/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Modal, Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	PREVIEW_WRAPPER_CLASS,
	DEFAULT_IFRAME_HEIGHT,
	MODAL_HEADER_OFFSET,
	IFRAME_MEASURE_HEIGHT,
	calculateClampValue,
} from '../utils/template-utils';

/**
 * Template Preview Modal Component
 * IMPORTANT: This component preserves the critical iframe height measurement
 * and animation logic. Do not modify without testing height adjustments.
 *
 * @param {Object} props Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {string} props.templateSlug - Template slug to preview
 * @param {string} props.templateLabel - Template label for title
 * @param {string} props.siteUrl - Site URL for preview
 * @param {Object} props.previewOptions - Preview options (width, customWidth)
 * @param {string} props.backgroundColor - Background color for preview
 * @param {Object} props.layout - Layout settings
 */
export default function TemplatePreviewModal( {
	isOpen,
	onClose,
	templateSlug,
	templateLabel,
	siteUrl,
	previewOptions = {},
	backgroundColor = null,
	layout = {},
} ) {
	const [ iframeHeight, setIframeHeight ] = useState( DEFAULT_IFRAME_HEIGHT );
	const [ isIframeLoading, setIsIframeLoading ] = useState( true );

	// Reset loading state when modal opens or template changes
	useEffect( () => {
		if ( isOpen ) {
			setIsIframeLoading( true );
			setIframeHeight( DEFAULT_IFRAME_HEIGHT );
		}
	}, [ isOpen, templateSlug ] );

	/**
	 * Measure and set iframe height based on content
	 * CRITICAL: This function must run exactly as implemented to ensure
	 * proper height measurement and animation
	 * @param {Event} event - Iframe load event
	 */
	const handleIframeLoad = ( event ) => {
		const iframe = event.target;

		const measureHeight = () => {
			const iframeDoc = iframe.contentDocument;

			// Wait for document to be ready
			if ( iframeDoc?.readyState !== 'complete' ) {
				setTimeout( measureHeight, 50 );
				return;
			}

			// Temporarily expand iframe to measure content
			iframe.style.height = IFRAME_MEASURE_HEIGHT;

			// Force reflow
			iframeDoc.body.offsetHeight; // eslint-disable-line no-unused-expressions

			// Measure content height
			const wrapper = iframeDoc.querySelector( PREVIEW_WRAPPER_CLASS );
			const contentHeight = wrapper
				? wrapper.getBoundingClientRect().height
				: Math.max(
					iframeDoc.body.scrollHeight,
					iframeDoc.body.offsetHeight,
					iframeDoc.body.clientHeight
				);

			// Reset iframe height
			iframe.style.height = '100%';

			// Calculate final height
			let finalHeight = contentHeight;

			// Add padding if background color is present
			if ( backgroundColor ) {
				const padding = calculateClampValue( 1.5, 2, 0.04 );
				finalHeight += padding * 2; // Top and bottom
			}

			// Apply viewport constraints
			const maxHeight = window.innerHeight - MODAL_HEADER_OFFSET;
			finalHeight = Math.min( finalHeight, maxHeight );

			setIframeHeight( `${ finalHeight }px` );
			setIsIframeLoading( false );
		};

		measureHeight();
	};

	/**
	 * Calculate modal width based on preview options
	 */
	const getModalWidth = () => {
		const { width, customWidth } = previewOptions;

		switch ( width ) {
			case 'content':
				return layout?.contentSize || '650px';
			case 'wide':
				return layout?.wideSize || '1200px';
			case 'full':
				return '90%';
			case 'custom':
				return customWidth ? `${ customWidth }px` : '650px';
			default:
				return '650px';
		}
	};

	/**
	 * Close modal and reset states
	 */
	const handleClose = () => {
		onClose();
		setIframeHeight( DEFAULT_IFRAME_HEIGHT );
		setIsIframeLoading( true );
	};

	if ( ! isOpen ) return null;

	return (
		<Modal
			title={ sprintf(
				__( 'Menu Preview: %s', 'menu-designer' ),
				templateLabel
			) }
			onRequestClose={ handleClose }
			className="mega-menu-block-preview-modal"
			style={ {
				maxWidth: '90%',
				maxHeight: '90%',
				width: getModalWidth(),
			} }
		>
			<PreviewContainer
				isLoading={ isIframeLoading }
				height={ iframeHeight }
				backgroundColor={ backgroundColor }
			>
				{ isIframeLoading && <LoadingIndicator /> }
				<iframe
					key={ templateSlug }
					src={ `${ siteUrl }/?menu_designer_preview=${ templateSlug }` }
					style={ {
						width: '100%',
						height: '100%',
						border: 'none',
						opacity: isIframeLoading ? 0 : 1,
						transition: 'opacity 0.3s ease',
						borderRadius: backgroundColor ? '10px' : '0',
					} }
					title={ __( 'Template Preview', 'menu-designer' ) }
					onLoad={ handleIframeLoad }
				/>
			</PreviewContainer>
		</Modal>
	);
}

/**
 * Preview container component
 * IMPORTANT: Height transition is critical for smooth animation
 */
function PreviewContainer( { children, isLoading, height, backgroundColor } ) {
	const containerStyle = {
		width: '100%',
		height: isLoading ? '200px' : height,
		transition: 'height 0.3s ease',
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: backgroundColor || 'transparent',
		padding: backgroundColor ? 'clamp(1.5rem, 4vw, 2rem)' : '0',
		borderRadius: backgroundColor ? '10px' : '0',
		boxSizing: 'border-box',
	};

	return <div style={ containerStyle }>{ children }</div>;
}

/**
 * Loading indicator component
 */
function LoadingIndicator() {
	return (
		<div
			style={ {
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				textAlign: 'center',
			} }
		>
			<Spinner />
			<p style={ { marginTop: '10px' } }>
				{ __( 'Loading preview…', 'menu-designer' ) }
			</p>
		</div>
	);
}
