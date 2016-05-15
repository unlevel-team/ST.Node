"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SensorEngine = require('../nodeEngine/SensorsManager.js').SensorEngine;

var EventEmitter = require('events').EventEmitter;

var Cylon = require('cylon');

/**
 * ST Sensor Keyboard
 */

var STSensor_Keyboard = function (_SensorEngine) {
	_inherits(STSensor_Keyboard, _SensorEngine);

	function STSensor_Keyboard(config) {
		_classCallCheck(this, STSensor_Keyboard);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(STSensor_Keyboard).call(this, config));

		_this._CylonRobot = null;
		_this._CylonRobotState = "stop";

		return _this;
	}

	/**
  * Initialize
  */


	_createClass(STSensor_Keyboard, [{
		key: 'initialize',
		value: function initialize() {

			var stSensor = this;

			stSensor._CylonRobot = Cylon.robot({

				connections: {
					keyboard: { adaptor: 'keyboard' }
				},

				devices: {
					keyboard: { driver: 'keyboard' }
				},

				work: function work(my) {

					//			 
					//		    my.keyboard.on('a', function(key) {
					//		      stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, {"key":"a"});
					//		    });
					//		    my.keyboard.on('b', function(key) {
					//			      stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, {"key":"b"});
					//		    });

					my.keyboard.on("up", function () {
						if (stSensor._CylonRobotState != "working") {
							return;
						}
						console.log("UP!");
						stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, { "key": "up" });
					});

					my.keyboard.on("down", function () {
						if (stSensor._CylonRobotState != "working") {
							return;
						}
						console.log("DOWN!");
						stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, { "key": "down" });
					});

					my.keyboard.on("left", function () {
						if (stSensor._CylonRobotState != "working") {
							return;
						}
						console.log("LEFT!");
						stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, { "key": "left" });
					});

					my.keyboard.on("RIGHT", function () {
						if (stSensor._CylonRobotState != "working") {
							return;
						}
						console.log("RIGHT!");
						stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, { "key": "RIGHT" });
					});
				}

			});

			_get(Object.getPrototypeOf(STSensor_Keyboard.prototype), 'initialize', this).call(this);
			this._CylonRobotState = "ready";
		}
	}, {
		key: 'startEngine',
		value: function startEngine() {
			if (this._CylonRobotState == "ready") {
				this._CylonRobot.start();
			}

			this._CylonRobotState = "working";
			this.eventEmitter.emit(this.CONSTANTS.Events.SensorEngine_Start);
		}
	}, {
		key: 'stopEngine',
		value: function stopEngine() {
			//		this._CylonRobot.halt();
			//		Cylon.halt();
			this._CylonRobotState = "stop";
			this.eventEmitter.emit(this.CONSTANTS.Events.SensorEngine_Stop);
		}
	}]);

	return STSensor_Keyboard;
}(SensorEngine);

module.exports = STSensor_Keyboard;
//# sourceMappingURL=stSensor_Keyboard.js.map
