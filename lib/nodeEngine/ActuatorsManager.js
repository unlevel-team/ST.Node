"use strict";


let EventEmitter = require('events').EventEmitter;


/**
 * ActuatorsManager CONSTANTS
 */
const ActuatorsManager_CONSTANTS = {
		"Config" : {
			"type_Vactuator" : "vactuator",
			"type_Cylonjs" : "cylonjs"

		},
		
		"States" : {
			"State_Config" : "config",
			"State_Ready" : "ready",
			"State_Working" : "working",
			"State_Stop" : "stop"
		},
		
		"Events" : {
			"SensorEngine_Ready" : "SE Ready",
			
			"MainLoop_Tick" : "Main Loop",
			"MainLoop_Stop" : "Main Loop Stop",
			
			"ActuatorEngine_Start" : "AE start",
			"ActuatorEngine_Stop" : "AE stop",

			
			"ActuatorData" : "Actuator Data"
			
		},
		
		"Messages" : {
			"getActuatorsList" : "Get Actuators List",
			"ActuatorsList" : "Actuators List",
			"getActuatorInfo" : "Get Actuator Info",
			"ActuatorInfo" : "Actuator Info",
			"getActuatorOptions" : "Get Actuator Options",
			"ActuatorOptions" : "Actuator Options",
			
			"StartActuator" : "StartActuator",
			"ActuatorStarted" : "ActuatorStarted",
			"StopActuator" : "StopActuator",
			"ActuatorStopped" : "ActuatorStopped",
			
			"TurnOffActuators" : "TurnOffActuators"
		}
	};




/**
 * Actuator Engine
 */
class ActuatorEngine {
	
