"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events').EventEmitter;

/**
 * NodeControlService CONSTANTS
 */
var NodeControlService_CONSTANTS = {
	"Events": {
		"ConnectedToServer": "Connected to server",
		"DisconnectedFromServer": "Disconnected from server",
		"BadNodeConfig": "Bad Node Config",

		"ShutDownNode": "ShutDownNode"

	},

	"Messages": {
		"getSTNetworkInfo": "Get STNetwork Info",
		"STNetworkInfo": "STNetwork Info",
		"getNodeInfo": "Get Node Info",
		"NodeInfo": "Node Info",
		"BadNodeConfig": "Bad Node Config",

		"ShutDownNode": "ShutDownNode"

	}
};

/*
 * NodeControlService
 * 
 * Is the service for send and receive data control with ST Server
 * 
 */

var NodeControlService = function () {
	function NodeControlService(config) {
		_classCallCheck(this, NodeControlService);

		this.config = config;
		this.socket = null;
		this.eventEmitter = new EventEmitter();

		this.CONSTANTS = NodeControlService_CONSTANTS;
	}

	/**
  * Connect to server
  */


	_createClass(NodeControlService, [{
		key: "connectToServer",
		value: function connectToServer() {

			var ncs = this;

			if (ncs.socket != null) {
				throw "Already connected";
			}

			var serverURL = 'http://' + ncs.config.server.netLocation + ':' + ncs.config.server.controlPort;

			ncs.socket = require('socket.io-client')(serverURL);

			ncs.mapControlMessages(ncs.socket);

			ncs.socket.on('connect', function () {
				// Map connection to Server
				ncs.eventEmitter.emit(ncs.CONSTANTS.Events.ConnectedToServer);

				ncs.socket.emit(ncs.CONSTANTS.Messages.getSTNetworkInfo);
			});

			ncs.socket.on('disconnect', function () {
				// Map disconnection from Server
				ncs.eventEmitter.emit(ncs.CONSTANTS.Events.DisconnectedFromServer);
			});
		}

		/**
   * Map control messages
   */

	}, {
		key: "mapControlMessages",
		value: function mapControlMessages(socket) {

			var ncs = this;

			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|··· 
			// Message STNetworkInfo
			socket.on(ncs.CONSTANTS.Messages.STNetworkInfo, function (msg) {
				console.log('<*> ST Node.Messages.STNetworkInfo'); // TODO REMOVE DEBUG LOG
				console.log(msg); // TODO REMOVE DEBUG LOG
			});
			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|··· 

			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|··· 
			// Message getNodeInfo
			socket.on(ncs.CONSTANTS.Messages.getNodeInfo, function (msg) {

				var numberOfSensors = 0;
				var numberOfActuators = 0;

				if (ncs.config.sensors != null && ncs.config.sensors.length > 0) {
					numberOfSensors = ncs.config.sensors.length;
				}

				if (ncs.config.actuators != null && ncs.config.actuators.length > 0) {
					numberOfActuators = ncs.config.actuators.length;
				}

				var response = {
					"nodeID": ncs.config.node.nodeID,
					"type": ncs.config.node.type,

					"numSensors": numberOfSensors,
					"numActuators": numberOfActuators

				};

				ncs.socket.emit(ncs.CONSTANTS.Messages.NodeInfo, response);
			});
			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|··· 

			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|··· 
			// Message BadNodeConfig
			socket.on(ncs.CONSTANTS.Messages.BadNodeConfig, function (msg) {
				console.log('<*> ST Node.Messages.BadNodeConfig'); // TODO REMOVE DEBUG LOG
				console.log(msg); // TODO REMOVE DEBUG LOG

				ncs.eventEmitter.emit(ncs.CONSTANTS.Events.BadNodeConfig, msg);
			});
			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|··· 

			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|··· 
			// Message ShutDownNode
			socket.on(ncs.CONSTANTS.Messages.ShutDownNode, function (msg) {
				console.log('<*> ST Node.Messages.ShutDownNode'); // TODO REMOVE DEBUG LOG
				console.log(msg); // TODO REMOVE DEBUG LOG

				ncs.eventEmitter.emit(ncs.CONSTANTS.Events.BadNodeConfig, msg);
			});
			// · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···
		}

		/**
   * Disconnect from server
   */

	}, {
		key: "disconnectFromServer",
		value: function disconnectFromServer() {

			var ncs = this;

			if (ncs.socket == null) {
				throw "Not connected";
			}

			ncs.socket.close();
		}
	}]);

	return NodeControlService;
}();

module.exports = NodeControlService;
//# sourceMappingURL=NodeControlService.js.map
