/**
 * Internal dependencies
 */
import { advanceGuide, dismissGuide } from '../actions';

describe( 'actions', () => {
	describe( 'advanceGuide', () => {
		it( 'should return an ADVANCE_GUIDE action', () => {
			expect( advanceGuide( 'test/guide' ) ).toEqual( {
				type: 'ADVANCE_GUIDE',
				id: 'test/guide',
			} );
		} );
	} );

	describe( 'dismissGuide', () => {
		it( 'should return an DISMISS_GUIDE action', () => {
			expect( dismissGuide( 'test/guide' ) ).toEqual( {
				type: 'DISMISS_GUIDE',
				id: 'test/guide',
			} );
		} );
	} );
} );
