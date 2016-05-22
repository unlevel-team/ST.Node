"use strict";

/**
 * COMSystem library
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataMessage = require('./DataChannel.js').DataMessage;

var ThingBind = require('./COMSystem.js').ThingBind;
var COMSystem = require('./COMSystem.js').COMSystem;

var COMSystem_Morse_CONSTANTS = {
	"Config": {
		"Version": "Morse",

		"Role_Server": "Server",
		"Role_Node": "Node"
	}
};

/**
 * ThingBind
 */

var TBind_Morse = function (_ThingBind) {
	_inherits(TBind_Morse, _ThingBind);

	function TBind_Morse(type, source, target, options) {
		_classCallCheck(this, TBind_Morse);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TBind_Morse).call(this, type, source, target, options));

		_this._bindFunction = null;
		return _this;
	}

	/**
  * Bind DC to Sensor
  */


	_createClass(TBind_Morse, [{
		key: '_init_DCtoSensor',
		value: function _init_DCtoSensor() {

			var tbind = this;

			var dc = tbind.target;
			var sensor = tbind.source;

			if (tbind.options == undefined || tbind.options.bindID == undefined) {
				throw "This bind requires an ID.";
			}

			tbind.bindID = tbind.CONSTANTS.Config.BindType_DCtoSensor + tbind.options.bindID; // Set bind ID

			// Define bind function
			tbind._bindFunction = function (data) {

				if (tbind.state != tbind.CONSTANTS.States.State_Working) {
					return;
				}

				if (tbind.options.bindFunction) {
					tbind.options.bindFunction(data);
				}

				var msg = new DataMessage(data);
				msg.typeExtra = tbind.CONSTANTS.Config.Version;
				msg._Morse = {
					"bindID": tbind.bindID
				};

				dc.sendMessage(msg);
			};

			// Map event SensorData
			sensor.eventEmitter.on(sensor.CONSTANTS.Events.SensorData, tbind._bindFunction);

			tbind.state = tbind.CONSTANTS.States.State_Ready;
		}

		/**
   * Bind DC to Actuator
   */

	}, {
		key: '_init_DCtoActuator',
		value: function _init_DCtoActuator() {

			var tbind = this;
			var dc = tbind.source;
			var actuator = tbind.target;

			if (tbind.options == undefined || tbind.options.bindID == undefined) {
				throw "This bind requires an ID.";
			}

			if (tbind.options.comSYS == undefined) {
				throw "This bind requires a comSYS.";
			}

			var comSYS = tbind.options.comSYS;

			tbind.bindID = tbind.CONSTANTS.Config.BindType_DCtoActuator + tbind.options.bindID; // Set bind ID

			// Define bind function
			tbind._bindFunction = function (data) {

				if (tbind.state != tbind.CONSTANTS.States.State_Working) {
					return;
				}

				if (tbind.options.bindFunction) {
					tbind.options.bindFunction(data);
				}

				actuator.emit(actuator.CONSTANTS.Events.ActuatorData, data); // Emit event ActuatorData
			};

			comSYS.bindDC(dc); // Bind Communications system to DC

			// Map event `bindID`
			comSYS.eventEmitter.on(tbind.bindID, tbind._bindFunction);
		}

		/**
   * Start Bind
   */

	}, {
		key: 'start',
		value: function start() {

			var tbind = this;

			if (tbind.state != tbind.CONSTANTS.States.State_Ready) {
				throw "Bad Bind state";
			}

			_get(Object.getPrototypeOf(TBind_Morse.prototype), 'start', this).call(this);
		}

		/**
   * Stop Bind
   */

	}, {
		key: 'stop',
		value: function stop() {

			var tbind = this;

			if (tbind.state != tbind.CONSTANTS.States.State_Working) {
				throw "Bad Bind state";
			}

			_get(Object.getPrototypeOf(TBind_Morse.prototype), 'stop', this).call(this);
		}

		/**
   * Unbind
   */

	}, {
		key: 'unbind',
		value: function unbind() {

			var tbind = this;

			switch (tbind.type) {

				case tbind.CONSTANTS.Config.BindType_DCtoSensor:

					var sensor = tbind.target;

					// UnMap event SensorData
					sensor.eventEmitter.removeListener(sensor.CONSTANTS.Events.SensorData, tbind._bindFunction);
					break;

				case tbind.CONSTANTS.Config.BindType_DCtoActuator:

					var comSYS = tbind.options.comSYS;

					// UnMap event `bindID`
					comSYS.eventEmitter.removeListener(tbind.bindID, tbind._bindFunction);
					break;

				default:
					break;

			}

			_get(Object.getPrototypeOf(TBind_Morse.prototype), 'unbind', this).call(this);
		}
	}]);

	return TBind_Morse;
}(ThingBind);

