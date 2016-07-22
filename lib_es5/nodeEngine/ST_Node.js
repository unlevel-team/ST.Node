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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeConfiguration = require('./NodeConfiguration.js');

/**
 * import STEngines
 * @ignore
 */
var STEngines = require('st.engines');

/**
 * import NodeControlService
 * @ignore
 */
var NodeControlService = require('./NodeControlService.js');

/**
 * import Services
 * @ignore
 */
var Services = require('st.network').get_Services();

/**
 * import NodeNetManager
 * @ignore
 */
var NodeNetManager = Services.get_NodeNetManager();

/**
 * import NodeNetService
 * @ignore
 */
var NodeNetService = Services.get_NodeNetService();

/**
 * import COMSystem
 * @ignore
 */
var COMSystem = require('st.network').get_COMSystem_Lib();

/**
 * import readline
 * @ignore
 */
var readline = require('readline');

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

var STNode = function () {

	/**
  * 
  * @constructs STNode
  */

	function STNode() {
		_classCallCheck(this, STNode);

		var stNode = this;

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


	_createClass(STNode, [{
		key: 'init_Node',
		value: function init_Node() {

			var node = this;

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

	}, {
		key: 'loadConfig',
		value: function loadConfig() {

			var stNode = this;

			if (stNode.nodeConfiguration !== null) {
				throw 'Node configuration is loaded.';
			}

			// --- ~~ --- ~~ --- ~~ --- ~~ ---
			// Node configuration
			// -------------------------------------------------------------------------------|\/|---
			stNode.nodeConfiguration = new NodeConfiguration();

			stNode.nodeConfiguration.readFile();

			if (stNode.nodeConfiguration.config === null) {

				console.log('Error in configuration'); // TODO REMOVE DEBUG LOG

				process.exit(0);
				//			return -1;
			}

			console.log('<*> ST Node'); // TODO REMOVE DEBUG LOG
			console.log(' <~~~> nodeConfiguration'); // TODO REMOVE DEBUG LOG
			console.log(stNode.nodeConfiguration.config); // TODO REMOVE DEBUG LOG
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize Node Control Service
   */

	}, {
		key: '_init_NodeControlService',
		value: function _init_NodeControlService() {

			var stNode = this;

			if (stNode.nodeControlService !== null) {
				throw 'Node Control Service initialized.';
			}

			//--- ~~ --- ~~ --- ~~ --- ~~ ---
			// Node control Service
			//-------------------------------------------------------------------------------|\/|---
			stNode.nodeControlService = new NodeControlService(stNode.nodeConfiguration.config);

			stNode.nodeControlService.eventEmitter.on(stNode.nodeControlService.CONSTANTS.Events.ConnectedToServer, function (data) {
				console.log('<*> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <~~~> Events.ConnectedToServer'); // TODO REMOVE DEBUG LOG
			});

			stNode.nodeControlService.eventEmitter.on(stNode.nodeControlService.CONSTANTS.Events.DisconnectedFromServer, function (data) {
				console.log('<*> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <~~~> Events.DisconnectedFromServer'); // TODO REMOVE DEBUG LOG
			});

			stNode.nodeControlService.eventEmitter.on(stNode.nodeControlService.CONSTANTS.Events.BadNodeConfig, function (data) {
				console.log('<*> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <~~~> Events.BadNodeConfig'); // TODO REMOVE DEBUG LOG

				stNode._byebye();
			});

			stNode.nodeControlService.eventEmitter.on(stNode.nodeControlService.CONSTANTS.Events.ShutDownNode, function (data) {
				console.log('<*> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <~~~> Events.ShutDownNode'); // TODO REMOVE DEBUG LOG

				stNode._byebye();
			});

			stNode.nodeControlService.connectToServer(); // Connect to server
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize engines system
   */

	}, {
		key: '_init_EnginesSystem',
		value: function _init_EnginesSystem() {

			var stNode = this;
			var config = stNode.nodeConfiguration.config;

			if (stNode.ngSYS !== null) {
				throw 'Engines System initialized.';
			}

			// Set role node & control channel
			var ngSYSconfig = {

				"role": "Node",
				"controlChannel": stNode.nodeControlService,

				"sensors": config.sensors,
				"actuators": config.actuators

			};

			console.log("ST Node Engines System"); // TODO REMOVE DEBUG LOG
			console.log(STEngines); // TODO REMOVE DEBUG LOG

			try {
				stNode.ngSYS = STEngines.getEnginesSystem(ngSYSconfig);

				console.log(stNode.ngSYS); // TODO REMOVE DEBUG LOG

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

	}, {
		key: 'init_NodeNetManager',
		value: function init_NodeNetManager() {

			var node = this;

			if (node.nodeNetManager !== null) {
				throw 'Node net manager initialized.';
			}

			//--- ~~ --- ~~ --- ~~ --- ~~ ---
			// Net Manager
			var ndm_Config = {
				"_node": node
			};

			node.nodeNetManager = new NodeNetManager(ndm_Config);
		}

		/**
   * Initialize net service
   */

	}, {
		key: 'init_NodeNetService',
		value: function init_NodeNetService() {

			var node = this;

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

	}, {
		key: 'init_NodeCOMSystem',
		value: function init_NodeCOMSystem() {

			var node = this;

			if (node.comSYS !== null) {
				throw 'Node COM System initialized.';
			}

			var socket = node.nodeControlService.socket;

			//--- ~~ --- ~~ --- ~~ --- ~~ ---
			// COM System
			var comSYS_Config = {
				"controlChannel": socket,
				"role": "Node",
				"sensorManager": node.sensorsManager,
				"actuatorsManager": node.actuatorsManager
			};

			node.comSYS = COMSystem.getCOMSystem(comSYS_Config);

			try {
				node.comSYS.initialize();
			} catch (e) {
				console.log('<EEE> ST Node.init_NodeCOMSystem'); // TODO REMOVE DEBUG LOG
				console.log(' <~~~> ' + e); // TODO REMOVE DEBUG LOG
				node._byebye();
			}
		}

		/**
   * Byebye
   */

	}, {
		key: '_byebye',
		value: function _byebye() {

			var node = this;

			console.log('Have a great day!'); // TODO REMOVE DEBUG LOG

			node.nodeControlService.disconnectFromServer();
			node.sensorsManager.turnOffSensors();
			node.actuatorsManager.turnOffActuators();

			process.exit(0);
		}

		/**
   * Initialize Mini CLI
   */

	}, {
		key: 'init_MiniCLI',
		value: function init_MiniCLI() {

			var stNode = this;

			if (stNode.miniCLI !== null) {
				throw 'Mini CLI initialized.';
			}

			stNode.miniCLI = readline.createInterface(process.stdin, process.stdout);
			stNode.miniCLI.setPrompt('ST.Node> ');
			stNode.miniCLI.prompt();

			stNode.miniCLI.on('line', function (line) {
				var line_ = line.trim();
				var _line_ = line_.split(" ");
				if (_line_.length > 1) {
					line_ = _line_[0];
				}
				switch (line_) {

					//		    case 'hello':
					//		        console.log('world!');
					//		        break;

					case 'exit':
						stNode._byebye();
						break;

					case 'sensor':

						var sensorSearch = null;

						if (_line_.length === 1) {
							console.log('<*>Sensor List');
							console.log(stNode.sensorsManager.sensorList);
						} else {

							switch (_line_[1]) {
								case 'start':
									console.log('<*>Sensor Start');

									sensorSearch = stNode.sensorsManager.getSensorByID(_line_[2]);
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

									sensorSearch = stNode.sensorsManager.getSensorByID(_line_[2]);
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

				stNode.miniCLI.prompt();
			}).on('close', function () {
				stNode._byebye();
			});
		}
	}]);

	return STNode;
}();

module.exports = STNode;
//# sourceMappingURL=ST_Node.js.map
