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

			"ActuatorOptionsUpdated" : "Actuator Options Updated",
			
			
			"ActuatorData" : "Actuator Data"
			
		},
		
		"Messages" : {
			"getActuatorsList" : "Get Actuators List",
			"ActuatorsList" : "Actuators List",
			"getActuatorInfo" : "Get Actuator Info",
			"ActuatorInfo" : "Actuator Info",
			"getActuatorOptions" : "Get Actuator Options",
			"setActuatorOptions" : "Set Actuator Options",
			"ActuatorOptions" : "Actuator Options",
			"ActuatorOptionsUpdated" : "Actuator Options Updated",

			
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
		
		actuatorEngine.eventEmitter.on( actuatorEngine.CONSTANTS.Events.MainLoop_Stop, function() {
			clearInterval( actuatorEngine._mainLoop );
			actuatorEngine.state = actuatorEngine.CONSTANTS.States.State_Ready;
		});
		
		actuatorEngine.state = actuatorEngine.CONSTANTS.States.State_Ready;
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
	
	
	getOptions() {
		return {};
	}
	
	
	setOptions(options) {
		
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
				  console.log(e);	// TODO REMOVE DEBUG LOG
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
		
		let amng = this;
		amng.nodeCtrlSrv = nodeCtrlSrv;
		let socket = nodeCtrlSrv.socket;
		
		
		// Map event ActuatorOptionsUpdated
		amng.eventEmitter.on(amng.CONSTANTS.Events.ActuatorOptionsUpdated, function(data){
			
			console.log('<*> ActuatorsManager.Events.ActuatorOptionsUpdated');	// TODO REMOVE DEBUG LOG

			let actuator = data.actuator;
			
			socket.emit(amng.CONSTANTS.Messages.ActuatorOptionsUpdated, {
				"actuatorID": actuator.config.id
			});	// Emit message ActuatorOptions
			
		});
		
		
		  // Map Message getActuatorsList
			amng.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.getActuatorsList, function(msg){
				amng._msg_getActuatorsList(msg);
		  });
			
			
		  // Message getActuatorOptions
			amng.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.getActuatorOptions, function(msg){
				amng._msg_getActuatorOptions(msg);
		  });
				
		
		  // Message setActuatorOptions
			amng.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.setActuatorOptions, function(msg){
				amng._msg_setActuatorOptions(msg);
		  });
		
		  // Message StartActuator
			amng.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.StartActuator, function(msg){
				amng._msg_StartActuator(msg);
		  });
			
			
		// Message StopActuator
		amng.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.StopActuator, function(msg){
			amng._msg_StopActuator(msg);
		  });
		
		
		// Message TurnOffActuators
		amng.nodeCtrlSrv.socket.on( amng.CONSTANTS.Messages.TurnOffActuators, function(msg){
			amng._msg_TurnOffActuators(msg);
		  });
		
	}
	
	
	/**
	 * Add Actuator
	 */
	addActuator(config) {
		
		let amng = this;
		let stActuator = null;
		
		switch ( config.type ) {
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
		amng.actuatorsList.push( stActuator );
	}
	
	
	/**
	 * Returns Actuator searched by ID
	 */
	getActuatorByID(actuatorID) {
		
		let amng = this;
		let actuator = null;
		let _i = 0;
		
		for (_i = 0; _i < amng.actuatorsList.length; _i++) {
			if (amng.actuatorsList[_i].config.id == actuatorID) {
				actuator = amng.actuatorsList[_i];
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
		let actuatorEngine = new ActuatorEngine(config);
		return actuatorEngine;
	}
	
	
	/**
	 * Turn off actuators
	 */
	turnOffActuators() {
		
		let amng = this;
		let actList = amng.actuatorsList;
		
		actList.forEach(function(act_, _i) {
			if ( act_.actuatorEngine != null ) {
				act_.actuatorEngine.stopEngine();
			}
		});
		
		if (amng._Cylon != null ) {
			amng._Cylon.halt();
		}
		
		console.log('<*> ActuatorsManager.turnOffActuators');	// TODO REMOVE DEBUG LOG
	}
	
	
	/**
	 * Get actuator options
	 */
	getActuatorOptions(act){
		
		let actOptions = {
				"loopTime" : act.config.loopTime,
				"actuatorEngineURL": act.config.options.actuatorEngineURL
				
		};
		
		if ( act.actuatorEngine != null ) {
			actOptions.engineOptions = act.actuatorEngine.getOptions();
		}
		
		
		return actOptions;
	}
	
	
	/**
	 * Set actuator options
	 */
	setActuatorOptions(act, options){
		
		let amng = this;
		
		if (act.actuatorEngine && 
				act.actuatorEngine.state == act.actuatorEngine.CONSTANTS.States.State_Working) {
			throw "Bad actuator state.";
		}
		
		if (options.loopTime) {
			act.config.loopTime = options.loopTime;
		}
		
		if (options.engineOptions) {
			act.actuatorEngine.setOptions(options.engineOptions);
		}
		
		amng.eventEmitter.emit(amng.CONSTANTS.Events.ActuatorOptionsUpdated, {"actuator": act});
	}
	
	
	/**
	 * Message getActuatorsList
	 */
	_msg_getActuatorsList(msg) {
		
		let amng = this;
		let socket = amng.nodeCtrlSrv.socket;
		
		  
		console.log('<*> ActuatorsManager.Messages.getActuatorsList');	// TODO REMOVE DEBUG LOG
	  
		  let response = {};
		  response.numActuators = amng.actuatorsList.length;
		  response.actuators = [];
		  
		  amng.actuatorsList.forEach(function(act_, _i) {
		  	
			  let actuator = {
						"actuatorID" : act_.config.id,
						"type" : act_.config.type
					};
					
			  response.actuators.push( actuator );
			  
		  });
	  
		  socket.emit( amng.CONSTANTS.Messages.ActuatorsList, response );	// Emit message ActuatorsList
	}
	
	
	/**
	 * Message getActuatorOptions
	 */
	_msg_getActuatorOptions(msg) {
		
		let amng = this;
		let socket = amng.nodeCtrlSrv.socket;
		
		
		  let actuatorID = msg.actuatorID;
		  
		  let response = {
				  "actuatorID" : actuatorID
		  };
		  
			console.log('<*> ActuatorsManager.Messages.getActuatorOptions');	// TODO REMOVE DEBUG LOG

		  
		  try {
			  
			  let actuatorSearch = amng.getActuatorByID(actuatorID);
			  if(actuatorSearch.STactuator == null){
				  throw "Actuator not found.";
			  }
			
			  let actuator = actuatorSearch.STactuator;
			  
			  response.options = amng.getActuatorOptions(actuator);
			  
			  socket.emit(amng.CONSTANTS.Messages.ActuatorOptions, response);	// Emit message ActuatorOptions
	
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;
	
				console.log('<EEE> ActuatorsManager.Messages.getActuatorOptions ERROR');	// TODO REMOVE DEBUG LOG
				console.log(response);	// TODO REMOVE DEBUG LOG
			};
		
	}
	
	
	/**
	 * Message setActuatorOptions
	 */
	_msg_setActuatorOptions(msg) {
		
		let amng = this;
		let socket = amng.nodeCtrlSrv.socket;
		
		
		  let actuatorID = msg.actuatorID;
		  let options = msg.options;
		  
		  let response = {
				  "actuatorID" : actuatorID
		  };
		  
			console.log('<*> ActuatorsManager.Messages.setActuatorOptions');	// TODO REMOVE DEBUG LOG

		  
		  try {
			  
			  let actuatorSearch = amng.getActuatorByID(actuatorID);
			  if(actuatorSearch.STactuator == null){
				  throw "Actuator not found.";
			  }
			
			  let actuator = actuatorSearch.STactuator;
			  
			  amng.setActuatorOptions(actuator, options);
	
			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;
	
				console.log('<EEE> ActuatorsManager.Messages.setActuatorOptions ERROR');	// TODO REMOVE DEBUG LOG
				console.log(response);	// TODO REMOVE DEBUG LOG
			};
		
	}
	
	
	/**
	 * Message StartActuator
	 */
	_msg_StartActuator(msg) {
		
		let amng = this;
		
	  console.log('<*> ActuatorsManager.Messages.StartActuator');	// TODO REMOVE DEBUG LOG
	  console.log(msg);	// TODO REMOVE DEBUG LOG

	  let response = {};
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
			response.error = e;
			
		  console.log('<EEE> ActuatorsManager.Messages.StartActuator ERROR');	// TODO REMOVE DEBUG LOG
		  console.log(response);	// TODO REMOVE DEBUG LOG
		};
		
	}
	
	
	/**
	 * Message StopActuator
	 */
	_msg_StopActuator(msg) {
		
		let amng = this;
		
	  console.log('<*> ActuatorsManager.Messages.StopActuator');	// TODO REMOVE DEBUG LOG
	  console.log(msg);	// TODO REMOVE DEBUG LOG

	  let response = {};
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
			response.error = e;
			
		  console.log('<EEE> ActuatorsManager.Messages.StopActuator ERROR');	// TODO REMOVE DEBUG LOG
		  console.log(response);	// TODO REMOVE DEBUG LOG
		};
		
	}
	
	
	/**
	 * Message TurnOffActuators
	 */
	_msg_TurnOffActuators(msg) {
		
		let amng = this;
		
		  console.log('<*> ActuatorsManager.Messages.TurnOffActuators');	// TODO REMOVE DEBUG LOG
		  console.log(msg);	// TODO REMOVE DEBUG LOG

		  let response = {};
		  response.result = null;
		  
		  try {
			
			  amng.turnOffActuators();

			} catch (e) {
				// TODO: handle exception
				response.result = "ERROR";
				response.error = e;
				
			  console.log('<EEE> ActuatorsManager.Messages.TurnOffActuators ERROR');	// TODO REMOVE DEBUG LOG
			  console.log(response);	// TODO REMOVE DEBUG LOG
			};
			
	}
	
}


let ActuatorsManager_Lib = {
		"ActuatorsManager" : ActuatorsManager,
		"ActuatorEngine" : ActuatorEngine,
		"CONSTANTS" : ActuatorsManager_CONSTANTS
		
	}

module.exports = ActuatorsManager_Lib;