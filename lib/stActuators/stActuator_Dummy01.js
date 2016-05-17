"use strict";

let ActuatorEngine = require('../nodeEngine/ActuatorsManager.js').ActuatorEngine;

let EventEmitter = require('events').EventEmitter;



/**
 * ST Actuator Dummy01
 */
class STActuator_Dummy01 extends ActuatorEngine {
	
	constructor(config) {
		super(config);
		
		this._lastTime = null;
	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let stActuator = this;
		let actOptions = stActuator.config.options;
		
		stActuator._ticks = 0;
		
		stActuator.eventEmitter.on(stActuator.CONSTANTS.Events.MainLoop_Tick, function() {
			
			stActuator._ticks++;
			
			if (stActuator._ticks >= actOptions.ticks) {
				stActuator._ticks = 0;
				stActuator.eventEmitter.emit(stActuator.CONSTANTS.Events.ActuatorData, {"ticks": actOptions.ticks});
				
			  console.log('<*> STActuator_Dummy01.Events.ActuatorData');	// TODO REMOVE DEBUG LOG
			  
			  
			  stActuator._lastTime = new Date().getTime();
			  
			  
			  if (actOptions.showTime) {
				  console.log(' <···> Time: ' + stActuator._lastTime);	// TODO REMOVE DEBUG LOG
			  }
			  
			  if (actOptions.showDeltaTime) {
				  if (stActuator._deltaTimeRef != undefined) {
					  let deltaTime = stActuator._lastTime - stActuator._deltaTimeRef;
					  console.log(' <···> DetalTime: ' + deltaTime );	// TODO REMOVE DEBUG LOG
				  }
				  stActuator._deltaTimeRef = stActuator._lastTime;
			  }
			}
			
		});
		
		
		super.initialize();
	}
	
	/**
	 * Start engine
	 */
	startEngine() {
		
		let stActuator = this;
		stActuator.mainLoop();
		
		stActuator.eventEmitter.emit( stActuator.CONSTANTS.Events.ActuatorEngine_Start );
	}
	
	
	/**
	 * Stop engine
	 */
	stopEngine() {
		
		let stActuator = this;
		stActuator.stopMainLoop();
		
		// MainLoop_Stop
		stActuator.eventEmitter.emit( stActuator.CONSTANTS.Events.ActuatorEngine_Stop );
	}
	
	/**
	 * Get options
	 */
	getOptions() {
		
		let stActuator = this;
		let actOptions = stActuator.config.options;
		
		let options = {
				"ticks" : actOptions.ticks,
				"showTime" : actOptions.showTime,
				"showDeltaTime" : actOptions.showDeltaTime
		};
		
		return options;
	}
	
	/**
	 * Set options
	 */
	setOptions(options) {
		
		let stActuator = this;
		
		if (stActuator.state == stActuator.CONSTANTS.States.State_Working) {
			throw "Bad actuator state.";
		}
		
		let actOptions = stActuator.config.options;
		
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
	
	
	
	
}


module.exports = STActuator_Dummy01;