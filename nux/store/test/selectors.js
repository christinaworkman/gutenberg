/**
 * Internal dependencies
 */
import { getCurrentGuideStep } from '../selectors';

describe( 'selectors', () => {
	describe( 'getCurrentGuideStep', () => {
		it( 'should return 1 when there is no guide', () => {
			const state = {
				preferences: {
					currentGuideStep: {},
				},
			};
			expect( getCurrentGuideStep( state, 'test/guide' ) ).toBe( 1 );
		} );

		it( 'should return the current step when there is one', () => {
			const state = {
				preferences: {
					currentGuideStep: {
						'test/guide': 2,
					},
				},
			};
			expect( getCurrentGuideStep( state, 'test/guide' ) ).toBe( 2 );
		} );

		it( 'should return null when the guide was dismissed', () => {
			const state = {
				preferences: {
					currentGuideStep: {
						'test/guide': null,
					},
				},
			};
			expect( getCurrentGuideStep( state, 'test/guide' ) ).toBeNull();
		} );
	} );
} );
