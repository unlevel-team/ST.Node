"use strict";

let ActuatorEngine = require('../nodeEngine/ActuatorEngine.js');

let EventEmitter = require('events').EventEmitter;



/**
 * ST Actuator Dummy01
 */
class STActuator_Dummy01 extends ActuatorEngine {
	
	constructor(config) {
		
		super(config);
		
		this._lastTime = null;
		this._lastActuatorDATA = {
			"time": null,
			"data": null
		};
	}
	
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let stActuator = this;
		let actOptions = stActuator.config.options;
		
		stActuator._ticks = 0;
		
		// Map event MainLoop_Tick
		stActuator.eventEmitter.on(stActuator.CONSTANTS.Events.MainLoop_Tick, function() {
			
			stActuator._ticks++;
			
			if (stActuator._ticks >= actOptions.ticks) {
				
				stActuator._ticks = 0;
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
		
		
		// Map event ActuatorData
		stActuator.eventEmitter.on(stActuator.CONSTANTS.Events.ActuatorData, function(data) {
			stActuator._event_ActuatorData(data);
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
	
	
	/**
	 * Event ActuatorData
	 */
	_event_ActuatorData(data) {
		
		let stActuator = this;
		
		stActuator._lastActuatorDATA.data = data;
		stActuator._lastActuatorDATA.time = new Date().getTime();
		
		console.log('<*> STActuator_Dummy01.Events.ActuatorData');	// TODO REMOVE DEBUG LOG
		console.log(stActuator._lastActuatorDATA);	// TODO REMOVE DEBUG LOG
		
	}
	
	
}


module.exports = STActuator_Dummy01;