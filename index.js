/* eslint-disable no-prototype-builtins */
'use strict';

module.exports = function ( context, gainNode, _globalOptions ) {
  _globalOptions = _globalOptions || {};

  if ( !gainNode || !context ) {
    throw new Error( 'gainNode and context arguments cannot be null' );
  }

  _globalOptions.startValue = _globalOptions.hasOwnProperty( 'startValue' ) ? _globalOptions.startValue : gainNode.gain.value;
  _globalOptions.type = _globalOptions.hasOwnProperty( 'type' ) ? _globalOptions.type : 'exponential';
  _globalOptions.fadeLength = _globalOptions.hasOwnProperty( 'fadeLength' ) ? _globalOptions.fadeLength : 10;

  var ALMOST_ZERO = 0.00001;

  var _currentStartValue = 0;
  var _currentTargetValue = _globalOptions.startValue;
  var _currentStartTime = 0;
  var _currentEndTime = context.currentTime;
  var _currDirection = '';
  var _debug = !!_globalOptions.debug;

  function isFading( time ) {
    return _currentEndTime > time;
  }

  function cauculateInterpolationAt( time ) {
    if ( _debug ) {
      console.log( 'calculating interpolation' );
    }
    if ( time <= _currentStartTime ) {
      return _currentStartValue;
    } else if ( time >= _currentEndTime ) {
      return _currentTargetValue;
    } else {
      if ( _globalOptions.type === 'linear' ) {
        return _currentStartValue + ( _currentTargetValue - _currentStartValue ) * ( ( time - _currentStartTime ) / ( _currentEndTime - _currentStartTime ) );
      } else if ( _globalOptions.type === 'exponential' ) {
        var exponent = ( ( time - _currentStartTime ) / ( _currentEndTime - _currentStartTime ) );
        return _currentStartValue * Math.pow( ( _currentTargetValue / _currentStartValue ), exponent );
      }
    }
  }

  function calculateEndTime( startTime, targetValue ) {
    if ( !isFading() ) {
      return startTime + _globalOptions.fadeLength;
    } else if ( targetValue === _currentStartValue ) {
      var timeTillNow = ( context.currentTime - _currentStartTime );
      if ( _debug ) {
        console.log( 'end time will be now +', timeTillNow );
      }
      return startTime + timeTillNow;
    } else {
      var startValue = cauculateInterpolationAt( startTime );
      var timeTaken = 0;
      if ( _globalOptions.type === 'linear' ) {
        var gradient = _globalOptions.fadeLength / ( ALMOST_ZERO - 1 );
        timeTaken = ( ( targetValue - startValue ) * gradient );
        if ( _debug ) {
          console.log( 'Time taken to go linearly from ', startValue, '-', targetValue, ' is ', timeTaken );
        }

      } else if ( _globalOptions.type === 'exponential' ) {
        var diff = Math.log( targetValue ) - Math.log( startValue );
        timeTaken = ( 10 / Math.log( ALMOST_ZERO ) * diff );
        if ( _debug ) {
          console.log( 'Time taken to go expoentially from ', startValue, '-', targetValue, ' is ', timeTaken );
        }
      }
      return startTime + timeTaken;
    }
  }

  return {
    valueAt: function ( time ) {
      if ( !time ) {
        time = context.currentTime;
      }

      if ( !isFading( time ) ) {
        return _currentTargetValue;
      } else {
        return cauculateInterpolationAt( time );
      }
    },

    fadeIn: function ( _options ) {
      if ( _currDirection === 'fadein' ) {
        return;
      }

      _options = _options || {};
      _options.startTime = _options.hasOwnProperty( 'startTime' ) ? _options.startTime : context.currentTime;
      _options.targetValue = _options.hasOwnProperty( 'targetValue' ) ? _options.targetValue : 1;

      if ( !_options.hasOwnProperty( 'endTime' ) ) {
        _options.endTime = calculateEndTime( _options.startTime, _options.targetValue );
      }

      var startvalue = cauculateInterpolationAt( _options.startTime );
      if ( _debug ) {
        console.log( 'Start value', startvalue );
      }
      gainNode.gain.cancelScheduledValues( _options.startTime );
      gainNode.gain.setValueAtTime( startvalue, _options.startTime );

      if ( _globalOptions.type === 'linear' ) {
        gainNode.gain.linearRampToValueAtTime( _options.targetValue, _options.endTime );
      } else if ( _globalOptions.type === 'exponential' ) {
        gainNode.gain.exponentialRampToValueAtTime( _options.targetValue, _options.endTime );
      }

      _currentStartValue = startvalue;
      _currentTargetValue = _options.targetValue;
      _currentStartTime = _options.startTime;
      _currentEndTime = _options.endTime;
      _currDirection = 'fadein';

    },

    fadeOut: function ( _options ) {
      if ( _currDirection === 'fadeout' ) {
        return;
      }

      _options = _options || {};
      _options.startTime = _options.hasOwnProperty( 'startTime' ) ? _options.startTime : context.currentTime;
      _options.targetValue = _options.hasOwnProperty( 'targetValue' ) ? _options.targetValue : ALMOST_ZERO;

      if ( !_options.hasOwnProperty( 'endTime' ) ) {
        _options.endTime = calculateEndTime( _options.startTime, _options.targetValue );
      }

      var startvalue = cauculateInterpolationAt( _options.startTime );
      if ( _debug ) {
        console.log( 'Start value', startvalue );
      }
      gainNode.gain.cancelScheduledValues( _options.startTime );
      gainNode.gain.setValueAtTime( startvalue, _options.startTime );

      if ( _globalOptions.type === 'linear' ) {
        gainNode.gain.linearRampToValueAtTime( _options.targetValue, _options.endTime );
      } else if ( _globalOptions.type === 'exponential' ) {
        gainNode.gain.exponentialRampToValueAtTime( _options.targetValue, _options.endTime );
      }

      if ( _debug ) {
        console.log( context.currentTime, ':: Fading out to ', _options.targetValue, 'starting from', _options.startTime, 'to', _options.endTime );
      }

      _currentStartValue = startvalue;
      _currentTargetValue = _options.targetValue;
      _currentStartTime = _options.startTime;
      _currentEndTime = _options.endTime;
      _currDirection = 'fadeout';

    }
  };
};
