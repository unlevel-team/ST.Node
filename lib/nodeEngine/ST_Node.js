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


/**
 * import NodeConfiguration
 * @ignore
 */
let NodeConfiguration = require('./NodeConfiguration.js');


/**
 * import STEngines
 * @ignore
 */
let STEngines = require('st.engines');

/**
 * import NodeControlService
 * @ignore
 */
let NodeControlService = require('./NodeControlService.js');


/**
 * import Services
 * @ignore
 */
let Services = require('st.network').get_Services();

/**
 * import NodeNetManager
 * @ignore
 */
let NodeNetManager = Services.get_NodeNetManager();

/**
 * import NodeNetService
 * @ignore
 */
let NodeNetService = Services.get_NodeNetService();


/**
 * import COMSystem
 * @ignore
 */
let COMSystem = require('st.network').get_COMSystem_Lib();

/**
 * import readline
 * @ignore
 */
const readline = require('readline');


/**
 * STNode
 * 
 * @class
 * @memberof st.nodeEngine
 * 
 * @property {Node} stNode - Node
 * @property {object} nodeConfiguration - Node configuration object
 * @property {SensorsManager} sensorsManager - Sensors manager
 * @property {ActuatorsManager} actuatorsManager - Actuators manager
 * @property {EnginesSystem} ngSYS - Engines System object
 * @property {NodeControlService} nodeControlService - Node Control service
 * @property {NodeNetManager} nodeNetManager - Node Net manager
 * @property {NodeNetService} nodeNetService - Node Net service
 * @property {COMSystem} comSYS - COM System object
 * @property {object} miniCLI - miniCLI object
 * 
 */
class STNode {
	
	/**
	 * 
	 * @constructs STNode
	 */
	constructor(options) {
		
		if (options === undefined) {
			options = {};
		}

		let stNode = this;
		stNode._config = {};
		
		if (options.config !== undefined) {
			stNode._config = options.config;
		}

		
		stNode.nodeConfiguration = null;
		
		stNode.sensorsManager = null;
		stNode.actuatorsManager = null;
		
		stNode.ngSYS = null;
		
		stNode.nodeControlService = null;
		
		stNode.nodeNetManager = null;
		stNode.nodeNetService = null;

		stNode.comSYS = null;
		
		stNode.miniCLI = null;
	}
	
	
	/**
	 * Initialize ST Node
	 */
	init_Node() {
		
		let node = this;
		
		node.loadConfig();
		
		try {
			node._init_NodeControlService();
		} catch (e) {
			// TODO: handle exception
			throw "Error in control service. " + e;
		}
		
		try {
			node._init_EnginesSystem();
		} catch (e) {
			// TODO: handle exception
			throw "Error in engines system. " + e;
		}
		
		
	}
	
	
	/**
	 * Load configuration
	 */
	loadConfig() {

		let _stNode = this;
		let _config = _stNode._config;

		
		if (_stNode.nodeConfiguration !== null) {
			throw 'Node configuration is loaded.';
		}
		
		// --- ~~ --- ~~ --- ~~ --- ~~ --- 
		// Node configuration 
		// -------------------------------------------------------------------------------|\/|---
		_stNode.nodeConfiguration = new NodeConfiguration();

		_stNode.nodeConfiguration.readFile({
			'configFile': _config.configfile
		});

		if (_stNode.nodeConfiguration.config === null) {
			
			console.log('Error in configuration');	// TODO REMOVE DEBUG LOG
			
			process.exit(0);
//			return -1;
			
		}

		
		console.log('<*> ST Node');	// TODO REMOVE DEBUG LOG
		console.log(' <~~~> nodeConfiguration');	// TODO REMOVE DEBUG LOG
		console.log(_stNode.nodeConfiguration.config);	// TODO REMOVE DEBUG LOG
		//-------------------------------------------------------------------------------|/\|---
	}
	
	
	
