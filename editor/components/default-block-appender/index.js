/**
 * External dependencies
 */
import classnames from 'classnames';
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/element';
import { getDefaultBlockName } from '@wordpress/blocks';
import { decodeEntities } from '@wordpress/utils';
import { withSelect, withDispatch } from '@wordpress/data';
import { GuideTip } from '@wordpress/nux';

/**
 * Internal dependencies
 */
import './style.scss';
import BlockDropZone from '../block-drop-zone';
import InserterWithShortcuts from '../inserter-with-shortcuts';
import Inserter from '../inserter';

export function DefaultBlockAppender( {
	isLocked,
	isVisible,
	onAppend,
	showPrompt,
	placeholder,
	layout,
	rootUID,
	currentGuideStep,
} ) {
	if ( isLocked || ! isVisible ) {
		return null;
	}

	const value = decodeEntities( placeholder ) || __( 'Write your story' );

	return (
		<div
			data-root-uid={ rootUID || '' }
			className={ classnames( 'editor-default-block-appender', {
				'has-guide-tip': currentGuideStep === 1,
			} ) }>
			<BlockDropZone rootUID={ rootUID } layout={ layout } />
			<input
				role="button"
				aria-label={ __( 'Add block' ) }
				className="editor-default-block-appender__content"
				type="text"
				readOnly
				onFocus={ onAppend }
				onClick={ onAppend }
				onKeyDown={ onAppend }
				value={ showPrompt ? value : '' }
			/>
			<InserterWithShortcuts rootUID={ rootUID } layout={ layout } />
			<Inserter position="top right">
				<GuideTip guideID="core/editor" step={ 1 }>
					{ __( 'Welcome to the wonderful world of blocks! Click ‘Add block’ to insert different kinds of content—text, images, quotes, video, lists, and much more.' ) }
				</GuideTip>
			</Inserter>
		</div>
	);
}
export default compose(
	withSelect( ( select, ownProps ) => {
		const { getBlockCount, getBlock, getEditorSettings } = select( 'core/editor' );
		const { getCurrentGuideStep } = select( 'core/nux' );

		const isEmpty = ! getBlockCount( ownProps.rootUID );
		const lastBlock = getBlock( ownProps.lastBlockUID );
		const isLastBlockDefault = get( lastBlock, [ 'name' ] ) === getDefaultBlockName();
		const { templateLock, bodyPlaceholder } = getEditorSettings();

		return {
			isVisible: isEmpty || ! isLastBlockDefault,
			showPrompt: isEmpty,
			isLocked: !! templateLock,
			placeholder: bodyPlaceholder,
			currentGuideStep: getCurrentGuideStep( 'core/editor' ),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const {
			insertDefaultBlock,
			startTyping,
		} = dispatch( 'core/editor' );
		return {
			onAppend() {
				const { layout, rootUID } = ownProps;

				let attributes;
				if ( layout ) {
					attributes = { layout };
				}

				insertDefaultBlock( attributes, rootUID );
				startTyping();
			},
		};
	} ),
)( DefaultBlockAppender );
