var smoothfade = require('./index.js');
var sm;

window.addEventListener('load', function(){
	var fadeIn = document.getElementById('fadein');
	var fadeOut = document.getElementById('fadeout');
	document.getElementById('start').addEventListener('click', function () {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();

		var osc = context.createOscillator();
		var gain = context.createGain();

		osc.connect(gain);
		gain.connect(context.destination);

		sm = smoothfade(context, gain, {
			'startValue': 1, //optional, default = 1
			'fadeLength': 2, //optional, default 10
			'type': 'exponential' // optional, default = 'linear'
		});

		fadeIn.disabled = false;
		fadeOut.disabled = false;
		osc.start(0);
	});

	fadeIn.addEventListener('click', function(){
		if(sm) sm.fadeIn();
	});
	fadeOut.addEventListener('click', function(){
		if (sm) sm.fadeOut({
			'targetValue': 0.3
		});
	});
});