	/**
	 * Initialize Node Control Service
	 */
	_init_NodeControlService() {
		
		let stNode = this;
		
		if (stNode.nodeControlService !== null) {
			throw 'Node Control Service initialized.';
		}
		
		//--- ~~ --- ~~ --- ~~ --- ~~ --- 
		// Node control Service 
		//-------------------------------------------------------------------------------|\/|---
		stNode.nodeControlService = new NodeControlService( stNode.nodeConfiguration.config );

		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.ConnectedToServer, function(data){
			console.log('<*> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <~~~> Events.ConnectedToServer');	// TODO REMOVE DEBUG LOG

		});

		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.DisconnectedFromServer, function(data){
			console.log('<*> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <~~~> Events.DisconnectedFromServer');	// TODO REMOVE DEBUG LOG

		});

		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.BadNodeConfig, function(data){
			console.log('<*> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <~~~> Events.BadNodeConfig');	// TODO REMOVE DEBUG LOG
			
			stNode._byebye();
		});
		
		stNode.nodeControlService.eventEmitter.on( stNode.nodeControlService.CONSTANTS.Events.ShutDownNode, function(data){
			console.log('<*> ST Node.nodeControlService');	// TODO REMOVE DEBUG LOG
			console.log(' <~~~> Events.ShutDownNode');	// TODO REMOVE DEBUG LOG
			
			stNode._byebye();
		});
		
		stNode.nodeControlService.connectToServer();	// Connect to server
		//-------------------------------------------------------------------------------|/\|---
	}

	
	/**
	 * Initialize engines system
	 */
	_init_EnginesSystem() {
		
		let stNode = this;
		let config = stNode.nodeConfiguration.config;
		
		if (stNode.ngSYS !== null) {
			throw 'Engines System initialized.';
		}
		
		
		// Set role node & control channel
		let ngSYSconfig = {
				
			"role" : "Node",
			"controlChannel" : stNode.nodeControlService,
			
			"sensors" : config.sensors,
			"actuators" : config.actuators

		};
		

		try {
			stNode.ngSYS = STEngines.getEnginesSystem(ngSYSconfig);
			
			stNode.ngSYS.initialize();
			
			stNode.sensorsManager = stNode.ngSYS.sensorsManager;
			stNode.actuatorsManager = stNode.ngSYS.actuatorsManager;

		} catch (e) {
			// TODO: handle exception
			throw "Cannot initialize engines system. " + e;
		}
		
		
	}
	
	
	
	/**
	 * Initialize net manager
	 */
	init_NodeNetManager() {
		
		let node = this;
		
		if (node.nodeNetManager !== null) {
			throw 'Node net manager initialized.';
		}
		

		//--- ~~ --- ~~ --- ~~ --- ~~ --- 
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
		
		if (node.nodeNetService !== null) {
			throw 'Node net service initialized.';
		}
		
		
		//--- ~~ --- ~~ --- ~~ --- ~~ --- 
		// Net service 
		node.nodeNetService = new NodeNetService(node, node.nodeNetManager);
		node.nodeNetService.initialize();
		
	}
	
	
	/**
	 * Initialize COM system
	 */
	init_NodeCOMSystem() {
		
		let node = this;
			
		if (node.comSYS !== null) {
			throw 'Node COM System initialized.';
		}
		
		
		let socket = node.nodeControlService.socket;
		
		//--- ~~ --- ~~ --- ~~ --- ~~ --- 
		// COM System 
		let comSYS_Config = {
			"controlChannel" : socket,
			"role" : "Node",
			"sensorManager" : node.sensorsManager,
			"actuatorsManager" : node.actuatorsManager
		};
		
		node.comSYS = COMSystem.getCOMSystem(comSYS_Config);
		
		try {
			node.comSYS.initialize();
		} catch (e) {
			console.log('<EEE> ST Node.init_NodeCOMSystem');	// TODO REMOVE DEBUG LOG
			console.log(' <~~~> ' + e);	// TODO REMOVE DEBUG LOG
			node._byebye();
		}
		
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
		
		let _stNode = this;
		
		if (_stNode.miniCLI !== null) {
			throw 'Mini CLI initialized.';
		}
		
		_stNode.miniCLI = readline.createInterface(process.stdin, process.stdout);
		_stNode.miniCLI.setPrompt('ST.Node> ');
		_stNode.miniCLI.prompt();

		_stNode.miniCLI.on('line', function(line) {
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
				  _stNode._byebye();
				  break;
			  
			  case 'whoami':
		  			console.log('<*>Node ID: ' + _stNode.nodeConfiguration.config.node.nodeID);
		  			break;
			  
	  			
		  	case 'sensor':
		  		
		  		let sensorSearch = null;
		  		
		  		if (_line_.length === 1) {
		  			console.log('<*>Sensor List');
		  			console.log(_stNode.sensorsManager.sensorsList);
		  		} else {
		  			
		  			
		  			switch (_line_[1]) {
					case 'start':
			  			console.log('<*>Sensor Start');
			  			
			  			sensorSearch = _stNode.sensorsManager.getSensorByID(_line_[2]);
			  			if (sensorSearch.STsensor === null) {
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

			  			sensorSearch = _stNode.sensorsManager.getSensorByID(_line_[2]);
			  			if (sensorSearch.STsensor === null) {
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
		    	if (line_ !== '') {
		    	      console.log('>???> Say what? I might have heard `' + line_ + '`');
		    	}
		      break;
		  }
		  
		  _stNode.miniCLI.prompt();
		  
		}).on('close', function() {
			_stNode._byebye();
		});

	}
}


module.exports = STNode;
