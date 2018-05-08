GuideTip
========

`GuideTip` is a React component that renders a single _tip_ on the screen. The tip will point to the React element that `<GuideTip>` is nested within, and appears when the guide with the given `guideID` has been advanced to the specified `step`.

[guide-tip-readme]: https://github.com/WordPress/gutenberg/tree/master/nux/components/guide-tip/README.md

## Usage

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

## Props

The component accepts the following props:

### guideID

An identifier that uniquely identifies the guide that this tip is a part of.

- Type: `string`
- Required: Yes

### step

Indicates when in the guide this tip should appear. Should be a positive ≥ 1 integer. The tip will appear if and only if the given `step` matches `wp.data.select( 'core/nux' ).getCurrentStep( guideID )`.

- Type: `number`
- Required: Yes

### children

Any React element or elements can be passed as children. They will be rendered within the tip bubble.
