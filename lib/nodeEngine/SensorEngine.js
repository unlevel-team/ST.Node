"use strict";

/**
 * SensorEngine
 * 
 * Generic process for a Sensor
 * 
 */

let EventEmitter = require('events').EventEmitter;




/**
 * SensorEngine CONSTANTS
 */
const SensorEngine_CONSTANTS = {
		
	"States" : {
		"SEstate_Config" : "config",
		"SEstate_Ready" : "ready",
		"SEstate_Working" : "working",
		"SEstate_Stop" : "stop"
	},
	
	
	"Events" : {
		"MainLoop_Tick" : "Main Loop",
		"MainLoop_Stop" : "Main Loop Stop",
		
		"SensorEngine_Start" : "SE start",
		"SensorEngine_Stop" : "SE stop",
		
		"SensorData" : "Sensor Data"
		
	}
		
};



/**
 * Sensor Engine
 */
class SensorEngine {
	
	constructor(config) {
		
		this.config = config;
		this._mainLoop = null;
		
		this.CONSTANTS = SensorEngine_CONSTANTS;
		
		
		this.state = this.CONSTANTS.States.SEstate_Config;
		
		
		this.eventEmitter = new EventEmitter();

	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let sensorEngine = this;
		
		// Map event MainLoop_Stop
		sensorEngine.eventEmitter.on( sensorEngine.CONSTANTS.Events.MainLoop_Stop, function() {
			clearInterval( sensorEngine._mainLoop );
			sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Ready;
		});
		
		sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Ready;
	}
	
	
	/**
	 * Main loop
	 */
	mainLoop() {
		
	  let sensorEngine = this;
	  
	  if ( sensorEngine.state !== sensorEngine.CONSTANTS.States.SEstate_Ready ) {
		  throw "Bad state";
	  }
	  
	  sensorEngine.state = sensorEngine.CONSTANTS.States.SEstate_Working;
	  
	  sensorEngine._mainLoop = setInterval(() => {
		  if (sensorEngine.state === sensorEngine.CONSTANTS.States.SEstate_Working) {
			  
			  // Emit event MainLoop_Tick
			  sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Tick);
		  } else {
			  
			  // Emit event MainLoop_Stop
			  sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Stop);
		  }
	  }, sensorEngine.config.loopTime);
	  
	}
	
	
	/**
	 * Stop main loop
	 */
	stopMainLoop() {
		let sensorEngine = this;
		sensorEngine.eventEmitter.emit(sensorEngine.CONSTANTS.Events.MainLoop_Stop);	// Emit event MainLoop_Stop
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


module.exports = SensorEngine;
