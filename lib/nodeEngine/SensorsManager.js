"use strict";


let EventEmitter = require('events').EventEmitter;


let SensorEngine = require('./SensorEngine.js');


/**
 * SensorsManager CONSTANTS
 */
const SensorsManager_CONSTANTS = {
		"Config" : {
			"type_Vsensor" : "vsensor",
			"type_Cylonjs" : "cylonjs"

		},
		
		"Events" : {
			"SensorOptionsUpdated" : "Sensor Options Updated",
		},
		
		"Messages" : {
			"getSensorsList" : "Get Sensors List",
			"SensorsList" : "Sensors List",
			"getSensorInfo" : "Get Sensor Info",
			"SensorInfo" : "Sensor Info",
			"getSensorOptions" : "Get Sensor Options",
			"setSensorOptions" : "Set Sensor Options",
			"SensorOptions" : "Sensor Options",
			"SensorOptionsUpdated" : "Sensor Options Updated",
			
			"StartSensor" : "StartSensor",
			"SensorStarted" : "SensorStarted",
			"StopSensor" : "StopSensor",
			"SensorStopped" : "SensorStopped",
			
			"TurnOffSensors" : "TurnOffSensors"

		}
	};


/**
 * Sensor
 */
class Sensor {
	
	constructor(config) {
		
		this.config = config;
		this.eventEmitter = new EventEmitter();
		this.sensorEngine = null;

	}
	
	initialize() {
		
		let sensor = this;
		
		// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· \/ ···
		// Sensor Engine URL 
		if (sensor.config.options.sensorEngineURL != undefined && 
				sensor.config.options.sensorEngineURL != null) {
			
			sensor._sensorEngine = null;
			
			try {
				sensor._sensorEngine = require(sensor.config.options.sensorEngineURL);
				sensor.sensorEngine = new sensor._sensorEngine(sensor.config);
				sensor.sensorEngine.initialize();
				
			} catch (e) {
				// TODO: handle exception
				  console.log('<EEE> Sensor.initialize');	// TODO REMOVE DEBUG LOG
				  console.log(e);	// TODO REMOVE DEBUG LOG
				  console.log(sensor.config);	// TODO REMOVE DEBUG LOG

			}
		} 
		// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· /\ ···

		
	}
}


/**
 * VSensor
 */
class VSensor extends Sensor {
	
	constructor(config){
		super(config);
	}
}


/**
 * CylSensor
 */
class CylSensor extends Sensor {
	
	constructor(config){
		super(config);
	}
}


/**
 * Sensors Manager
 */
class SensorsManager {
	
