"use strict";

module.exports = function (context, gainNode, _options) {
  _options = _options || {};

  if (!gainNode || !context) {
    console.error("'gainNode' and 'context' arguments can't be null");
    return;
  }

  _options.startValue = _options.hasOwnProperty('startValue') ? _options.startValue : 1;
  _options.type = _options.hasOwnProperty('type') ? _options.type : 'linear';
  _options.fadeLength = _options.hasOwnProperty('fadeLength') ? _options.fadeLength : 10;

  var _currentStartValue = 0;
  var _currentTargetValue = _options.startValue;
  var _currentStartTime = 0;
  var _currentEndTime = context.currentTime;
  var _currDirection = 'fadein';

  function isFading(time) {
    return _currentEndTime > time;
  }

  function cauculateInterpolationAt(time) {
    console.log("calculating interpolation");
    if (time <= _currentStartTime) {
      return _currentStartValue;
    } else if (time >= _currentEndTime) {
      return _currentTargetValue;
    } else {
      if (_options.type === 'linear') {
        return _currentStartValue + (_currentTargetValue - _currentStartValue) * ((time - _currentStartTime) / (_currentEndTime - _currentStartTime));
      }
    }
  }

  function calculateEndTime(startTime, direction) {
    console.log("calculating end time");
    if (!isFading()) {
      return startTime + _options.fadeLength;
    } else {
      if (_currDirection === direction) {
        return _currentEndTime;
      } else {
        if (_options.type === 'linear') {
          var timeTillNow = (context.currentTime - _currentStartTime);
          return startTime + timeTillNow;
        }
      }
    }
  }

  return {
    valueAt: function (time) {
      if (!time) {
        time = context.currentTime;
      }

      if (!isFading(time)) {
        return _currentTargetValue;
      } else {
        return cauculateInterpolationAt(time);
      }
    },

    fadeIn: function (_options) {
      _options = _options || {};
      _options.startTime = _options.hasOwnProperty('startTime') ? _options.startTime : context.currentTime;
      _options.targetValue = _options.hasOwnProperty('targetValue') ? _options.targetValue : 1;

      if (!_options.hasOwnProperty('endTime')) {
        _options.endTime = calculateEndTime(_options.startTime, 'fadein');
      }

      var startvalue = cauculateInterpolationAt(_options.startTime);
      gainNode.gain.cancelScheduledValues(_options.startTime);
      gainNode.gain.setValueAtTime(startvalue, _options.startTime);
      gainNode.gain.linearRampToValueAtTime(_options.targetValue, _options.endTime);

      _currentStartValue = startvalue;
      _currentTargetValue = _options.targetValue;
      _currentStartTime = _options.startTime;
      _currentEndTime = _options.endTime;
      _currDirection = 'fadein';

    },

    fadeOut: function (_options) {
      _options = _options || {};
      _options.startTime = _options.hasOwnProperty('startTime') ? _options.startTime : context.currentTime;
      _options.targetValue = _options.hasOwnProperty('targetValue') ? _options.targetValue : 0.00001;

      if (!_options.hasOwnProperty('endTime')) {
        _options.endTime = calculateEndTime(_options.startTime, 'fadeout');
      }

      var startvalue = cauculateInterpolationAt(_options.startTime);
      gainNode.gain.cancelScheduledValues(_options.startTime);
      gainNode.gain.setValueAtTime(startvalue, _options.startTime);
      gainNode.gain.linearRampToValueAtTime(_options.targetValue, _options.endTime);

      console.log(context.currentTime,":: Fading out to ", _options.targetValue, "starting from", _options.startTime ,"to", _options.endTime);

      _currentStartValue = startvalue;
      _currentTargetValue = _options.targetValue;
      _currentStartTime = _options.startTime;
      _currentEndTime = _options.endTime;
      _currDirection = 'fadeout';

    }
  };
};
