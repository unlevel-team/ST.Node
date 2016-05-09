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
		stActuator._ticks = 0;
		
		stActuator.eventEmitter.on(stActuator.CONSTANTS.Events.MainLoop_Tick, function() {
			
			stActuator._ticks++;
			if (stActuator._ticks >= stActuator.config.options.ticks) {
				stActuator._ticks = 0;
				stActuator.eventEmitter.emit(stActuator.CONSTANTS.Events.ActuatorData, {"ticks": stActuator.config.options.ticks});
				
			  console.log('<*> STActuator_Dummy01.Events.ActuatorData');	// TODO REMOVE DEBUG LOG
			  
			  
			  stActuator._lastTime = new Date().getTime();
			  
			  
			  if (stActuator.config.options.showTime) {
				  console.log(' <···> Time: ' + stActuator._lastTime);	// TODO REMOVE DEBUG LOG
			  }
			  
			  if (stActuator.config.options.showDeltaTime) {
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
	
	
	startEngine() {
		this.mainLoop();
		
		
		this.eventEmitter.emit( this.CONSTANTS.Events.ActuatorEngine_Start );
	}
	
	
	stopEngine() {
		this.stopMainLoop();
		
		// MainLoop_Stop
		this.eventEmitter.emit( this.CONSTANTS.Events.ActuatorEngine_Stop );

	}
}


module.exports = STActuator_Dummy01;