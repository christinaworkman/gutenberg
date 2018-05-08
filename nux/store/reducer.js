/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

export function currentGuideStep( state = {}, action ) {
	switch ( action.type ) {
		case 'ADVANCE_GUIDE': {
			const { id } = action;

			const currentStep = get( state, [ id ], 1 );
			if ( currentStep === null ) {
				return state;
			}

			return {
				...state,
				[ id ]: currentStep + 1,
			};
		}

		case 'DISMISS_GUIDE': {
			const { id } = action;
			return {
				...state,
				[ id ]: null,
			};
		}
	}

	return state;
}

const preferences = combineReducers( { currentGuideStep } );

export default combineReducers( { preferences } );
