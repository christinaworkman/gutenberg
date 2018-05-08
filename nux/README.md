NUX (New User eXperience)
=========================

The NUX module exposes components, and `wp.data` methods useful for onboarding a new user to the WordPress admin interface.

Specifically, it allows a _guide_ to be presented. A guide is a series of _tips_ which the user steps through one by one. Each tip points to an element in the UI and contains text that explains the element's functionality. The user can dismiss the guide entirely which causes it to never show again. The guide's current state is persisted between sessions using `localStorage`.

## GuideTip

`GuideTip` is a React component that renders a single _tip_ on the screen. The tip will point to the React element that `<GuideTip>` is nested within, and appears when the guide with the given `guideID` has been advanced to the specified `step`.

See [the component's README][guide-tip-readme] for more information.

[guide-tip-readme]: https://github.com/WordPress/gutenberg/tree/master/nux/components/guide-tip/README.md

```jsx
function MusicPlayer() {
	return (
		<div>
			<button onClick={ ... }>
				⏮
				<GuideTip guideID="acme/music-player-guide" step={ 2 }>
					Click here to play the previous song.
				</GuideTip>
			</button>
			<button onClick={ ... }>
				⏯	
				<GuideTip guideID="acme/music-player-guide" step={ 1 }>
					Click here to play or pause the song.
				</GuideTip>
			</button>
			<button onClick={ ... }>
				⏭	
				<GuideTip guideID="acme/music-player-guide" step={ 3 }>
					Click here to play the next song.
				</GuideTip>
			</button>
		</div>
	);
}
```

## Retrieving the current step

`getCurrentGuideStep` is a select method that allows you to determine what step number a guide is at. The current step is an integer ≥ 1. If `null` is returned, the guide has been dismissed.

```jsx
const currentStep = select( 'core/nux' ).getCurrentGuideStep( 'acme/music-player-guide' );
console.log( currentStep ); // 2
```

## Manually advancing a guide

`advanceGuide` is a dispatch method that allows you to manually advance a guide to the next step.

```jsx
<button
	onClick={ () => {
		dispatch( 'core/nux' ).advanceGuide( 'acme/music-player-guide' );
	}
>
	Go to next step	
</button>
```

## Manually dismissing a guide

`advanceGuide` is a dispatch method that allows you to manually dismiss a guide.

```jsx
<button
	onClick={ () => {
		dispatch( 'core/nux' ).dismissGuide( 'acme/music-player-guide' );
	}
>
	Dismiss guide
</button>
```