	constructor() {
		
		this.sensorList = [];
		this.eventEmitter = new EventEmitter();
		
		this.CONSTANTS = SensorsManager_CONSTANTS;

		
		this.nodeCtrlSrv = null;
		
		this._Cylon = null;
	}
	
	
	/**
	 * Set NodeControlService
	 */
	setNodeControlService(nodeCtrlSrv) {
	
		let smng = this;
		
		if (smng.nodeCtrlSrv && 
				smng.nodeCtrlSrv != null) {
			throw "Node control service exist.";
		}
		
		smng.nodeCtrlSrv = nodeCtrlSrv;
		let socket = nodeCtrlSrv.socket;
		
		
		// Map event SensorOptionsUpdated
		smng.eventEmitter.on(smng.CONSTANTS.Events.SensorOptionsUpdated, function(data){
			
			console.log('<*> SensorsManager.Events.SensorOptionsUpdated');	// TODO REMOVE DEBUG LOG

			let sensor = data.sensor;
			
			socket.emit(smng.CONSTANTS.Messages.SensorOptionsUpdated, {
				"sensorID": sensor.config.id
			});	// Emit message SensorOptions
			
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
			socket.on( smng.CONSTANTS.Messages.getSensorsList, function(msg){
				smng._msg_getSensorsList(msg);
		  });
			
			
		  // Map Message getSensorOptions
			socket.on( smng.CONSTANTS.Messages.getSensorOptions, function(msg){
				smng._msg_getSensorOptions(msg, socket);
		  });
			
		  // Map Message setSensorOptions
			socket.on( smng.CONSTANTS.Messages.setSensorOptions, function(msg){
				smng._msg_setSensorOptions(msg);
		  });
			
		  // Map Message StartSensor
			socket.on( smng.CONSTANTS.Messages.StartSensor, function(msg){
				smng._msg_StartSensor(msg);
		  });
			
			
		  // Map Message StopSensor
			socket.on( smng.CONSTANTS.Messages.StopSensor, function(msg){
				smng._msg_StopSensor(msg);
		  });

		
		  // Map Message TurnOffSensors
			socket.on( smng.CONSTANTS.Messages.TurnOffSensors, function(msg){
				smng._msg_TurnOffSensors(msg);
		  });
		
	}
	
	
	/**
	 * Add Sensor
	 */
	addSensor(config) {
		let smng = this;
		let stSenstor = null;
		
		switch ( config.type ) {
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
		smng.sensorList.push( stSenstor );
	}
	
	
	/**
	 * Returns Sensor searched by ID
	 */
	getSensorByID(sensorID) {

		let smng = this;
		
		let sensor = null;
		let _i = 0;
		
		for (_i = 0; _i < smng.sensorList.length; _i++) {
			if (smng.sensorList[_i].config.id == sensorID) {
				sensor = smng.sensorList[_i];
				break;
			}
		}
		
		return {
			"STsensor": sensor,
			"position": _i
		}
	}
	
	
	/**
	 * Returns new SensorEngine
	 */
	static getSensorEngine(config) {
		let sensorEngine = new SensorEngine(config);
		return sensorEngine;
	}
	

	/**
	 * Turn off sensors
	 */
	turnOffSensors() {
		
		let smng = this;
		let snsList = smng.sensorList;
		
		snsList.forEach(function(sns_, _i) {
			if ( sns_.sensorEngine != null ) {
				sns_.sensorEngine.stopEngine();
			}
		});
		
		if (smng._Cylon != null ) {
			smng._Cylon.halt();
		}
		
		console.log('<*> SensorsManager.turnOffSensors');	// TODO REMOVE DEBUG LOG
	}
	
	
	/**
	 * Get sensor options
	 */
	getSensorOptions(sns){
		
		let snsOptions = {
				"loopTime" : sns.config.loopTime,
				"sensorEngineURL": sns.config.options.sensorEngineURL
				
		};
		
		if ( sns.sensorEngine != null ) {
			snsOptions.engineOptions = sns.sensorEngine.getOptions();
		}
		
		
		return snsOptions;
	}
	
	
	/**
	 * Set sensor options
	 */
	setSensorOptions(sensor, options){
		
		let smng = this;
		
		if (sensor.sensorEngine && 
				sensor.sensorEngine.state == sensor.sensorEngine.CONSTANTS.States.SEstate_Working) {
			throw "Bad sensor state.";
		}
		
		if (options.loopTime) {
			sensor.config.loopTime = options.loopTime;
		}
		
		if (options.engineOptions) {
			sensor.sensorEngine.setOptions(options.engineOptions);
		}
		
		smng.eventEmitter.emit(smng.CONSTANTS.Events.SensorOptionsUpdated, {"sensor": sensor});
	}
	

	/**
	 * Message getSensorsList
	 */
	_msg_getSensorsList(msg) {
		
		let smng = this;
		
		console.log('<*> SensorsManager.Messages.getSensorsList');	// TODO REMOVE DEBUG LOG
		  
		  let response = {};
		  response.numSensors = smng.sensorList.length;
		  response.sensors = [];
		  
		  
		  smng.sensorList.forEach(function(sns_, _i) {
		  	
			let sensor = {
					"sensorID" : sns_.config.id,
					"type" : sns_.config.type,
					"state" : sns_.config.state
				};
			
			response.sensors.push( sensor );
		  });
		  
		  
		  smng.nodeCtrlSrv.socket.emit( smng.CONSTANTS.Messages.SensorsList, response );
		
	}
	
	
	/**
	 * Message StartSensor
	 */
	_msg_StartSensor(msg) {
		
		let smng = this;	
		
	  console.log('<*> SensorsManager.Messages.StartSensor');	// TODO REMOVE DEBUG LOG
	  console.log(msg);	// TODO REMOVE DEBUG LOG
//		  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

	  let response = {};
	  response.result = null;
	  
	  try {
		
		  let _sensorSearch = smng.getSensorByID(msg.sensorID);
		  
		  if (_sensorSearch.STsensor != null) {
			  _sensorSearch.STsensor.sensorEngine.startEngine();
			  response.result = "OK";
		  } else {
			  
		  console.log("Not found!!!");	// TODO REMOVE DEBUG LOG

			throw "Sensor not found.";  
		  }

		} catch (e) {
			// TODO: handle exception
			response.result = "ERROR";
			response.error = e;
			
		  console.log('<EEE> SensorsManager.Messages.StartSensor ERROR');	// TODO REMOVE DEBUG LOG
		  console.log(response);	// TODO REMOVE DEBUG LOG
		};
	  
		
//			msg.result = response.result;
		
	}
	
	
	/**
	 * Message StopSensor
	 */
	_msg_StopSensor(msg) {
		
		let smng = this;
		
		console.log('<*> SensorsManager.Messages.StopSensor');	// TODO REMOVE DEBUG LOG
		  console.log(msg);	// TODO REMOVE DEBUG LOG
//		  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG
		  
		  let response = {};
		  response.result = null;
		  
		  try {
			
			  let _sensorSearch = smng.getSensorByID(msg.sensorID);
			  
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

				console.log('<EEE> SensorsManager.Messages.StopSensor ERROR');	// TODO REMOVE DEBUG LOG
				console.log(response);	// TODO REMOVE DEBUG LOG
			};
		
	}
	
	
	/**
	 * Message TurnOffSensors
	 */
	_msg_TurnOffSensors(msg) {
		
	  let smng = this;
		
	  console.log('<*> SensorsManager.Messages.TurnOffSensors');	// TODO REMOVE DEBUG LOG
	  
	  let response = {};
	  response.result = null;
	  
	  try {
		
		  smng.turnOffSensors();

		} catch (e) {
			// TODO: handle exception
			response.result = "ERROR";
			response.error = e;

			console.log('<EEE> SensorsManager.Messages.TurnOffSensors ERROR');	// TODO REMOVE DEBUG LOG
			console.log(response);	// TODO REMOVE DEBUG LOG
		};
		
	}
	
	
	/**
	 * Message getSensorOptions
	 */
	_msg_getSensorOptions(msg, socket) {
		
		 let smng = this;
		
		  console.log('<*> SensorsManager.Messages.getSensorOptions');	// TODO REMOVE DEBUG LO
		  
		  let sensorID = msg.sensorID;
		  
		  let response = {
				  "sensorID" : sensorID
		  };
		  
		  try {
			  
			  let sensorSearch = smng.getSensorByID(sensorID);
			  if(sensorSearch.STsensor == null){
				  throw "Sensor not found.";
			  }
			
			  let sensor = sensorSearch.STsensor;
			  
			  response.options = smng.getSensorOptions(sensor);
			  
			  socket.emit(smng.CONSTANTS.Messages.SensorOptions, response);	// Emit message SensorOptions
	
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;
	
				console.log('<EEE> SensorsManager.Messages.getSensorOptions ERROR');	// TODO REMOVE DEBUG LOG
				console.log(response);	// TODO REMOVE DEBUG LOG
			};
		
	}
	
	
	/**
	 * Message setSensorOptions
	 */
	_msg_setSensorOptions(msg) {
		
		 let smng = this;
			
		  console.log('<*> SensorsManager.Messages.setSensorOptions');	// TODO REMOVE DEBUG LO
		  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LO

		  let sensorID = msg.sensorID;
		  let options = msg.options;
		  
		  let response = {
				  "sensorID" : sensorID
		  };
		  
		  try {
			  
			  let sensorSearch = smng.getSensorByID(sensorID);
			  if(sensorSearch.STsensor == null){
				  throw "Sensor not found.";
			  }
			
			  let sensor = sensorSearch.STsensor;
			  
			  smng.setSensorOptions(sensor, options);
			  
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;
	
				console.log('<EEE> SensorsManager.Messages.setSensorOptions ERROR');	// TODO REMOVE DEBUG LOG
				console.log(response);	// TODO REMOVE DEBUG LOG
			};
		  
		
	}
	
}



let SensorsManager_Lib = {
	"SensorsManager" : SensorsManager,
	"SensorEngine" : SensorEngine,
	"CONSTANTS" : SensorsManager_CONSTANTS
	
}

module.exports = SensorsManager_Lib;