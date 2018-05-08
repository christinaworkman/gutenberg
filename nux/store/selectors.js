/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Returns the step that the given guide is up to. This starts at 1 and is
 * incremented when ADVANCE_GUIDE is dispatched. If the guide has been
 * dismissed, null is returned.
 *
 * @param {Object} state Global application state.
 * @param {string} id    The guide's unique identifier.
 *
 * @return {?number} The step that the guide is up to, or null if the guide has been dismissed.
 */
export function getCurrentGuideStep( state, id ) {
	return get( state.preferences.currentGuideStep, [ id ], 1 );
}
