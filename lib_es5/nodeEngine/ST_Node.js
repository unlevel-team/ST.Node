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

// Gulp tricks

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sourceMapSupport = require('source-map-support');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _sourceMapSupport.install)();

// require our modules
var NodeConfiguration = require('./NodeConfiguration.js');

var SensorsManager = require('./SensorsManager.js').SensorsManager;
var ActuatorsManager = require('./ActuatorsManager.js').ActuatorsManager;

var NodeControlService = require('./NodeControlService.js');

var NodeNetManager = require('./NodeNetManager.js');
var NodeNetService = require('./NodeNetService.js');

var readline = require('readline');

/**
 * STNode
 */

var STNode = function () {
	function STNode() {
		_classCallCheck(this, STNode);

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


	_createClass(STNode, [{
		key: 'init_Node',
		value: function init_Node() {
			this.loadConfig();

			this.init_SensorsManager();
			this.init_ActuatorsManager();
		}

		/**
   * Load configuration
   */

	}, {
		key: 'loadConfig',
		value: function loadConfig() {

			if (this.nodeConfiguration != null) {
				throw 'Node configuration is loaded.';
			}

			// --- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ ---
			// Node configuration
			// -------------------------------------------------------------------------------|\/|---
			this.nodeConfiguration = new NodeConfiguration();

			this.nodeConfiguration.readFile();

			if (this.nodeConfiguration.config == null) {

				console.log('Error in configuration'); // TODO REMOVE DEBUG LOG

				process.exit(0);
				//			return -1;
			}
			console.log('<···> ST Node'); // TODO REMOVE DEBUG LOG
			console.log(' <···> nodeConfiguration'); // TODO REMOVE DEBUG LOG
			console.log(this.nodeConfiguration.config); // TODO REMOVE DEBUG LOG
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize Sensors manager
   */

	}, {
		key: 'init_SensorsManager',
		value: function init_SensorsManager() {

			if (this.sensorsManager != null) {
				throw 'Sensors manager initialized.';
			}

			//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ ---
			// Sensors Manager
			//-------------------------------------------------------------------------------|\/|---
			this.sensorsManager = new SensorsManager();

			var snsm = this.sensorsManager;
			var nodeConfig = this.nodeConfiguration.config;

			if (nodeConfig.sensors != null && nodeConfig.sensors.length > 0) {

				nodeConfig.sensors.forEach(function (sns_, _i) {
					snsm.addSensor(sns_);
				});

				console.log('<···> ST Node.sensorsManager'); // TODO REMOVE DEBUG LOG
				console.log(nodeConfig.sensors); // TODO REMOVE DEBUG LOG
				console.log(snsm.sensorList); // TODO REMOVE DEBUG LOG
			}
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize Actuators manager
   */

	}, {
		key: 'init_ActuatorsManager',
		value: function init_ActuatorsManager() {

			if (this.actuatorsManager != null) {
				throw 'Actuators manager initialized.';
			}

			//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ ---
			// Actuators Manager
			//-------------------------------------------------------------------------------|\/|---
			this.actuatorsManager = new ActuatorsManager();

			var actm = this.actuatorsManager;
			var nodeConfig = this.nodeConfiguration.config;

			if (nodeConfig.actuators != null && nodeConfig.actuators.length > 0) {

				nodeConfig.actuators.forEach(function (act_, _i) {
					actm.addActuator(act_);
				});

				console.log('<···> ST Node.actuatorsManager'); // TODO REMOVE DEBUG LOG
				console.log(nodeConfig.actuators); // TODO REMOVE DEBUG LOG
				console.log(actm.actuatorsList); // TODO REMOVE DEBUG LOG
			}
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize Node Control Service
   */

	}, {
		key: 'init_NodeControlService',
		value: function init_NodeControlService() {

			if (this.nodeControlService != null) {
				throw 'Node Control Service initialized.';
			}

			var stNode = this;

			//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ ---
			// Node control Service
			//-------------------------------------------------------------------------------|\/|---
			this.nodeControlService = new NodeControlService(this.nodeConfiguration.config);

			this.nodeControlService.eventEmitter.on(this.nodeControlService.CONSTANTS.Events.ConnectedToServer, function (data) {
				console.log('<···> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <···> Events.ConnectedToServer'); // TODO REMOVE DEBUG LOG
			});

			this.nodeControlService.eventEmitter.on(this.nodeControlService.CONSTANTS.Events.DisconnectedFromServer, function (data) {
				console.log('<···> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <···> Events.DisconnectedFromServer'); // TODO REMOVE DEBUG LOG
			});

			this.nodeControlService.eventEmitter.on(this.nodeControlService.CONSTANTS.Events.BadNodeConfig, function (data) {
				console.log('<···> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <···> Events.BadNodeConfig'); // TODO REMOVE DEBUG LOG

				stNode._byebye();
			});

			this.nodeControlService.eventEmitter.on(this.nodeControlService.CONSTANTS.Events.ShutDownNode, function (data) {
				console.log('<···> ST Node.nodeControlService'); // TODO REMOVE DEBUG LOG
				console.log(' <···> Events.ShutDownNode'); // TODO REMOVE DEBUG LOG

				stNode._byebye();
			});
			this.nodeControlService.connectToServer(); // Connect to server
			this.sensorsManager.setNodeControlService(this.nodeControlService); // bind to Sensors manager
			this.actuatorsManager.setNodeControlService(this.nodeControlService); // bind to Actuators manager
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize net manager
   */

	}, {
		key: 'init_NodeNetManager',
		value: function init_NodeNetManager() {

			if (this.nodeNetManager != null) {
				throw 'Node net manager initialized.';
			}

			var node = this;

			//--- ¨¨ --- ¨¨ --- ¨¨ --- ¨¨ ---
			// Net Manager
			//-------------------------------------------------------------------------------|\/|---
			var ndm_Config = {
				"_node": node
			};

			node.nodeNetManager = new NodeNetManager(ndm_Config);
			//-------------------------------------------------------------------------------|/\|---
		}

		/**
   * Initialize net service
   */

	}, {
		key: 'init_NodeNetService',
		value: function init_NodeNetService() {

			if (this.nodeNetService != null) {
				throw 'Node net service initialized.';
			}

			var node = this;

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

	}, {
		key: '_byebye',
		value: function _byebye() {
			console.log('Have a great day!');

			this.nodeControlService.disconnectFromServer();
			this.sensorsManager.turnOffSensors();
			this.actuatorsManager.turnOffActuators();

			process.exit(0);
		}

		/**
   * Initialize Mini CLI
   */

	}, {
		key: 'init_MiniCLI',
		value: function init_MiniCLI() {

			if (this.miniCLI != null) {
				throw 'Mini CLI initialized.';
			}

			var stNode = this;

			this.miniCLI = readline.createInterface(process.stdin, process.stdout);
			this.miniCLI.setPrompt('STNode> ');
			this.miniCLI.prompt();

			this.miniCLI.on('line', function (line) {
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
			}).on('close', function () {
				stNode._byebye();
			});
		}
	}]);

	return STNode;
}();

module.exports = STNode;
//# sourceMappingURL=ST_Node.js.map
