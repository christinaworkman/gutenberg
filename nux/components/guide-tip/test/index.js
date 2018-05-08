/**
 * External dependencies
 */
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import { GuideTip } from '..';

describe( 'GuideTip', () => {
	it( 'should render correctly', () => {
		const wrapper = shallow(
			<GuideTip>
				It looks like you’re writing a letter. Would you like help?
			</GuideTip>
		);
		expect( wrapper ).toMatchSnapshot();
	} );

	it( 'should not render when step does not equal currentStep', () => {
		const wrapper = shallow(
			<GuideTip step={ 1 } currentStep={ null }>
				It looks like you’re writing a letter. Would you like help?
			</GuideTip>
		);
		expect( wrapper.isEmptyRender() ).toBe( true );
	} );

	it( 'should call onAdvance when the next button is clicked', () => {
		const onAdvance = jest.fn();
		const wrapper = shallow(
			<GuideTip onAdvance={ onAdvance }>
				It looks like you’re writing a letter. Would you like help?
			</GuideTip>
		);
		wrapper.find( 'Button[children="Tell me more!"]' ).first().simulate( 'click' );
		expect( onAdvance ).toHaveBeenCalled();
	} );

	it( 'should call onDismiss when the close button is clicked', () => {
		const onDismiss = jest.fn();
		const wrapper = shallow(
			<GuideTip onDismiss={ onDismiss }>
				It looks like you’re writing a letter. Would you like help?
			</GuideTip>
		);
		wrapper.find( 'IconButton[label="Dismiss guide"]' ).first().simulate( 'click' );
		expect( onDismiss ).toHaveBeenCalled();
	} );
} );
