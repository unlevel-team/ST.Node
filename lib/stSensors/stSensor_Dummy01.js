"use strict";

let SensorEngine = require('../nodeEngine/SensorsManager.js').SensorEngine;

let EventEmitter = require('events').EventEmitter;



/**
 * ST Sensor Dummy01
 */
class STSensor_Dummy01 extends SensorEngine {
	
	constructor(config) {
		super(config);
		
		this._lastTime = null;
	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let stSensor = this;
		stSensor._ticks = 0;
		
		stSensor.eventEmitter.on(stSensor.CONSTANTS.Events.MainLoop_Tick, function() {
			
			stSensor._ticks++;
			if (stSensor._ticks >= stSensor.config.options.ticks) {
				stSensor._ticks = 0;
				stSensor.eventEmitter.emit(stSensor.CONSTANTS.Events.SensorData, {"ticks": stSensor.config.options.ticks});
				
			  console.log('<*> STSensor_Dummy01.Events.SensorData');	// TODO REMOVE DEBUG LOG

			  stSensor._lastTime = new Date().getTime();

			  if (stSensor.config.options.showTime) {
				  console.log(' <···> Time: ' + stSensor._lastTime);	// TODO REMOVE DEBUG LOG
			  }
			  
			  if (stSensor.config.options.showDeltaTime) {
				  if (stSensor._deltaTimeRef != undefined) {
					  let deltaTime = stSensor._lastTime - stSensor._deltaTimeRef;
					  console.log(' <···> DetalTime: ' + deltaTime );	// TODO REMOVE DEBUG LOG
				  }
				  stSensor._deltaTimeRef = stSensor._lastTime;
			  }
			}
			
		});
		
		
		super.initialize();
	}
	
	
	startEngine() {
		
		let stSensor = this;
		
		stSensor.mainLoop();
		
		stSensor.eventEmitter.emit( stSensor.CONSTANTS.Events.SensorEngine_Start );
	}
	
	
	stopEngine() {
		
		let stSensor = this;
		
		stSensor.stopMainLoop();
		
		// MainLoop_Stop
		stSensor.eventEmitter.emit( stSensor.CONSTANTS.Events.SensorEngine_Stop );

	}
	
	
	/**
	 * Get options
	 */
	getOptions() {
		
		let stSensor = this;
		let snsOptions = stSensor.config.options;
		
		let options = {
				"ticks" : snsOptions.ticks,
				"showTime" : snsOptions.showTime,
				"showDeltaTime" : snsOptions.showDeltaTime
		};
		
		return options;
	}
	
	/**
	 * Set options
	 */
	setOptions(options) {
		
		let stSensor = this;
		
		if (stSensor.state == stSensor.CONSTANTS.States.SEstate_Working) {
			throw "Bad sensor state.";
		}
		
		let actOptions = stSensor.config.options;
		
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


module.exports = STSensor_Dummy01;