/**
 * Returns an action object that, when dispatched, advances the given guide to
 * the next step.
 *
 * @param {string} id The guide's unique identifier.
 *
 * @return {Object} Action object.
 */
export function advanceGuide( id ) {
	return {
		type: 'ADVANCE_GUIDE',
		id,
	};
}

/**
 * Returns an action object that, when dispatched, dismisses the given guide so
 * that it won't display again.
 *
 * @param {string} id The guide's unique identifier.
 *
 * @return {Object} Action object.
 */
export function dismissGuide( id ) {
	return {
		type: 'DISMISS_GUIDE',
		id,
	};
}
