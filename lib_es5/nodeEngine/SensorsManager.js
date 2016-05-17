"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events').EventEmitter;

var SensorEngine = require('./SensorEngine.js');

/**
 * SensorsManager CONSTANTS
 */
var SensorsManager_CONSTANTS = {
	"Config": {
		"type_Vsensor": "vsensor",
		"type_Cylonjs": "cylonjs"

	},

	"Events": {
		"SensorOptionsUpdated": "Sensor Options Updated"
	},

	"Messages": {
		"getSensorsList": "Get Sensors List",
		"SensorsList": "Sensors List",
		"getSensorInfo": "Get Sensor Info",
		"SensorInfo": "Sensor Info",
		"getSensorOptions": "Get Sensor Options",
		"setSensorOptions": "Set Sensor Options",
		"SensorOptions": "Sensor Options",
		"SensorOptionsUpdated": "Sensor Options Updated",

		"StartSensor": "StartSensor",
		"SensorStarted": "SensorStarted",
		"StopSensor": "StopSensor",
		"SensorStopped": "SensorStopped",

		"TurnOffSensors": "TurnOffSensors"

	}
};

/**
 * Sensor
 */

var Sensor = function () {
	function Sensor(config) {
		_classCallCheck(this, Sensor);

		this.config = config;
		this.eventEmitter = new EventEmitter();
		this.sensorEngine = null;
	}

	_createClass(Sensor, [{
		key: 'initialize',
		value: function initialize() {

			var sensor = this;

			// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· \/ ···
			// Sensor Engine URL
			if (sensor.config.options.sensorEngineURL != undefined && sensor.config.options.sensorEngineURL != null) {

				sensor._sensorEngine = null;

				try {
					sensor._sensorEngine = require(sensor.config.options.sensorEngineURL);
					sensor.sensorEngine = new sensor._sensorEngine(sensor.config);
					sensor.sensorEngine.initialize();
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> Sensor.initialize'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
					console.log(sensor.config); // TODO REMOVE DEBUG LOG
				}
			}
			// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· /\ ···
		}
	}]);

	return Sensor;
}();

/**
 * VSensor
 */


var VSensor = function (_Sensor) {
	_inherits(VSensor, _Sensor);

	function VSensor(config) {
		_classCallCheck(this, VSensor);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(VSensor).call(this, config));
	}

	return VSensor;
}(Sensor);

/**
 * CylSensor
 */


var CylSensor = function (_Sensor2) {
	_inherits(CylSensor, _Sensor2);

	function CylSensor(config) {
		_classCallCheck(this, CylSensor);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CylSensor).call(this, config));
	}

	return CylSensor;
}(Sensor);

/**
 * Sensors Manager
 */


