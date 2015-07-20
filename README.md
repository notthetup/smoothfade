# smoothfade

[![npm version](https://badge.fury.io/js/smoothfade.svg)](http://badge.fury.io/js/smoothfade)

Smooth fading of volume (gain) in [WebAudio](http://webaudio.github.io/web-audio-api/) is possible with parameter automation on the [GainNode](http://webaudio.github.io/web-audio-api/#the-gainnode-interface).

However, currently, there is no easy way to stop and change (for eg. reverse) an automation smoothly. Once an [AudioParam](http://webaudio.github.io/web-audio-api/#idl-def-AudioParam) is automated, there is no easy way to know it's value at a given point of time except for calculating it manually using the [automation equations](http://webaudio.github.io/web-audio-api/#widl-AudioParam-exponentialRampToValueAtTime-void-float-value-double-endTime). Hence stopping and reversing the automation is not trivial.

[This JSFiddle](http://jsfiddle.net/notthetup/zrLb0pcy/) shows the various techniques that don't work for smooth fading, and finally the calculation based technique which does.

This library does the calculation and allows fading in/out smoothly.

# Usage

```
npm install smoothfade
```

```js
// wrap the smoothfade around a gain node

var sm = smoothfade(context, gain);


// use fadeIn/fadeOut functions to
// fadeIn/fadeOut the audio.

sm.fadeIn();

sm.fadeOut();
```


# API

## Constructor

eg: `var sm = smoothfade(context, gainNode, options);`

- `context`: __AudioContext__ - The [AudioContext](http://webaudio.github.io/web-audio-api/#the-audiocontext-interface) within which the [GainNode](http://webaudio.github.io/web-audio-api/#idl-def-AudioNode) has been created.
- `gainNode`: __GainNode__ - The [GainNode](http://webaudio.github.io/web-audio-api/#the-gainnode-interface) which is connected to the audio graph which needs to be faded in/out.
- `options`: Optional object attribute which contains extra configuration options in the following format
	-`startValue` : __Number__ - The initial starting value of the gainNode. If not specified, the library attempts to read it from the gainNode itself. This is useful if the gainNode is already being automated before this library is initialized.
	- `type` : __String__ - The type of automation to use. Currently support 'linear' and 'exponential'. 'exponential' fade is considered to be more natural to human ears and hence is the default
	- `fadeLength` : __Number__ - The time taken (in seconds) for a complete fadeout (from 1 - 0) or fadein (from 0 - 1). This determines how quickly the volume fades for both fadeins and fadeouts. This defaults to 10.


## Methods

- `fadeIn` : Fade in the audio. Slowly increase the gain of gainNode.
	- eg :
	```js
	sm.fadeIn(options);
	```
	- arguments (optional):
		- `targetValue` : __Number__ - The targeted value of the gain (between 0 and 1) where the fadeIn will stop. This defaults to 1.
		- `startTime` : __Number__ - Timestamp to define when the fading starts, in the same time coordinate system as the AudioContext _currentTime_ attribute. This defaults _currentTime_.


- `fadeOut` : Fade out the audio. Slowly decrease the gain of gainNode.
	- eg :
	```js
	sm.fadeOut(options);
	```
	- arguments (optional):
		- `targetValue` : __Number__ - The targeted value of the gain (between 0 and 1) where the fadeOut will stop. This defaults to 1.
		- `startTime` : __Number__ - Timestamp to define when the fading starts, in the same time coordinate system as the AudioContext _currentTime_ attribute. This defaults _currentTime_.


# License

Apache-2.0

See License file
