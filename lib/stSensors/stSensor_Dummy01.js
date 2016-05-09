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
		this.mainLoop();
		
		
		this.eventEmitter.emit( this.CONSTANTS.Events.SensorEngine_Start );
	}
	
	
	stopEngine() {
		this.stopMainLoop();
		
		// MainLoop_Stop
		this.eventEmitter.emit( this.CONSTANTS.Events.SensorEngine_Stop );

	}
}


module.exports = STSensor_Dummy01;