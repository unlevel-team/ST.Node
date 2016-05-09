"use strict";


let EventEmitter = require('events').EventEmitter;


/**
 * SensorsManager CONSTANTS
 */
const SensorsManager_CONSTANTS = {
		"Config" : {
			"type_Vsensor" : "vsensor",
			"type_Cylonjs" : "cylonjs"

		},
		
		"States" : {
			"SEstate_Config" : "config",
			"SEstate_Ready" : "ready",
			"SEstate_Working" : "working",
			"SEstate_Stop" : "stop"
		},
		
		"Events" : {
			"SensorEngine_Ready" : "SE Ready",
			
			"MainLoop_Tick" : "Main Loop",
			"MainLoop_Stop" : "Main Loop Stop",
			
			"SensorEngine_Start" : "SE start",
			"SensorEngine_Stop" : "SE stop",

			
			"SensorData" : "Sensor Data"
			
		},
		
		"Messages" : {
			"getSensorsList" : "Get Sensors List",
			"SensorsList" : "Sensors List",
			"getSensorInfo" : "Get Sensor Info",
			"SensorInfo" : "Sensor Info",
			"getSensorOptions" : "Get Sensor Options",
			"SensorOptions" : "Sensor Options",
			
			"StartSensor" : "StartSensor",
			"SensorStarted" : "SensorStarted",
			"StopSensor" : "StopSensor",
			"SensorStopped" : "SensorStopped",
			
			"TurnOffSensors" : "TurnOffSensors"

		}
	};


/**
 * Sensor Engine
 */
class SensorEngine {
	
