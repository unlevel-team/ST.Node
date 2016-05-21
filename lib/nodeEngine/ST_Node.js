"use strict";

/*
 ST Node
 SomeThings Node


- Provides the main class of ST node
- Load configuration
- Start managers
- Start services
- byebye for shutdown

*/


// require our modules
let NodeConfiguration = require('./NodeConfiguration.js');

let SensorsManager = require('./SensorsManager.js').SensorsManager;
let ActuatorsManager = require('./ActuatorsManager.js').ActuatorsManager;

let NodeControlService = require('./NodeControlService.js');

let NodeNetManager = require('./NodeNetManager.js');
let NodeNetService = require('./NodeNetService.js');



const readline = require('readline');


/**
 * STNode
 */
class STNode {
	
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
	 * Initialize ST Node
	 */
	init_Node() {
		
		let node = this;
		
		node.loadConfig();
		
		node.init_SensorsManager();
		node.init_ActuatorsManager();
	}
	
	
	/**
	 * Load configuration
	 */
	loadConfig() {

		let stNode = this;
		
		if (stNode.nodeConfiguration != null) {
			throw 'Node configuration is loaded.';
		}
		
		// --- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Node configuration 
		// -------------------------------------------------------------------------------|\/|---
		stNode.nodeConfiguration = new NodeConfiguration();

		stNode.nodeConfiguration.readFile();

		if (stNode.nodeConfiguration.config == null) {
			
			console.log('Error in configuration');	// TODO REMOVE DEBUG LOG
			
			process.exit(0);
//			return -1;
			
		}
		console.log('<···> ST Node');	// TODO REMOVE DEBUG LOG
		console.log(' <···> nodeConfiguration');	// TODO REMOVE DEBUG LOG
		console.log(stNode.nodeConfiguration.config);	// TODO REMOVE DEBUG LOG
		//-------------------------------------------------------------------------------|/\|---
	}
	
	
	/**
	 * Initialize Sensors manager
	 */
	init_SensorsManager() {
		
		let stNode = this;
		
		if (stNode.sensorsManager != null) {
			throw 'Sensors manager initialized.';
		}
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Sensors Manager 
		//-------------------------------------------------------------------------------|\/|---
		stNode.sensorsManager = new SensorsManager();
		
		let snsm = stNode.sensorsManager;
		let nodeConfig = stNode.nodeConfiguration.config;

		if (nodeConfig.sensors != null && 
				nodeConfig.sensors.length > 0) {
			
			nodeConfig.sensors.forEach(function(sns_, _i) {
				snsm.addSensor(sns_);
			});

			
			console.log( '<···> ST Node.sensorsManager' );	// TODO REMOVE DEBUG LOG
			console.log( nodeConfig.sensors );	// TODO REMOVE DEBUG LOG
			console.log( snsm.sensorList );	// TODO REMOVE DEBUG LOG
		}
		//-------------------------------------------------------------------------------|/\|---
		
	}
	
	
	/**
	 * Initialize Actuators manager
	 */
	init_ActuatorsManager() {
		
		let stNode = this;
		
		if (stNode.actuatorsManager != null) {
			throw 'Actuators manager initialized.';
		}
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Actuators Manager 
		//-------------------------------------------------------------------------------|\/|---
		stNode.actuatorsManager = new ActuatorsManager();
		
		let actm = stNode.actuatorsManager;
		let nodeConfig = stNode.nodeConfiguration.config;

		if (nodeConfig.actuators != null && 
				nodeConfig.actuators.length > 0) {
			
			nodeConfig.actuators.forEach(function(act_, _i) {
				actm.addActuator(act_);
			});
			
			console.log( '<···> ST Node.actuatorsManager' );	// TODO REMOVE DEBUG LOG
			console.log( nodeConfig.actuators );	// TODO REMOVE DEBUG LOG
			console.log( actm.actuatorsList );	// TODO REMOVE DEBUG LOG
		}
		//-------------------------------------------------------------------------------|/\|---
		
	}
	
	
	/**
	 * Initialize Node Control Service
	 */
	init_NodeControlService() {
		
		let stNode = this;
		
		if (stNode.nodeControlService != null) {
			throw 'Node Control Service initialized.';
		}
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Node control Service 
		//-------------------------------------------------------------------------------|\/|---
		stNode.nodeControlService = new NodeControlService( stNode.nodeConfiguration.config );

		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.ConnectedToServer, function(data){
			console.log('<···> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.ConnectedToServer');	// TODO REMOVE DEBUG LOG

		});

		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.DisconnectedFromServer, function(data){
			console.log('<···> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.DisconnectedFromServer');	// TODO REMOVE DEBUG LOG

		});

		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.BadNodeConfig, function(data){
			console.log('<···> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.BadNodeConfig');	// TODO REMOVE DEBUG LOG
			
			stNode._byebye();
		});
		
		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.ShutDownNode, function(data){
			console.log('<···> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <···> Events.ShutDownNode');	// TODO REMOVE DEBUG LOG
			
			stNode._byebye();
		});
		
		stNode.nodeControlService.connectToServer();	// Connect to server
		stNode.sensorsManager.setNodeControlService( stNode.nodeControlService );	// bind to Sensors manager
		stNode.actuatorsManager.setNodeControlService( stNode.nodeControlService );	// bind to Actuators manager
		//-------------------------------------------------------------------------------|/\|---
	}

	
	/**
	 * Initialize net manager
	 */
	init_NodeNetManager() {
		
		let node = this;
		
		if (node.nodeNetManager != null) {
			throw 'Node net manager initialized.';
		}
		

		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Net Manager 
		let ndm_Config = {
				"_node" : node	
			};
			
		node.nodeNetManager = new NodeNetManager(ndm_Config);
		
	}
	
	
	/**
	 * Initialize net service
	 */
	init_NodeNetService() {
		
		let node = this;
		
		if (node.nodeNetService != null) {
			throw 'Node net service initialized.';
		}
		
		
		//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ --- 
		// Net service 
		node.nodeNetService = new NodeNetService(node, node.nodeNetManager);
		node.nodeNetService.initialize();
		
	}
	
	
	/**
	 * Byebye
	 */
	_byebye() {
		
		let node = this;
		
		console.log('Have a great day!');	// TODO REMOVE DEBUG LOG
		  
		node.nodeControlService.disconnectFromServer();
		node.sensorsManager.turnOffSensors();
		node.actuatorsManager.turnOffActuators();
		  
		process.exit(0);
	}
	
	
	/**
	 * Initialize Mini CLI
	 */
	init_MiniCLI() {
		
		let stNode = this;
		
		if (stNode.miniCLI != null) {
			throw 'Mini CLI initialized.';
		}
		
		stNode.miniCLI = readline.createInterface(process.stdin, process.stdout);
		stNode.miniCLI.setPrompt('STNode> ');
		stNode.miniCLI.prompt();

		stNode.miniCLI.on('line', function(line) {
			let line_ = line.trim();
			let _line_ = line_.split(" ");
			if (_line_.length > 1) {
				line_ = _line_[0];
			}
		  switch(line_) {
		  
//		    case 'hello':
//		        console.log('world!');
//		        break;
	        
		  case 'exit':
			  stNode._byebye();
			  break;
		  
		  	case 'sensor':
		  		
		  		let sensorSearch = null;
		  		
		  		if (_line_.length == 1) {
		  			console.log('<*>Sensor List');
		  			console.log(stNode.sensorsManager.sensorList);
		  		} else {
		  			
		  			
		  			switch (_line_[1]) {
					case 'start':
			  			console.log('<*>Sensor Start');
			  			
			  			sensorSearch = stNode.sensorsManager.getSensorByID(_line_[2]);
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

			  			sensorSearch = stNode.sensorsManager.getSensorByID(_line_[2]);
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
		  
		  stNode.miniCLI.prompt();
		  
		}).on('close', function() {
			stNode._byebye();
		});

	}
}


module.exports = STNode;