var SensorsManager = function () {
	function SensorsManager() {
		_classCallCheck(this, SensorsManager);

		this.sensorList = [];
		this.eventEmitter = new EventEmitter();

		this.CONSTANTS = SensorsManager_CONSTANTS;

		this.nodeCtrlSrv = null;

		this._Cylon = null;
	}

	/**
  * Set NodeControlService
  */


	_createClass(SensorsManager, [{
		key: 'setNodeControlService',
		value: function setNodeControlService(nodeCtrlSrv) {

			var smng = this;

			if (smng.nodeCtrlSrv && smng.nodeCtrlSrv != null) {
				throw "Node control service exist.";
			}

			smng.nodeCtrlSrv = nodeCtrlSrv;
			var socket = nodeCtrlSrv.socket;

			// Map event SensorOptionsUpdated
			smng.eventEmitter.on(smng.CONSTANTS.Events.SensorOptionsUpdated, function (data) {

				console.log('<*> SensorsManager.Events.SensorOptionsUpdated'); // TODO REMOVE DEBUG LOG

				var sensor = data.sensor;

				socket.emit(smng.CONSTANTS.Messages.SensorOptionsUpdated, {
					"sensorID": sensor.config.id
				}); // Emit message SensorOptions
			});

			//		// Map event disconnect
			//		socket.on("disconnect", function(data){
			//			socket.removeAllListeners(smng.CONSTANTS.Messages.getSensorsList);
			//			socket.removeAllListeners(smng.CONSTANTS.Messages.getSensorOptions);
			//			socket.removeAllListeners(smng.CONSTANTS.Messages.setSensorOptions);
			//			socket.removeAllListeners(smng.CONSTANTS.Messages.StartSensor);
			//			socket.removeAllListeners(smng.CONSTANTS.Messages.StopSensor);
			//			socket.removeAllListeners(smng.CONSTANTS.Messages.TurnOffSensors);
			//		});

			// Map Message getSensorsList
			socket.on(smng.CONSTANTS.Messages.getSensorsList, function (msg) {
				smng._msg_getSensorsList(msg);
			});

			// Map Message getSensorOptions
			socket.on(smng.CONSTANTS.Messages.getSensorOptions, function (msg) {
				smng._msg_getSensorOptions(msg, socket);
			});

			// Map Message setSensorOptions
			socket.on(smng.CONSTANTS.Messages.setSensorOptions, function (msg) {
				smng._msg_setSensorOptions(msg);
			});

			// Map Message StartSensor
			socket.on(smng.CONSTANTS.Messages.StartSensor, function (msg) {
				smng._msg_StartSensor(msg);
			});

			// Map Message StopSensor
			socket.on(smng.CONSTANTS.Messages.StopSensor, function (msg) {
				smng._msg_StopSensor(msg);
			});

			// Map Message TurnOffSensors
			socket.on(smng.CONSTANTS.Messages.TurnOffSensors, function (msg) {
				smng._msg_TurnOffSensors(msg);
			});
		}

		/**
   * Add Sensor
   */

	}, {
		key: 'addSensor',
		value: function addSensor(config) {
			var smng = this;
			var stSenstor = null;

			switch (config.type) {
				case smng.CONSTANTS.Config.type_Vsensor:
					stSenstor = new VSensor(config);
					break;

				case smng.CONSTANTS.Config.type_Cylonjs:
					stSenstor = new CylSensor(config);
					if (smng._Cylon == null) {
						smng._Cylon = require('cylon');
					}
					break;

				default:
					stSenstor = new Sensor(config);
					break;
			}

			stSenstor.initialize();
			smng.sensorList.push(stSenstor);
		}

		/**
   * Returns Sensor searched by ID
   */

	}, {
		key: 'getSensorByID',
		value: function getSensorByID(sensorID) {

			var smng = this;

			var sensor = null;
			var _i = 0;

			for (_i = 0; _i < smng.sensorList.length; _i++) {
				if (smng.sensorList[_i].config.id == sensorID) {
					sensor = smng.sensorList[_i];
					break;
				}
			}

			return {
				"STsensor": sensor,
				"position": _i
			};
		}

		/**
   * Returns new SensorEngine
   */

	}, {
		key: 'turnOffSensors',


		/**
   * Turn off sensors
   */
		value: function turnOffSensors() {

			var smng = this;
			var snsList = smng.sensorList;

			snsList.forEach(function (sns_, _i) {
				if (sns_.sensorEngine != null) {
					sns_.sensorEngine.stopEngine();
				}
			});

			if (smng._Cylon != null) {
				smng._Cylon.halt();
			}

			console.log('<*> SensorsManager.turnOffSensors'); // TODO REMOVE DEBUG LOG
		}

		/**
   * Get sensor options
   */

	}, {
		key: 'getSensorOptions',
		value: function getSensorOptions(sns) {

			var snsOptions = {
				"loopTime": sns.config.loopTime,
				"sensorEngineURL": sns.config.options.sensorEngineURL

			};

			if (sns.sensorEngine != null) {
				snsOptions.engineOptions = sns.sensorEngine.getOptions();
			}

			return snsOptions;
		}

		/**
   * Set sensor options
   */

	}, {
		key: 'setSensorOptions',
		value: function setSensorOptions(sensor, options) {

			var smng = this;

			if (sensor.sensorEngine && sensor.sensorEngine.state == sensor.sensorEngine.CONSTANTS.States.SEstate_Working) {
				throw "Bad sensor state.";
			}

			if (options.loopTime) {
				sensor.config.loopTime = options.loopTime;
			}

			if (options.engineOptions) {
				sensor.sensorEngine.setOptions(options.engineOptions);
			}

			smng.eventEmitter.emit(smng.CONSTANTS.Events.SensorOptionsUpdated, { "sensor": sensor });
		}

		/**
   * Message getSensorsList
   */

	}, {
		key: '_msg_getSensorsList',
		value: function _msg_getSensorsList(msg) {

			var smng = this;

			console.log('<*> SensorsManager.Messages.getSensorsList'); // TODO REMOVE DEBUG LOG

			var response = {};
			response.numSensors = smng.sensorList.length;
			response.sensors = [];

			smng.sensorList.forEach(function (sns_, _i) {

				var sensor = {
					"sensorID": sns_.config.id,
					"type": sns_.config.type,
					"state": sns_.config.state
				};

				response.sensors.push(sensor);
			});

			smng.nodeCtrlSrv.socket.emit(smng.CONSTANTS.Messages.SensorsList, response);
		}

		/**
   * Message StartSensor
   */

	}, {
		key: '_msg_StartSensor',
		value: function _msg_StartSensor(msg) {

			var smng = this;

			console.log('<*> SensorsManager.Messages.StartSensor'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG
			//		  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

			var response = {};
			response.result = null;

			try {

				var _sensorSearch = smng.getSensorByID(msg.sensorID);

				if (_sensorSearch.STsensor != null) {
					_sensorSearch.STsensor.sensorEngine.startEngine();
					response.result = "OK";
				} else {

					console.log("Not found!!!"); // TODO REMOVE DEBUG LOG

					throw "Sensor not found.";
				}
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> SensorsManager.Messages.StartSensor ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};

			//			msg.result = response.result;
		}

		/**
   * Message StopSensor
   */

	}, {
		key: '_msg_StopSensor',
		value: function _msg_StopSensor(msg) {

			var smng = this;

			console.log('<*> SensorsManager.Messages.StopSensor'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG
			//		  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

			var response = {};
			response.result = null;

			try {

				var _sensorSearch = smng.getSensorByID(msg.sensorID);

				if (_sensorSearch.STsensor != null) {
					_sensorSearch.STsensor.sensorEngine.stopEngine();
					response.result = "OK";
				} else {
					throw "Sensor not found.";
				}
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> SensorsManager.Messages.StopSensor ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message TurnOffSensors
   */

	}, {
		key: '_msg_TurnOffSensors',
		value: function _msg_TurnOffSensors(msg) {

			var smng = this;

			console.log('<*> SensorsManager.Messages.TurnOffSensors'); // TODO REMOVE DEBUG LOG

			var response = {};
			response.result = null;

			try {

				smng.turnOffSensors();
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> SensorsManager.Messages.TurnOffSensors ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message getSensorOptions
   */

	}, {
		key: '_msg_getSensorOptions',
		value: function _msg_getSensorOptions(msg, socket) {

			var smng = this;

			console.log('<*> SensorsManager.Messages.getSensorOptions'); // TODO REMOVE DEBUG LO

			var sensorID = msg.sensorID;

			var response = {
				"sensorID": sensorID
			};

			try {

				var sensorSearch = smng.getSensorByID(sensorID);
				if (sensorSearch.STsensor == null) {
					throw "Sensor not found.";
				}

				var sensor = sensorSearch.STsensor;

				response.options = smng.getSensorOptions(sensor);

				socket.emit(smng.CONSTANTS.Messages.SensorOptions, response); // Emit message SensorOptions
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> SensorsManager.Messages.getSensorOptions ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}

		/**
   * Message setSensorOptions
   */

	}, {
		key: '_msg_setSensorOptions',
		value: function _msg_setSensorOptions(msg) {

			var smng = this;

			console.log('<*> SensorsManager.Messages.setSensorOptions'); // TODO REMOVE DEBUG LO
			console.log(' <·> ' + msg); // TODO REMOVE DEBUG LO

			var sensorID = msg.sensorID;
			var options = msg.options;

			var response = {
				"sensorID": sensorID
			};

			try {

				var sensorSearch = smng.getSensorByID(sensorID);
				if (sensorSearch.STsensor == null) {
					throw "Sensor not found.";
				}

				var sensor = sensorSearch.STsensor;

				smng.setSensorOptions(sensor, options);
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;

				console.log('<EEE> SensorsManager.Messages.setSensorOptions ERROR'); // TODO REMOVE DEBUG LOG
				console.log(response); // TODO REMOVE DEBUG LOG
			};
		}
	}], [{
		key: 'getSensorEngine',
		value: function getSensorEngine(config) {
			var sensorEngine = new SensorEngine(config);
			return sensorEngine;
		}
	}]);

	return SensorsManager;
}();

var SensorsManager_Lib = {
	"SensorsManager": SensorsManager,
	"SensorEngine": SensorEngine,
	"CONSTANTS": SensorsManager_CONSTANTS

};

module.exports = SensorsManager_Lib;
//# sourceMappingURL=SensorsManager.js.map
