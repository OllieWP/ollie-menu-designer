/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Guide, __experimentalHStack as HStack } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Menu Designer Guide Component
 *
 * Displays a guide modal with tutorial information about the Menu Designer plugin.
 * Can be used in both mega menu and mobile menu settings.
 *
 * @param {Object} props - Component props
 * @param {string} props.buttonText - Text for the button that opens the guide
 * @param {string} props.buttonStyle - Additional styles for the button
 * @return {Element} Guide button and modal
 */
export default function MenuDesignerGuide( {
	buttonText = __( 'Menu Designer Guide', 'menu-designer' ),
	buttonStyle = {}
} ) {
	const [ isGuideOpen, setIsGuideOpen ] = useState( false );
	const [ isDismissed, setIsDismissed ] = useState( false );

	// Check localStorage on mount to see if guide was previously dismissed
	useEffect( () => {
		const dismissed = localStorage.getItem( 'ollieMenuDesignerGuideDismissed' );
		if ( dismissed === 'true' ) {
			setIsDismissed( true );
		}
	}, [] );

	// Handle dismissing the guide
	const handleDismiss = () => {
		setIsDismissed( true );
		localStorage.setItem( 'ollieMenuDesignerGuideDismissed', 'true' );
	};

	// Don't render anything if dismissed
	if ( isDismissed ) {
		return null;
	}

	return (
		<>
			<HStack
				alignment="center"
				className="menu-designer-guide-buttons"
				spacing={ 2 }
				style={ { marginBottom: '16px', ...buttonStyle } }
			>
				<Button
					variant="link"
					icon={ <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z"></path></svg> }
					iconSize={ 20 }
					onClick={ () => setIsGuideOpen( true ) }
					label={ __( 'View the guide', 'menu-designer' ) }
					style={ { flex: 1, justifyContent: 'center' } }
				>
					{ buttonText }
				</Button>
				<Button
					variant="link"
					icon={ closeSmall }
					iconSize={ 22 }
					onClick={ handleDismiss }
					label={ __( 'Dismiss guide', 'menu-designer' ) }
					showTooltip={ true }
					style={ { minWidth: 'auto' } }
				/>
			</HStack>
			{ isGuideOpen && (
				<Guide
					contentLabel={ __( 'Menu Designer Guide', 'menu-designer' ) }
					onFinish={ () => setIsGuideOpen( false ) }
					className="menu-designer-guide"
					pages={ [
						{
							content: (
								<>
									<h2>{ __( 'Welcome to Menu Designer!', 'menu-designer' ) }</h2>
									<p>{ __( 'This guide will help you create your first mobile or dropdown menu. Watch the complete video tutorial below to get started or click "Next" to learn specific tips.', 'menu-designer' ) }</p>
									<div className="menu-designer-guide-video">
										<iframe
											src='https://www.youtube.com/embed/UXWOafpBn38'
											frameborder='0'
											allowfullscreen
										/>
									</div>
								</>
							),
						},
						{
							content: (
								<>
									<h2>{ __( 'Add a mobile menu', 'menu-designer' ) }</h2>
									<p>{ __( 'To add a mobile menu, select the Navigation block and click Settings tab in the block settings sidebar. Here, you can select or create a mobile menu. In the Styles tab, you can customize the various colors of the mobile menu.', 'menu-designer' ) }</p>
									<div className="menu-designer-guide-video">
										<iframe
											src='https://www.youtube.com/embed/UXWOafpBn38?start=150'
											frameborder='0'
											allowfullscreen
										/>
									</div>
								</>
							),
						},
						{
							content: (
								<>
									<h2>{ __( 'Add a dropdown menu item', 'menu-designer' ) }</h2>
									<p>{ __( 'To add a dropdown menu item, select the Navigation block and click the "Add Block" button. Use the block inserter to add the "Dropdown Menu" block. Once added, you can create or select a dropdown menu and configure it with the available settings.', 'menu-designer' ) }</p>
									<div className="menu-designer-guide-video">
										<iframe
											src='https://www.youtube.com/embed/UXWOafpBn38?start=421'
											frameborder='0'
											allowfullscreen
										/>
									</div>
								</>
							),
						},
						{
							content: (
								<>
									<h2>{ __( 'Create your first menu', 'menu-designer' ) }</h2>
									<p>{ __( 'You can create your first menu by clicking "create a new one" link under the menu selector as seen in the video below. You can also go to Appearance → Editor → Patterns and create a new menu there as well.', 'menu-designer' ) }</p>
									<div className="menu-designer-guide-video">
										<iframe
											src='https://www.youtube.com/embed/UXWOafpBn38?start=216'
											frameborder='0'
											allowfullscreen
										/>
									</div>
								</>
							),
						}
					] }
				/>
			) }
		</>
	);
}
