/**
 * Internal dependencies
 */
import { currentGuideStep } from '../reducer';

describe( 'reducer', () => {
	describe( 'currentGuideStep', () => {
		it( 'should default to an empty object', () => {
			expect( currentGuideStep( undefined, {} ) ).toEqual( {} );
		} );

		it( 'should set the current step to 2 when advancing a guide that does not exist', () => {
			const state = currentGuideStep( {}, {
				type: 'ADVANCE_GUIDE',
				id: 'test/guide',
			} );
			expect( state ).toEqual( {
				'test/guide': 2,
			} );
		} );

		it( 'should increment the current step when advancing a guide that exists', () => {
			const initialState = {
				'test/guide': 2,
			};
			const state = currentGuideStep( initialState, {
				type: 'ADVANCE_GUIDE',
				id: 'test/guide',
			} );
			expect( state ).toEqual( {
				'test/guide': 3,
			} );
		} );

		it( 'should not increment the current step when the guide is dismissed', () => {
			const initialState = {
				'test/guide': null,
			};
			const state = currentGuideStep( initialState, {
				type: 'ADVANCE_GUIDE',
				id: 'test/guide',
			} );
			expect( state ).toEqual( {
				'test/guide': null,
			} );
		} );

		it( 'should set the current step to null when the guide is dismissed', () => {
			const initialState = {
				'test/guide': 2,
			};
			const state = currentGuideStep( initialState, {
				type: 'DISMISS_GUIDE',
				id: 'test/guide',
			} );
			expect( state ).toEqual( {
				'test/guide': null,
			} );
		} );
	} );
} );
