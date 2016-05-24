"use strict";

/**
 * SensorEngine
 * 
 * Generic process for a Sensor
 * 
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events').EventEmitter;

/**
 * SensorEngine CONSTANTS
 */
var SensorEngine_CONSTANTS = {

	"States": {
		"SEstate_Config": "config",
		"SEstate_Ready": "ready",
		"SEstate_Working": "working",
		"SEstate_Stop": "stop"
	},

	"Events": {
		"MainLoop_Tick": "Main Loop",
		"MainLoop_Stop": "Main Loop Stop",

		"SensorEngine_Start": "SE start",
		"SensorEngine_Stop": "SE stop",

		"SensorData": "Sensor Data"

	}

};

/**
 * Sensor Engine
 */

var SensorEngine = function () {
	function SensorEngine(config) {
		_classCallCheck(this, SensorEngine);

		this.config = config;
		this._mainLoop = null;

		this.CONSTANTS = SensorEngine_CONSTANTS;

		this.state = this.CONSTANTS.States.SEstate_Config;

		this.eventEmitter = new EventEmitter();
	}

	/**
  * Initialize
  */


	_createClass(SensorEngine, [{
		key: "initialize",
		value: function initialize() {

			var sensorEngine = this;

			// Map event MainLoop_Stop
			sensorEngine.eventEmitter.on(sensorEngine.CONSTANTS.Events.MainLoop_Stop, function () {
				clearInterval(sensorEngine._mainLoop);
				sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Ready;
			});

			sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Ready;
		}

		/**
   * Main loop
   */

	}, {
		key: "mainLoop",
		value: function mainLoop() {

			var sensorEngine = this;

			if (sensorEngine.state != sensorEngine.CONSTANTS.States.SEstate_Ready) {
				throw "Bad state";
			}

			sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Working;

			sensorEngine._mainLoop = setInterval(function () {
				if (sensorEngine.state == sensorEngine.CONSTANTS.States.SEstate_Working) {
					sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Tick); // Emit event MainLoop_Tick
				} else {
						sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Stop); // Emit event MainLoop_Stop
					}
			}, sensorEngine.config.loopTime);
		}

		/**
   * Stop main loop
   */

	}, {
		key: "stopMainLoop",
		value: function stopMainLoop() {
			var sensorEngine = this;
			sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Stop); // Emit event MainLoop_Stop
		}
	}, {
		key: "startEngine",
		value: function startEngine() {}
	}, {
		key: "stopEngine",
		value: function stopEngine() {}
	}, {
		key: "getOptions",
		value: function getOptions() {
			return {};
		}
	}, {
		key: "setOptions",
		value: function setOptions(options) {}
	}]);

	return SensorEngine;
}();

module.exports = SensorEngine;
//# sourceMappingURL=SensorEngine.js.map
