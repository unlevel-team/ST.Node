"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SensorEngine = require('../nodeEngine/SensorEngine.js');

var EventEmitter = require('events').EventEmitter;

/**
 * ST Sensor Dummy01
 */

var STSensor_Dummy01 = function (_SensorEngine) {
	_inherits(STSensor_Dummy01, _SensorEngine);

	function STSensor_Dummy01(config) {
		_classCallCheck(this, STSensor_Dummy01);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(STSensor_Dummy01).call(this, config));

		_this._lastTime = null;
		return _this;
	}

	/**
  * Initialize
  */


	_createClass(STSensor_Dummy01, [{
		key: 'initialize',
		value: function initialize() {

			var stSensor = this;
			stSensor._ticks = 0;

			// Map event MainLoop_Tick
			stSensor.eventEmitter.on(stSensor.CONSTANTS.Events.MainLoop_Tick, function () {

				stSensor._ticks++;
				if (stSensor._ticks >= stSensor.config.options.ticks) {

					stSensor._ticks = 0;

					// Emit event SensorData
					stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, { "ticks": stSensor.config.options.ticks });

					console.log('<*> STSensor_Dummy01.Events.SensorData'); // TODO REMOVE DEBUG LOG

					stSensor._lastTime = new Date().getTime();

					if (stSensor.config.options.showTime) {
						console.log(' <~~~> Time: ' + stSensor._lastTime); // TODO REMOVE DEBUG LOG
					}

					if (stSensor.config.options.showDeltaTime) {

						if (stSensor._deltaTimeRef !== undefined) {
							var deltaTime = stSensor._lastTime - stSensor._deltaTimeRef;
							console.log(' <~~~> DetalTime: ' + deltaTime); // TODO REMOVE DEBUG LOG
						}

						stSensor._deltaTimeRef = stSensor._lastTime;
					}
				}
			});

			_get(Object.getPrototypeOf(STSensor_Dummy01.prototype), 'initialize', this).call(this);
		}
	}, {
		key: 'startEngine',
		value: function startEngine() {

			var stSensor = this;

			stSensor.mainLoop();

			// Emit event SensorEngine_Start
			stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorEngine_Start);
		}
	}, {
		key: 'stopEngine',
		value: function stopEngine() {

			var stSensor = this;

			stSensor.stopMainLoop();

			// Emit event SensorEngine_Stop
			// for MainLoop_Stop
			stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorEngine_Stop);
		}

		/**
   * Get options
   */

	}, {
		key: 'getOptions',
		value: function getOptions() {

			var stSensor = this;
			var snsOptions = stSensor.config.options;

			var options = {
				"ticks": snsOptions.ticks,
				"showTime": snsOptions.showTime,
				"showDeltaTime": snsOptions.showDeltaTime
			};

			return options;
		}

		/**
   * Set options
   */

	}, {
		key: 'setOptions',
		value: function setOptions(options) {

			var stSensor = this;

			if (stSensor.state === stSensor.CONSTANTS.States.SEstate_Working) {
				throw "Bad sensor state.";
			}

			var actOptions = stSensor.config.options;

			if (options.ticks) {
				actOptions.ticks = options.ticks;
			}

			if (options.showTime !== undefined) {
				actOptions.showTime = options.showTime;
			}

			if (options.showDeltaTime !== undefined) {
				actOptions.showDeltaTime = options.showDeltaTime;
			}
		}
	}]);

	return STSensor_Dummy01;
}(SensorEngine);

module.exports = STSensor_Dummy01;
//# sourceMappingURL=stSensor_Dummy01.js.map
