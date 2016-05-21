"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActuatorEngine = require('../nodeEngine/ActuatorEngine.js');

var EventEmitter = require('events').EventEmitter;

/**
 * ST Actuator Dummy01
 */

var STActuator_Dummy01 = function (_ActuatorEngine) {
	_inherits(STActuator_Dummy01, _ActuatorEngine);

	function STActuator_Dummy01(config) {
		_classCallCheck(this, STActuator_Dummy01);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(STActuator_Dummy01).call(this, config));

		_this._lastTime = null;
		_this._lastActuatorDATA = {
			"time": null,
			"data": null
		};
		return _this;
	}

	/**
  * Initialize
  */


	_createClass(STActuator_Dummy01, [{
		key: 'initialize',
		value: function initialize() {

			var stActuator = this;
			var actOptions = stActuator.config.options;

			stActuator._ticks = 0;

			// Map event MainLoop_Tick
			stActuator.eventEmitter.on(stActuator.CONSTANTS.Events.MainLoop_Tick, function () {

				stActuator._ticks++;

				if (stActuator._ticks >= actOptions.ticks) {

					stActuator._ticks = 0;
					stActuator._lastTime = new Date().getTime();

					if (actOptions.showTime) {
						console.log(' <···> Time: ' + stActuator._lastTime); // TODO REMOVE DEBUG LOG
					}

					if (actOptions.showDeltaTime) {
						if (stActuator._deltaTimeRef != undefined) {
							var deltaTime = stActuator._lastTime - stActuator._deltaTimeRef;
							console.log(' <···> DetalTime: ' + deltaTime); // TODO REMOVE DEBUG LOG
						}
						stActuator._deltaTimeRef = stActuator._lastTime;
					}
				}
			});

			// Map event ActuatorData
			stActuator.eventEmitter.on(stActuator.CONSTANTS.Events.ActuatorData, function (data) {
				stActuator._event_ActuatorData(data);
			});

			_get(Object.getPrototypeOf(STActuator_Dummy01.prototype), 'initialize', this).call(this);
		}

		/**
   * Start engine
   */

	}, {
		key: 'startEngine',
		value: function startEngine() {

			var stActuator = this;
			stActuator.mainLoop();

			stActuator.eventEmitter.emit(stActuator.CONSTANTS.Events.ActuatorEngine_Start);
		}

		/**
   * Stop engine
   */

	}, {
		key: 'stopEngine',
		value: function stopEngine() {

			var stActuator = this;
			stActuator.stopMainLoop();

			// MainLoop_Stop
			stActuator.eventEmitter.emit(stActuator.CONSTANTS.Events.ActuatorEngine_Stop);
		}

		/**
   * Get options
   */

	}, {
		key: 'getOptions',
		value: function getOptions() {

			var stActuator = this;
			var actOptions = stActuator.config.options;

			var options = {
				"ticks": actOptions.ticks,
				"showTime": actOptions.showTime,
				"showDeltaTime": actOptions.showDeltaTime
			};

			return options;
		}

		/**
   * Set options
   */

	}, {
		key: 'setOptions',
		value: function setOptions(options) {

			var stActuator = this;

			if (stActuator.state == stActuator.CONSTANTS.States.State_Working) {
				throw "Bad actuator state.";
			}

			var actOptions = stActuator.config.options;

			if (options.ticks) {
				actOptions.ticks = options.ticks;
			}

			if (options.showTime != undefined) {
				actOptions.showTime = options.showTime;
			}

			if (options.showDeltaTime != undefined) {
				actOptions.showDeltaTime = options.showDeltaTime;
			}
		}

		/**
   * Event ActuatorData
   */

	}, {
		key: '_event_ActuatorData',
		value: function _event_ActuatorData(data) {

			var stActuator = this;

			stActuator._lastActuatorDATA.data = data;
			stActuator._lastActuatorDATA.time = new Date().getTime();

			console.log('<*> STActuator_Dummy01.Events.ActuatorData'); // TODO REMOVE DEBUG LOG
			console.log(stActuator._lastActuatorDATA); // TODO REMOVE DEBUG LOG
		}
	}]);

	return STActuator_Dummy01;
}(ActuatorEngine);

module.exports = STActuator_Dummy01;
//# sourceMappingURL=stActuator_Dummy01.js.map
