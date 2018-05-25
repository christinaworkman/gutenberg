/**
 * External dependencies
 */
import { defer, partial } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createRef, compose } from '@wordpress/element';
import { createSlotFill, Button, IconButton, withGlobalEvents } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './style.scss';

const { Slot, Fill } = createSlotFill( 'DotTip' );

export class DotTip extends Component {
	constructor() {
		super( ...arguments );

		this.setPosition = this.setPosition.bind( this );

		this.anchorRef = createRef();
		this.advanceButtonRef = createRef();

		this.state = {
			direction: 'right',
			position: {},
		};
	}

	componentDidMount() {
		if ( this.props.isVisible ) {
			defer( this.setPosition );
		}
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.isVisible && ! prevProps.isVisible ) {
			this.setPosition();

			if ( this.advanceButtonRef.current ) {
				this.advanceButtonRef.current.focus();
			}
		}
	}

	setPosition() {
		const anchor = this.anchorRef.current;
		if ( ! anchor || ! anchor.parentNode ) {
			return;
		}

		const rect = anchor.parentNode.getBoundingClientRect();
		const centerX = rect.left + ( rect.width / 2 );
		const centerY = rect.top + ( rect.height / 2 );

		const viewportCenterX = document.documentElement.clientWidth / 2;
		const direction = centerX > viewportCenterX ? 'left' : 'right';

		this.setState( {
			direction,
			position: {
				left: direction === 'left' ? rect.left : rect.right,
				top: centerY,
			},
		} );
	}

	render() {
		const { children, isVisible, hasNextTip, onDismiss, onDisable } = this.props;
		const { direction, position } = this.state;

		if ( ! isVisible ) {
			return null;
		}

		return (
			<span ref={ this.anchorRef }>
				<Fill>
					<div
						className={ `editor-dot-tip is-${ direction }` }
						style={ position }
						role="dialog"
						aria-modal="true"
						aria-label={ __( 'New User Guide' ) }
					>
						<div className="editor-dot-tip__content">
							<p>{ children }</p>
							<p>
								<Button
									ref={ this.advanceButtonRef }
									isLink
									onClick={ onDismiss }
								>
									{ hasNextTip ? __( 'See next' ) : __( 'Got it' ) }
								</Button>
							</p>
							<IconButton
								icon="no-alt"
								label={ __( 'Disable guide' ) }
								className="editor-dot-tip__close"
								onClick={ onDisable }
							/>
						</div>
					</div>
				</Fill>
			</span>
		);
	}
}

const EnhancedDotTip = compose(
	withSelect( ( select, { id } ) => {
		const { isTipVisible, getAssociatedGuide } = select( 'core/nux' );
		const associatedGuide = getAssociatedGuide( id );
		return {
			isVisible: isTipVisible( id ),
			hasNextTip: !! ( associatedGuide && associatedGuide.nextTipID ),
		};
	} ),
	withDispatch( ( dispatch, { id } ) => {
		const { dismissTip, disableTips } = dispatch( 'core/nux' );
		return {
			onDismiss: partial( dismissTip, id ),
			onDisable: disableTips,
		};
	} ),
	withGlobalEvents( {
		resize: 'setPosition',
	} ),
)( DotTip );

EnhancedDotTip.Slot = Slot;

export default EnhancedDotTip;