/**
 * Communications System
 */


var COMSystem_Morse = function (_COMSystem) {
	_inherits(COMSystem_Morse, _COMSystem);

	function COMSystem_Morse(config) {
		_classCallCheck(this, COMSystem_Morse);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(COMSystem_Morse).call(this, config));

		_this2.MorseCONSTANTS = COMSystem_Morse_CONSTANTS;

		_this2.CONSTANTS.Config.Version = COMSystem_Morse_CONSTANTS.Config.Version;

		return _this2;
	}

	_createClass(COMSystem_Morse, [{
		key: 'initialize',
		value: function initialize() {

			_get(Object.getPrototypeOf(COMSystem_Morse.prototype), 'initialize', this).call(this);

			var comSYS = this;
			var _config = comSYS.config;

			if (_config.role == undefined) {
				throw "role is required.";
			}

			switch (_config.role) {

				case comSYS.MorseCONSTANTS.Config.Role_Node:
					comSYS._init_RoleNode();
					break;

				case comSYS.MorseCONSTANTS.Config.Role_Server:

					break;

				default:
					throw "Bad Role.";
					break;
			}
		}

		/**
   * Initialize Node role
   */

	}, {
		key: '_init_RoleNode',
		value: function _init_RoleNode() {

			var comSYS = this;
			var _config = comSYS.config;

			if (_config.sensorManager == undefined) {
				throw "sensorManager is required.";
			}

			if (_config.actuatorsManager == undefined) {
				throw "actuatorsManager is required.";
			}
		}

		/**
   * Bind data channel
   */

	}, {
		key: 'bindDC',
		value: function bindDC(dc) {

			var comSYS = this;

			if (dc.config._comSYS_Morse != undefined && dc.config._comSYS_Morse != null) {
				return;
			}

			dc.config._comSYS_Morse = true;

			// Map event MessageReceived
			dc.eventEmitter.on(dc.CONSTANTS.Events.MessageReceived, comSYS._DC_Message);
		}

		/**
   * Unbind data channel
   */

	}, {
		key: 'unbindDC',
		value: function unbindDC(dc) {

			var comSYS = this;

			if (dc.config._comSYS_Morse == undefined || dc.config._comSYS_Morse == null) {
				return;
			}

			// UnMap event SensorData
			dc.eventEmitter.removeListener(dc.CONSTANTS.Events.MessageReceived, comSYS._DC_Message);

			dc.config._comSYS_Morse = null;
		}

		/**
   * Data channel message
   */

	}, {
		key: '_DC_Message',
		value: function _DC_Message(msg) {

			var comSYS = this;

			var messages = msg.filter(function (_msg, _i) {
				if (_msg.typeExtra != undefined && _msg.typeExtra == comSYS.CONSTANTS.Config.Version) {
					return true;
				}
			});

			messages.forEach(function (_msg, _i) {
				comSYS.eventEmitter.emit(_msg._Morse.bindID, _msg);
			});
		}
	}]);

	return COMSystem_Morse;
}(COMSystem);
//# sourceMappingURL=COMsys_Morse.js.map
