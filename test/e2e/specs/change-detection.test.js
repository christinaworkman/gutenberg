/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import '../support/bootstrap';
import { newPost, newDesktopBrowserPage, pressWithModifier } from '../support/utils';

describe( 'Change detection', () => {
	let handleInterceptedRequest;

	beforeAll( async () => {
		await newDesktopBrowserPage();
	} );

	beforeEach( async () => {
		await newPost();
	} );

	async function assertIsDirty( isDirty ) {
		let hadDialog = false;

		function handleOnDialog( dialog ) {
			dialog.accept();
			hadDialog = true;
		}

		try {
			page.on( 'dialog', handleOnDialog );
			await page.reload();

			// Ensure whether it was expected that dialog was encountered.
			expect( hadDialog ).toBe( isDirty );
		} catch ( error ) {
			throw error;
		} finally {
			page.removeListener( 'dialog', handleOnDialog );
		}
	}

	async function interceptSave() {
		await page.setRequestInterception( true );

		handleInterceptedRequest = ( interceptedRequest ) => {
			if ( ! interceptedRequest.url().includes( '/wp/v2/posts' ) ) {
				interceptedRequest.continue();
			}
		};
		page.on( 'request', handleInterceptedRequest );
	}

	async function releaseSaveIntercept() {
		page.removeListener( 'request', handleInterceptedRequest );
		await page.setRequestInterception( false );
	}

	it( 'Should autosave post', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );
		// Force autosave to occur immediately.
		await page.evaluate( function() {
			window.wp.data.dispatch( 'core/editor' ).autosave();
		} );
		const isSavingState = await page.waitForSelector( '.editor-post-saved-state.is-saving' );
		const autosaveState = await ( await isSavingState.getProperty( 'innerText' ) ).jsonValue();

		expect( autosaveState ).toBe( __( 'Autosaving' ) );

		await page.waitForSelector( '.editor-post-saved-state.is-saved' );

		// Still dirty after an autosave.
		await assertIsDirty( true );
	} );

	it( 'Should not prompt to confirm unsaved changes', async () => {
		await assertIsDirty( false );
	} );

	it( 'Should prompt if property changed without save', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		await assertIsDirty( true );
	} );

	it( 'Should prompt if content added without save', async () => {
		await page.click( '.editor-default-block-appender' );

		await assertIsDirty( true );
	} );

	it( 'Should not prompt if changes saved', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		await Promise.all( [
			// Wait for "Saved" to confirm save complete.
			page.waitForSelector( '.editor-post-saved-state.is-saved' ),

			// Keyboard shortcut Ctrl+S save.
			pressWithModifier( 'Mod', 'S' ),
		] );

		await assertIsDirty( false );
	} );

	it( 'Should prompt if save failed', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		await page.setOfflineMode( true );

		// Keyboard shortcut Ctrl+S save.
		await pressWithModifier( 'Mod', 'S' );

		// Ensure save update fails and presents button.
		await page.waitForXPath( '//p[contains(text(), \'Updating failed\')]' );
		await page.waitForSelector( '.editor-post-save-draft' );

		// Need to disable offline to allow reload.
		await page.setOfflineMode( false );

		await assertIsDirty( true );
	} );

	it( 'Should prompt if changes and save is in-flight', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		// Hold the posts request so we don't deal with race conditions of the
		// save completing early. Other requests should be allowed to continue,
		// for example the page reload test.
		await interceptSave();

		// Keyboard shortcut Ctrl+S save.
		await pressWithModifier( 'Mod', 'S' );

		await releaseSaveIntercept();

		await assertIsDirty( true );
	} );

	it( 'Should prompt if changes made while save is in-flight', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		// Hold the posts request so we don't deal with race conditions of the
		// save completing early. Other requests should be allowed to continue,
		// for example the page reload test.
		await interceptSave();

		// Keyboard shortcut Ctrl+S save.
		await pressWithModifier( 'Mod', 'S' );

		await page.type( '.editor-post-title__input', '!' );

		await releaseSaveIntercept();

		await assertIsDirty( true );
	} );

	it( 'Should prompt if property changes made while save is in-flight, and save completes', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		// Hold the posts request so we don't deal with race conditions of the
		// save completing early.
		await interceptSave();

		// Keyboard shortcut Ctrl+S save.
		await pressWithModifier( 'Mod', 'S' );

		// Dirty post while save is in-flight.
		await page.type( '.editor-post-title__input', '!' );

		// Allow save to complete. Disabling interception flushes pending.
		await Promise.all( [
			page.waitForSelector( '.editor-post-saved-state.is-saved' ),
			releaseSaveIntercept(),
		] );

		await assertIsDirty( true );
	} );

	it( 'Should prompt if block revision is made while save is in-flight, and save completes', async () => {
		await page.type( '.editor-post-title__input', 'Hello World' );

		// Hold the posts request so we don't deal with race conditions of the
		// save completing early.
		await interceptSave();

		// Keyboard shortcut Ctrl+S save.
		await pressWithModifier( 'Mod', 'S' );

		await page.click( '.editor-default-block-appender' );

		// Allow save to complete. Disabling interception flushes pending.
		await Promise.all( [
			page.waitForSelector( '.editor-post-saved-state.is-saved' ),
			releaseSaveIntercept(),
		] );

		await assertIsDirty( true );
	} );
} );
