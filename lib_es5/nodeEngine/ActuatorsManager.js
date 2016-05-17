"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events').EventEmitter;

var ActuatorEngine = require('./ActuatorEngine.js');

/**
 * ActuatorsManager CONSTANTS
 */
var ActuatorsManager_CONSTANTS = {
	"Config": {
		"type_Vactuator": "vactuator",
		"type_Cylonjs": "cylonjs"

	},
	"Events": {
		"ActuatorOptionsUpdated": "Actuator Options Updated"
	},

	"Messages": {
		"getActuatorsList": "Get Actuators List",
		"ActuatorsList": "Actuators List",
		"getActuatorInfo": "Get Actuator Info",
		"ActuatorInfo": "Actuator Info",
		"getActuatorOptions": "Get Actuator Options",
		"setActuatorOptions": "Set Actuator Options",
		"ActuatorOptions": "Actuator Options",
		"ActuatorOptionsUpdated": "Actuator Options Updated",

		"StartActuator": "StartActuator",
		"ActuatorStarted": "ActuatorStarted",
		"StopActuator": "StopActuator",
		"ActuatorStopped": "ActuatorStopped",

		"TurnOffActuators": "TurnOffActuators"
	}
};

/**
 * Actuator
 */

var Actuator = function () {
	function Actuator(config) {
		_classCallCheck(this, Actuator);

		this.config = config;
		this.eventEmitter = new EventEmitter();
		this.actuatorEngine = null;
	}

	_createClass(Actuator, [{
		key: 'initialize',
		value: function initialize() {

			// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· \/ ···
			// Actuator Engine URL
			if (this.config.options.actuatorEngineURL != undefined && this.config.options.actuatorEngineURL != null) {

				var actuator = this;

				actuator._actuatorEngine = null;

				try {
					actuator._actuatorEngine = require(actuator.config.options.actuatorEngineURL);
					actuator.actuatorEngine = new actuator._actuatorEngine(actuator.config);
					actuator.actuatorEngine.initialize();
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> Actuator.initialize'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			}
			// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· /\ ···
		}
	}]);

	return Actuator;
}();

/**
 * VActuator
 */


var VActuator = function (_Actuator) {
	_inherits(VActuator, _Actuator);

	function VActuator(config) {
		_classCallCheck(this, VActuator);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(VActuator).call(this, config));
	}

	return VActuator;
}(Actuator);

/**
 * CylActuator
 */


var CylActuator = function (_Actuator2) {
	_inherits(CylActuator, _Actuator2);

	function CylActuator(config) {
		_classCallCheck(this, CylActuator);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CylActuator).call(this, config));
	}

	return CylActuator;
}(Actuator);

/**
 * Actuators manager
 */


