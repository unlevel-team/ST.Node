"use strict";


// require our modules
var NodeConfiguration = require('./NodeConfiguration.js');

var SensorsManager = require('./SensorsManager.js').SensorsManager;
var ActuatorsManager = require('./ActuatorsManager.js').ActuatorsManager;

var NodeControlService = require('./NodeControlService.js');

var NodeNetManager = require('./NodeNetManager.js');
var NodeNetService = require('./NodeNetService.js');



const readline = require('readline');


/**
 * OCNode
 */
class OCNode {
	
	constructor() {
		this.nodeConfiguration = null;
		
		this.sensorsManager = null;
		this.actuatorsManager = null;
		this.nodeControlService = null;
		
		this.nodeNetManager = null;
		this.nodeNetService = null;

		
		this.miniCLI = null;
	}
	
	/**
	 * Initialize OC Node
	 */
	init_Node() {
		this.loadConfig();
		
		this.init_SensorsManager();
		this.init_ActuatorsManager();
	}
	
	/**
	 * Load configuration
	 */
	loadConfig() {

		if (this.nodeConfiguration != null) {
			throw 'Server configuration is loaded.';
		}
		
		// --- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Node configuration 
		// -------------------------------------------------------------------------------|\/|---
		this.nodeConfiguration = new NodeConfiguration();

		this.nodeConfiguration.readFile();

		if (this.nodeConfiguration.config == null) {
			
			console.log('Error in configuration');	// TODO REMOVE DEBUG LOG
			
			process.exit(0);
//			return -1;
			
		}
		console.log('<···> OC Node');	// TODO REMOVE DEBUG LOG
		console.log(' <···> nodeConfiguration');	// TODO REMOVE DEBUG LOG
		console.log(this.nodeConfiguration.config);	// TODO REMOVE DEBUG LOG
		//-------------------------------------------------------------------------------|/\|---
	}
	
	
	/**
	 * Initialize Sensors manager
	 */
	init_SensorsManager() {
		
		if (this.sensorsManager != null) {
			throw 'Sensors manager initialized.';
		}
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Sensors Manager 
		//-------------------------------------------------------------------------------|\/|---
		this.sensorsManager = new SensorsManager();

		if (this.nodeConfiguration.config.sensors != null && 
				this.nodeConfiguration.config.sensors.length > 0) {
			
			var _i = 0;
			
			for (_i = 0; _i < this.nodeConfiguration.config.sensors.length; _i++) {
				this.sensorsManager.addSensor(this.nodeConfiguration.config.sensors[_i]);
			}
			
			console.log( '<···> OC Node.sensorsManager' );	// TODO REMOVE DEBUG LOG
			console.log( this.nodeConfiguration.config.sensors );	// TODO REMOVE DEBUG LOG
			console.log( this.sensorsManager.sensorList );	// TODO REMOVE DEBUG LOG
		}
		//-------------------------------------------------------------------------------|/\|---
		
	}
	
	
	/**
	 * Initialize Actuators manager
	 */
	init_ActuatorsManager() {
		
		if (this.actuatorsManager != null) {
			throw 'Actuators manager initialized.';
		}
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Actuators Manager 
		//-------------------------------------------------------------------------------|\/|---
		this.actuatorsManager = new ActuatorsManager();

		if (this.nodeConfiguration.config.actuators != null && 
				this.nodeConfiguration.config.actuators.length > 0) {
			
			var _i = 0;
			
			for (_i = 0; _i < this.nodeConfiguration.config.actuators.length; _i++) {
				this.actuatorsManager.addActuator(this.nodeConfiguration.config.actuators[_i]);
			}
			
			console.log( '<···> OC Node.actuatorsManager' );	// TODO REMOVE DEBUG LOG
			console.log( this.nodeConfiguration.config.actuators );	// TODO REMOVE DEBUG LOG
			console.log( this.actuatorsManager.actuatorsList );	// TODO REMOVE DEBUG LOG
		}
		//-------------------------------------------------------------------------------|/\|---
		
	}
	
	
	/**
	 * Initialize Node Control Service
	 */
	init_NodeControlService() {
		
		if (this.nodeControlService != null) {
			throw 'Node Control Service initialized.';
		}
		
		let ocNode = this;
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Node control Service 
		//-------------------------------------------------------------------------------|\/|---
		this.nodeControlService = new NodeControlService( this.nodeConfiguration.config );

		this.nodeControlService.eventEmitter.on( this.nodeControlService.CONSTANTS.Events.ConnectedToServer, function(data){
			console.log('<···> OC Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.ConnectedToServer');	// TODO REMOVE DEBUG LOG

		});

		this.nodeControlService.eventEmitter.on( this.nodeControlService.CONSTANTS.Events.DisconnectedFromServer, function(data){
			console.log('<···> OC Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.DisconnectedFromServer');	// TODO REMOVE DEBUG LOG

		});

		this.nodeControlService.eventEmitter.on( this.nodeControlService.CONSTANTS.Events.BadNodeConfig, function(data){
			console.log('<···> OC Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.BadNodeConfig');	// TODO REMOVE DEBUG LOG
			
			ocNode._byebye();
		});
		
		this.nodeControlService.eventEmitter.on( this.nodeControlService.CONSTANTS.Events.ShutDownNode, function(data){
			console.log('<···> OC Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.ShutDownNode');	// TODO REMOVE DEBUG LOG
			
			ocNode._byebye();
		});

		this.nodeControlService.connectToServer();	// Connect to server
		this.sensorsManager.setNodeControlService( this.nodeControlService );	// bind to Sensors manager
		this.actuatorsManager.setNodeControlService( this.nodeControlService );	// bind to Actuators manager
		//-------------------------------------------------------------------------------|/\|---
	}

	
	/**
	 * Initialize net manager
	 */
	init_NodeNetManager() {
		
		if (this.nodeNetManager != null) {
			throw 'Node net manager initialized.';
		}
		
		let node = this;

		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Net Manager 
		//-------------------------------------------------------------------------------|\/|---
		var ndm_Config = {
				"_node" : node	
			};
			
		node.nodeNetManager = new NodeNetManager(ndm_Config);
		//-------------------------------------------------------------------------------|/\|---
	}
	
	
	/**
	 * Initialize net service
	 */
	init_NodeNetService() {
		
		if (this.nodeNetService != null) {
			throw 'Node net service initialized.';
		}
		
		let node = this;
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Net service 
		//-------------------------------------------------------------------------------|\/|---
		this.nodeNetService = new NodeNetService(node, node.nodeNetManager);
		this.nodeNetService.initialize();
		//-------------------------------------------------------------------------------|/\|---
	}
	
	
	
