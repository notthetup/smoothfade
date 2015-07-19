# smoothfade


## API
```
var sm = smoothfade(context, gain, {
	'startValue': 1, //optional, default = 1
	'fadeLength': 2, //optional, default 10
	'type': 'linear' // optional, default = 'linear'
});

sm.fadeIn({
	'endTime': endTime,
	'startTime': startTime, // optional, default = now
	'targetValue': targetvalue //optional, default = 1
});

sm.fadeOut({
	'endTime': endTime,
	'startTime': startTime, // optional, default = now
	'targetValue': targetvalue //optional, default = 0.00001
});
```