	constructor(config) {
		
		this.config = config;
		this._mainLoop = null;
		
		this.state = SensorsManager_CONSTANTS.States.SEstate_Config;

		
		this.CONSTANTS = SensorsManager_CONSTANTS;
		
		this.eventEmitter = new EventEmitter();

	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let sensorEngine = this;
		
		this.eventEmitter.on( sensorEngine.CONSTANTS.Events.MainLoop_Stop, function() {
			clearInterval( sensorEngine._mainLoop );
			sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Ready;
		});
		
		this.state = SensorsManager_CONSTANTS.States.SEstate_Ready;
	}
	
	
	/**
	 * Main loop
	 */
	mainLoop() {
	  let sensorEngine = this;
	  
	  if ( sensorEngine.state != sensorEngine.CONSTANTS.States.SEstate_Ready ) {
		  throw "Bad state";
	  }
	  
	  sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Working;
	  
	  sensorEngine._mainLoop = setInterval(() => {
		  if (sensorEngine.state == sensorEngine.CONSTANTS.States.SEstate_Working) {
			  sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Tick);
		  } else {
			  sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Stop);
		  }
	  }, sensorEngine.config.loopTime);
	  
	}
	
	/**
	 * Stop main loop
	 */
	stopMainLoop() {
		this.eventEmitter.emit(this.CONSTANTS.Events.MainLoop_Stop);
	}
	
	
	startEngine() {
		
		
	}
	
	
	stopEngine() {
		
	}
	
}


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
		
		// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· \/ ···
		// Sensor Engine URL 
		if (this.config.options.sensorEngineURL != undefined && 
				this.config.options.sensorEngineURL != null) {
			
			let sensor = this;
			
			sensor._sensorEngine = null;
			
			try {
				sensor._sensorEngine = require(sensor.config.options.sensorEngineURL);
				sensor.sensorEngine = new sensor._sensorEngine(sensor.config);
				sensor.sensorEngine.initialize();
				
			} catch (e) {
				// TODO: handle exception
				  console.log('<EEE> Sensor.initialize');	// TODO REMOVE DEBUG LOG
				  console.log(e.message);	// TODO REMOVE DEBUG LOG
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
		this.nodeCtrlSrv = nodeCtrlSrv;
		
		let smng = this;
		
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message getSensorsList
			this.nodeCtrlSrv.socket.on( smng.CONSTANTS.Messages.getSensorsList, function(msg){
			  console.log('<*> SensorsManager.Messages.getSensorsList');	// TODO REMOVE DEBUG LOG
			  
			  var _i = 0;
			  var response = {};
			  response.numSensors = smng.sensorList.length;
			  response.sensors = [];
			  
			  for (_i = 0; _i < smng.sensorList.length; _i++) {
				  
				var sensor = {
					"sensorID" : smng.sensorList[_i].config.id,
					"type" : smng.sensorList[_i].config.type,
					"state" : smng.sensorList[_i].config.state
				};
				
				response.sensors.push( sensor );
				
			  }

			  smng.nodeCtrlSrv.socket.emit( smng.CONSTANTS.Messages.SensorsList, response );

		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
			
			
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message StartSensor
			this.nodeCtrlSrv.socket.on( smng.CONSTANTS.Messages.StartSensor, function(msg){
			  console.log('<*> SensorsManager.Messages.StartSensor');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG
//			  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

			  var response = {};
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
					response.error = e.message;
					
				  console.log('<EEE> SensorsManager.Messages.StartSensor ERROR');	// TODO REMOVE DEBUG LOG
				  console.log(response);	// TODO REMOVE DEBUG LOG
				};
			  
				
//				msg.result = response.result;

		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
			
			
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message StopSensor
			this.nodeCtrlSrv.socket.on( smng.CONSTANTS.Messages.StopSensor, function(msg){
			  console.log('<*> SensorsManager.Messages.StopSensor');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG
//			  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG
			  
			  var response = {};
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
					response.error = e.message;

					console.log('<EEE> SensorsManager.Messages.StopSensor ERROR');	// TODO REMOVE DEBUG LOG
					console.log(response);	// TODO REMOVE DEBUG LOG
				};
			  
//				msg._done(response);


		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  

		
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message TurnOffSensors
			this.nodeCtrlSrv.socket.on( smng.CONSTANTS.Messages.TurnOffSensors, function(msg){
			  console.log('<*> SensorsManager.Messages.TurnOffSensors');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG
//				  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG
			  
			  var response = {};
			  response.result = null;
			  
			  try {
				
				  smng.turnOffSensors();

				} catch (e) {
					// TODO: handle exception
					response.result = "ERROR";
					response.error = e.message;

					console.log('<EEE> SensorsManager.Messages.TurnOffSensors ERROR');	// TODO REMOVE DEBUG LOG
					console.log(response);	// TODO REMOVE DEBUG LOG
				};
			  
//					msg._done(response);


		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
	}
	
	
	/**
	 * Add Sensor
	 */
	addSensor(config) {
		
		var stSenstor = null;
		
		switch ( config.type ) {
			case this.CONSTANTS.Config.type_Vsensor:
				stSenstor = new VSensor(config);
				break;
				
			case this.CONSTANTS.Config.type_Cylonjs:
				stSenstor = new CylSensor(config);
				if (this._Cylon == null) {
					this._Cylon = require('cylon');
				}
				break;
	
			default:
				stSenstor = new Sensor(config);
				break;
		}
		
		stSenstor.initialize();
		this.sensorList.push( stSenstor );
	}
	
	
	/**
	 * Returns Sensor searched by ID
	 */
	getSensorByID(sensorID) {

		var sensor = null;
		var _i = 0;
		
		for (_i = 0; _i < this.sensorList.length; _i++) {
			if (this.sensorList[_i].config.id == sensorID) {
				sensor = this.sensorList[_i];
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
		var sensorEngine = new SensorEngine(config);
		return sensorEngine;
	}
	

	/**
	 * Turn off sensors
	 */
	turnOffSensors() {
		
		var _i = 0;
		
		for (_i = 0; _i < this.sensorList.length; _i++) {
			if ( this.sensorList[_i].sensorEngine != null ) {
				this.sensorList[_i].sensorEngine.stopEngine();
			}
		}
		
		if (this._Cylon != null ) {
			this._Cylon.halt();
		}
		
		console.log('<*> SensorsManager.turnOffSensors');	// TODO REMOVE DEBUG LOG
	}
	
}



var SensorsManager_Lib = {
	"SensorsManager" : SensorsManager,
	"SensorEngine" : SensorEngine,
	"CONSTANTS" : SensorsManager_CONSTANTS
	
}

module.exports = SensorsManager_Lib;