	/**
	 * Byebye
	 */
	_byebye() {
		  console.log('Have a great day!');
		  
		  this.nodeControlService.disconnectFromServer();
		  this.sensorsManager.turnOffSensors();
		  this.actuatorsManager.turnOffActuators();
		  
		  process.exit(0);
	}
	
	
	/**
	 * Initialize Mini CLI
	 */
	init_MiniCLI() {
		
		if (this.miniCLI != null) {
			throw 'Mini CLI initialized.';
		}
		
		let ocNode = this;
		
		this.miniCLI = readline.createInterface(process.stdin, process.stdout);
		this.miniCLI.setPrompt('OCNode> ');
		this.miniCLI.prompt();

		this.miniCLI.on('line', function(line) {
			var line_ = line.trim();
			var _line_ = line_.split(" ");
			if (_line_.length > 1) {
				line_ = _line_[0];
			}
		  switch(line_) {
		  
//		    case 'hello':
//		        console.log('world!');
//		        break;
	        
		  case 'exit':
			  ocNode._byebye();
			  break;
		  
		  	case 'sensor':
		  		
		  		let sensorSearch = null;
		  		
		  		if (_line_.length == 1) {
		  			console.log('<*>Sensor List');
		  			console.log(ocNode.sensorsManager.sensorList);
		  		} else {
		  			
		  			
		  			switch (_line_[1]) {
					case 'start':
			  			console.log('<*>Sensor Start');
			  			
			  			sensorSearch = ocNode.sensorsManager.getSensorByID(_line_[2]);
			  			if (sensorSearch.STsensor == null) {
				  			console.log(' <EEE>Sensor not found');
			  			}
			  			
			  			try {
				  			sensorSearch.STsensor.sensorEngine.startEngine();
						} catch (e) {
				  			console.log(' <EEE>Sensor Error at startEngine');
				  			console.log(e.message);
						}
			  			
						break;
						
					case 'stop':
			  			console.log('<*>Sensor Stop');

			  			sensorSearch = ocNode.sensorsManager.getSensorByID(_line_[2]);
			  			if (sensorSearch.STsensor == null) {
				  			console.log(' <EEE>Sensor not found');
			  			}
			  			
			  			try {
				  			sensorSearch.STsensor.sensorEngine.stopEngine();
						} catch (e) {
				  			console.log(' <EEE>Sensor Error at stopEngine');
				  			console.log(e.message);
						}
						break;

					default:
			  			console.log('<*>Sensor');
		  			    console.log(' <EEE>Bad parameter');


						break;
					}
		  			
		  		}
		  		break;
		  	
		  	
		    default:
		    	if (line_ != '') {
		    	      console.log('>???> Say what? I might have heard `' + line_ + '`');
		    	}
		      break;
		  }
		  
		  ocNode.miniCLI.prompt();
		  
		}).on('close', function() {
			ocNode._byebye();
		});

	}
}


module.exports = OCNode;
