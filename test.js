var smoothfade = require('./index.js');

window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();

var osc = context.createOscillator();
var gain = context.createGain();

osc.connect(gain);
gain.connect(context.destination);

var sm = smoothfade(context, gain, {
	'startValue': 1, //optional, default = 1
	'fadeLength': 2, //optional, default 10
	'type': 'exponential' // optional, default = 'linear'
});

window.addEventListener('load', function(){
	document.getElementById('fadein').addEventListener('click', function(){
		sm.fadeIn();
	});
	document.getElementById('fadeout').addEventListener('click', function(){
		sm.fadeOut({
			'targetValue': 0.3
		});
	});
	osc.start(0);
});

