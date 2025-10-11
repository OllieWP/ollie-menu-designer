/**
 * Template utility functions and constants
 */

// Constants
export const PREVIEW_WRAPPER_CLASS = '.mega-menu-preview-wrapper';
export const DEFAULT_IFRAME_HEIGHT = '600px';
export const MODAL_HEADER_OFFSET   = 120;
export const IFRAME_MEASURE_HEIGHT = '2000px';
export const REM_TO_PX             = 16;

/**
 * Calculate CSS clamp() value in pixels
 *
 * @param {number} min - Minimum value in rem
 * @param {number} max - Maximum value in rem
 * @param {number} viewportRatio - Viewport ratio (e.g., 0.04 for 4vw)
 * @returns {number} Calculated padding in pixels
 */
export const calculateClampValue = ( min, max, viewportRatio ) => {
	const minPx                  = min * REM_TO_PX;
	const maxPx                  = max * REM_TO_PX;
	const viewportPx             = window.innerWidth * viewportRatio;
	return Math.max( minPx, Math.min( viewportPx, maxPx ) );
};

/**
 * Get site URL with correct protocol
 *
 * @param {string} url - Site URL
 * @returns {string} URL with correct protocol
 */
export const getSecureUrl = ( url ) => {
	if ( ! url ) {
		return '';
	}
	return window.location.protocol === 'https:'
		? url.replace( /^http:\/\//, 'https://' )
		: url;
};