	constructor(config) {
		
		this.config = config;
		this._mainLoop = null;
		
		this.state = ActuatorsManager_CONSTANTS.States.State_Config;

		
		this.CONSTANTS = ActuatorsManager_CONSTANTS;
		
		this.eventEmitter = new EventEmitter();

	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let actuatorEngine = this;
		
		this.eventEmitter.on( actuatorEngine.CONSTANTS.Events.MainLoop_Stop, function() {
			clearInterval( actuatorEngine._mainLoop );
			actuatorEngine.state = actuatorEngine.CONSTANTS.States.State_Ready;
		});
		
		this.state = actuatorEngine.CONSTANTS.States.State_Ready;
	}
	
	
	/**
	 * Main loop
	 */
	mainLoop() {
	  let actuatorEngine = this;
	  
	  if ( actuatorEngine.state != actuatorEngine.CONSTANTS.States.State_Ready ) {
		  throw "Bad state";
	  }
	  
	  actuatorEngine.state = actuatorEngine.CONSTANTS.States.State_Working;
	  
	  actuatorEngine._mainLoop = setInterval(() => {
		  if (actuatorEngine.state == actuatorEngine.CONSTANTS.States.State_Working) {
			  actuatorEngine.eventEmitter.emit(actuatorEngine.CONSTANTS.Events.MainLoop_Tick);
		  } else {
			  actuatorEngine.eventEmitter.emit(actuatorEngine.CONSTANTS.Events.MainLoop_Stop);
		  }
	  }, actuatorEngine.config.loopTime);
	  
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
 * Actuator
 */
class Actuator {
	
	constructor(config) {
		this.config = config;
		this.eventEmitter = new EventEmitter();
		this.actuatorEngine = null;

	}
	
	
	initialize() {
		
		// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· \/ ···
		// Actuator Engine URL 
		if (this.config.options.actuatorEngineURL != undefined && 
				this.config.options.actuatorEngineURL != null) {
			
			let actuator = this;
			
			actuator._actuatorEngine = null;
			
			try {
				actuator._actuatorEngine = require(actuator.config.options.actuatorEngineURL);
				actuator.actuatorEngine = new actuator._actuatorEngine(actuator.config);
				actuator.actuatorEngine.initialize();
				
			} catch (e) {
				// TODO: handle exception
				  console.log('<EEE> Actuator.initialize');	// TODO REMOVE DEBUG LOG
				  console.log(e.message);	// TODO REMOVE DEBUG LOG
			}
		} 
		// ··· - ··· - ··· - ··· - ··· - ··· - ··· - ··· _ ··· - ··· - ··· - ··· _ ··· - ··· - ··· /\ ···
	}
	
}


/**
 * VActuator
 */
class VActuator extends Actuator {
	
	constructor(config) {
		super(config);
	}
	
}


/**
 * CylActuator
 */
class CylActuator extends Actuator {
	
	constructor(config) {
		super(config);
	}
	
}


/**
 * Actuators manager
 */
class ActuatorsManager {
	
	constructor() {
		
		this.actuatorsList = [];
		this.eventEmitter = new EventEmitter();
		
		this.CONSTANTS = ActuatorsManager_CONSTANTS;

		
		this.nodeCtrlSrv = null;
		
		this._Cylon = null;
	}
	
	
	/**
	 * Set NodeControlService
	 */
	setNodeControlService(nodeCtrlSrv) {
		this.nodeCtrlSrv = nodeCtrlSrv;
		
		let amng = this;
		
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message getActuatorsList
			this.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.getActuatorsList, function(msg){
			  console.log('<*> ActuatorsManager.Messages.getActuatorsList');	// TODO REMOVE DEBUG LOG
			  
			  var _i = 0;
			  var response = {};
			  response.numActuators = amng.actuatorsList.length;
			  response.actuators = [];
			  
			  for (_i = 0; _i < amng.actuatorsList.length; _i++) {
				  
				var actuator = {
					"actuatorID" : amng.actuatorsList[_i].config.id,
					"type" : amng.actuatorsList[_i].config.type
				};
				
				response.actuators.push( actuator );
			  }
	
			  amng.nodeCtrlSrv.socket.emit( amng.CONSTANTS.Messages.ActuatorsList, response );
		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
				
		
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message StartActuator
			this.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.StartActuator, function(msg){
				
			  console.log('<*> ActuatorsManager.Messages.StartActuator');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG
//				  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

			  var response = {};
			  response.result = null;
			  
			  try {
				
				  let _actuatorSearch = amng.getActuatorByID(msg.actuatorID);
				  
				  if (_actuatorSearch.STactuator != null) {
					  _actuatorSearch.STactuator.actuatorEngine.startEngine();
					  response.result = "OK";
				  } else {
					  
					  console.log("Not found!!!");	// TODO REMOVE DEBUG LOG
					throw "Actuator not found.";  
				  }

				} catch (e) {
					// TODO: handle exception
					response.result = "ERROR";
					response.error = e.message;
					
				  console.log('<EEE> ActuatorsManager.Messages.StartActuator ERROR');	// TODO REMOVE DEBUG LOG
				  console.log(response);	// TODO REMOVE DEBUG LOG
				};
			  

		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
		
		
		// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		// Message StopActuator
		this.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.StopActuator, function(msg){
		  console.log('<*> ActuatorsManager.Messages.StopActuator');	// TODO REMOVE DEBUG LOG
		  console.log(msg);	// TODO REMOVE DEBUG LOG
//					  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

		  var response = {};
		  response.result = null;
		  
		  try {
			
			  let _actuatorSearch = amng.getActuatorByID(msg.actuatorID);
			  
			  if (_actuatorSearch.STactuator != null) {
				  _actuatorSearch.STactuator.actuatorEngine.stopEngine();
				  response.result = "OK";
			  } else {
				  
				  console.log("Not found!!!");	// TODO REMOVE DEBUG LOG
				throw "Actuator not found.";  
			  }

			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e.message;
				
			  console.log('<EEE> ActuatorsManager.Messages.StopActuator ERROR');	// TODO REMOVE DEBUG LOG
			  console.log(response);	// TODO REMOVE DEBUG LOG
			};
		  

		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
		
		
		// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		// Message TurnOffActuators
		this.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.TurnOffActuators, function(msg){
		  console.log('<*> ActuatorsManager.Messages.TurnOffActuators');	// TODO REMOVE DEBUG LOG
		  console.log(msg);	// TODO REMOVE DEBUG LOG
//					  console.log(' <·> ' + msg);	// TODO REMOVE DEBUG LOG

		  var response = {};
		  response.result = null;
		  
		  try {
			
			  amng.turnOffActuators();

			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e.message;
				
			  console.log('<EEE> ActuatorsManager.Messages.TurnOffActuators ERROR');	// TODO REMOVE DEBUG LOG
			  console.log(response);	// TODO REMOVE DEBUG LOG
			};
		  

		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
		
	}
	
	
	/**
	 * Add Actuator
	 */
	addActuator(config) {
		
		var stActuator = null;
		
		switch ( config.type ) {
			case this.CONSTANTS.Config.type_Vactuator:
				stActuator = new VActuator(config);
				break;
				
			case this.CONSTANTS.Config.type_Cylonjs:
				stActuator = new CylActuator(config);
				if (this._Cylon == null) {
					this._Cylon = require('cylon');
				}
				break;
	
			default:
				stActuator = new Actuator(config);
				break;
		}
		
		stActuator.initialize();
		this.actuatorsList.push( stActuator );
	}
	
	
	/**
	 * Returns Actuator searched by ID
	 */
	getActuatorByID(actuatorID) {

		var actuator = null;
		var _i = 0;
		
		for (_i = 0; _i < this.actuatorsList.length; _i++) {
			if (this.actuatorsList[_i].config.id == actuatorID) {
				actuator = this.actuatorsList[_i];
				break;
			}
		}
		
		return {
			"STactuator": actuator,
			"position": _i
		}
	}
	
	/**
	 * Returns new ActuatorEngine
	 */
	static getActuatorEngine(config) {
		var actuatorEngine = new ActuatorEngine(config);
		return actuatorEngine;
	}
	
	
	/**
	 * Turn off actuators
	 */
	turnOffActuators() {
		
		var _i = 0;
		
		for (_i = 0; _i < this.actuatorsList.length; _i++) {
			if ( this.actuatorsList[_i].actuatorEngine != null ) {
				this.actuatorsList[_i].actuatorEngine.stopEngine();
			}
		}
		
		if (this._Cylon != null ) {
			this._Cylon.halt();
		}
		
		console.log('<*> ActuatorsManager.turnOffActuators');	// TODO REMOVE DEBUG LOG
	}
	
}


var ActuatorsManager_Lib = {
		"ActuatorsManager" : ActuatorsManager,
		"ActuatorEngine" : ActuatorEngine,
		"CONSTANTS" : ActuatorsManager_CONSTANTS
		
	}

module.exports = ActuatorsManager_Lib;