var ActuatorsManager = function () {
	function ActuatorsManager() {
		_classCallCheck(this, ActuatorsManager);

		this.actuatorsList = [];
		this.eventEmitter = new EventEmitter();

		this.CONSTANTS = ActuatorsManager_CONSTANTS;

		this.nodeCtrlSrv = null;

		this._Cylon = null;
	}

	/**
  * Set NodeControlService
  */


	_createClass(ActuatorsManager, [{
		key: 'setNodeControlService',
		value: function setNodeControlService(nodeCtrlSrv) {

			var amng = this;
			amng.nodeCtrlSrv = nodeCtrlSrv;
			var socket = nodeCtrlSrv.socket;

			// Map event ActuatorOptionsUpdated
			amng.eventEmitter.on(amng.CONSTANTS.Events.ActuatorOptionsUpdated, function (data) {

				console.log('<*> ActuatorsManager.Events.ActuatorOptionsUpdated'); // TODO REMOVE DEBUG LOG

				var actuator = data.actuator;

				socket.emit(amng.CONSTANTS.Messages.ActuatorOptionsUpdated, {
					"actuatorID": actuator.config.id
				}); // Emit message ActuatorOptions
			});

			// Map Message getActuatorsList
			amng.nodeCtrlSrv.socket.on(amng.CONSTANTS.Messages.getActuatorsList, function (msg) {
				amng._msg_getActuatorsList(msg);
			});

			// Message getActuatorOptions
			amng.nodeCtrlSrv.socket.on(amng.CONSTANTS.Messages.getActuatorOptions, function (msg) {
				amng._msg_getActuatorOptions(msg);
			});

			// Message setActuatorOptions
			amng.nodeCtrlSrv.socket.on(amng.CONSTANTS.Messages.setActuatorOptions, function (msg) {
				amng._msg_setActuatorOptions(msg);
			});

			// Message StartActuator
			amng.nodeCtrlSrv.socket.on(amng.CONSTANTS.Messages.StartActuator, function (msg) {
				amng._msg_StartActuator(msg);
			});

			// Message StopActuator
			amng.nodeCtrlSrv.socket.on(amng.CONSTANTS.Messages.StopActuator, function (msg) {
				amng._msg_StopActuator(msg);
			});

			// Message TurnOffActuators
			amng.nodeCtrlSrv.socket.on(amng.CONSTANTS.Messages.TurnOffActuators, function (msg) {
				amng._msg_TurnOffActuators(msg);
			});
		}

		/**
   * Add Actuator
   */

	}, {
		key: 'addActuator',
		value: function addActuator(config) {

			var amng = this;
			var stActuator = null;

			switch (config.type) {
				case amng.CONSTANTS.Config.type_Vactuator:
					stActuator = new VActuator(config);
					break;

				case amng.CONSTANTS.Config.type_Cylonjs:
					stActuator = new CylActuator(config);
					if (amng._Cylon == null) {
						amng._Cylon = require('cylon');
					}
					break;

				default:
					stActuator = new Actuator(config);
					break;
			}

			stActuator.initialize();
			amng.actuatorsList.push(stActuator);
		}

		/**
   * Returns Actuator searched by ID
   */

	}, {
		key: 'getActuatorByID',
		value: function getActuatorByID(actuatorID) {

			var amng = this;
			var actuator = null;
			var _i = 0;

			for (_i = 0; _i < amng.actuatorsList.length; _i++) {
				if (amng.actuatorsList[_i].config.id == actuatorID) {
					actuator = amng.actuatorsList[_i];
					break;
				}
			}

			return {
				"STactuator": actuator,
				"position": _i
			};
		}

		/**
   * Returns new ActuatorEngine
   */

	}, {
		key: 'turnOffActuators',


		/**
   * Turn off actuators
   */
		value: function turnOffActuators() {

			var amng = this;
			var actList = amng.actuatorsList;

			actList.forEach(function (act_, _i) {
				if (act_.actuatorEngine != null) {
					act_.actuatorEngine.stopEngine();
				}
			});

			if (amng._Cylon != null) {
				amng._Cylon.halt();
			}

			console.log('<*> ActuatorsManager.turnOffActuators'); // TODO REMOVE DEBUG LOG
		}

		/**
   * Get actuator options
   */

	}, {
		key: 'getActuatorOptions',
		value: function getActuatorOptions(act) {

			var actOptions = {
				"loopTime": act.config.loopTime,
				"actuatorEngineURL": act.config.options.actuatorEngineURL

			};

			if (act.actuatorEngine != null) {
				actOptions.engineOptions = act.actuatorEngine.getOptions();
			}

			return actOptions;
		}

		/**
   * Set actuator options
   */

	}, {
		key: 'setActuatorOptions',
		value: function setActuatorOptions(act, options) {

			var amng = this;

			if (act.actuatorEngine && act.actuatorEngine.state == act.actuatorEngine.CONSTANTS.States.State_Working) {
				throw "Bad actuator state.";
			}

			if (options.loopTime) {
				act.config.loopTime = options.loopTime;
			}

			if (options.engineOptions) {
				act.actuatorEngine.setOptions(options.engineOptions);
			}

			amng.eventEmitter.emit(amng.CONSTANTS.Events.ActuatorOptionsUpdated, { "actuator": act });
		}

		/**
   * Message getActuatorsList
   */

	}, {
		key: '_msg_getActuatorsList',
		value: function _msg_getActuatorsList(msg) {

			var amng = this;
			var socket = amng.nodeCtrlSrv.socket;

			console.log('<*> ActuatorsManager.Messages.getActuatorsList'); // TODO REMOVE DEBUG LOG

			var response = {};
			response.numActuators = amng.actuatorsList.length;
			response.actuators = [];

			amng.actuatorsList.forEach(function (act_, _i) {

				var actuator = {
					"actuatorID": act_.config.id,
					"type": act_.config.type
				};

				response.actuators.push(actuator);
			});

			socket.emit(amng.CONSTANTS.Messages.ActuatorsList, response); // Emit message ActuatorsList
		}

		/**
   * Message getActuatorOptions
   */

	}, {
		key: '_msg_getActuatorOptions',
		value: function _msg_getActuatorOptions(msg) {

			var amng = this;
			var socket = amng.nodeCtrlSrv.socket;

			var actuatorID = msg.actuatorID;

			var response = {
				"actuatorID": actuatorID
			};

			console.log('<*> ActuatorsManager.Messages.getActuatorOptions'); // TODO REMOVE DEBUG LOG

			try {

				var actuatorSearch = amng.getActuatorByID(actuatorID);
				if (actuatorSearch.STactuator == null) {
					throw "Actuator not found.";
				}

				var actuator = actuatorSearch.STactuator;

				response.options = amng.getActuatorOptions(actuator);

				socket.emit(amng.CONSTANTS.Messages.ActuatorOptions, response); // Emit message ActuatorOptions
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> ActuatorsManager.Messages.getActuatorOptions ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message setActuatorOptions
   */

	}, {
		key: '_msg_setActuatorOptions',
		value: function _msg_setActuatorOptions(msg) {

			var amng = this;
			var socket = amng.nodeCtrlSrv.socket;

			var actuatorID = msg.actuatorID;
			var options = msg.options;

			var response = {
				"actuatorID": actuatorID
			};

			console.log('<*> ActuatorsManager.Messages.setActuatorOptions'); // TODO REMOVE DEBUG LOG

			try {

				var actuatorSearch = amng.getActuatorByID(actuatorID);
				if (actuatorSearch.STactuator == null) {
					throw "Actuator not found.";
				}

				var actuator = actuatorSearch.STactuator;

				amng.setActuatorOptions(actuator, options);
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> ActuatorsManager.Messages.setActuatorOptions ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message StartActuator
   */

	}, {
		key: '_msg_StartActuator',
		value: function _msg_StartActuator(msg) {

			var amng = this;

			console.log('<*> ActuatorsManager.Messages.StartActuator'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			var response = {};
			response.result = null;

			try {

				var _actuatorSearch = amng.getActuatorByID(msg.actuatorID);

				if (_actuatorSearch.STactuator != null) {
					_actuatorSearch.STactuator.actuatorEngine.startEngine();
					response.result = "OK";
				} else {

					console.log("Not found!!!"); // TODO REMOVE DEBUG LOG
					throw "Actuator not found.";
				}
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> ActuatorsManager.Messages.StartActuator ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message StopActuator
   */

	}, {
		key: '_msg_StopActuator',
		value: function _msg_StopActuator(msg) {

			var amng = this;

			console.log('<*> ActuatorsManager.Messages.StopActuator'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			var response = {};
			response.result = null;

			try {

				var _actuatorSearch = amng.getActuatorByID(msg.actuatorID);

				if (_actuatorSearch.STactuator != null) {
					_actuatorSearch.STactuator.actuatorEngine.stopEngine();
					response.result = "OK";
				} else {

					console.log("Not found!!!"); // TODO REMOVE DEBUG LOG
					throw "Actuator not found.";
				}
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> ActuatorsManager.Messages.StopActuator ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message TurnOffActuators
   */

	}, {
		key: '_msg_TurnOffActuators',
		value: function _msg_TurnOffActuators(msg) {

			var amng = this;

			console.log('<*> ActuatorsManager.Messages.TurnOffActuators'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			var response = {};
			response.result = null;

			try {

				amng.turnOffActuators();
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> ActuatorsManager.Messages.TurnOffActuators ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}
	}], [{
		key: 'getActuatorEngine',
		value: function getActuatorEngine(config) {
			var actuatorEngine = new ActuatorEngine(config);
			return actuatorEngine;
		}
	}]);

	return ActuatorsManager;
}();

var ActuatorsManager_Lib = {
	"ActuatorsManager": ActuatorsManager,
	"ActuatorEngine": ActuatorEngine,
	"CONSTANTS": ActuatorsManager_CONSTANTS

};

module.exports = ActuatorsManager_Lib;
//# sourceMappingURL=ActuatorsManager.js.map
