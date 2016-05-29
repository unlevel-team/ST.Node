"use strict";


let EventEmitter = require('events').EventEmitter;


/**
 * NodeControlService CONSTANTS
 */
const NodeControlService_CONSTANTS = {
		"Events" : {
			"ConnectedToServer": "Connected to server",
			"DisconnectedFromServer": "Disconnected from server",
			"BadNodeConfig": "Bad Node Config",
			
			"ShutDownNode": "ShutDownNode"


		},
		
		"Messages" : {
			"getSTNetworkInfo" : "Get STNetwork Info",
			"STNetworkInfo" : "STNetwork Info",
			"getNodeInfo" : "Get Node Info",
			"NodeInfo" : "Node Info",
			"BadNodeConfig" : "Bad Node Config",
			
			"ShutDownNode" : "ShutDownNode"

		}
	};


/*
 * NodeControlService
 * 
 * Is the service for send and receive data control with ST Server
 * 
 */
class NodeControlService {
	
	
	constructor(config) {
		
		this.config = config;
		this.socket = null;
		this.eventEmitter = new EventEmitter();
		
		this.CONSTANTS = NodeControlService_CONSTANTS;
	}
	
	
	/**
	 * Connect to server
	 */
	connectToServer() {

		let ncs = this;
		
		if (ncs.socket !== null) {
			 throw "Already connected";
		}
		
		let serverURL = 'http://' +  ncs.config.server.netLocation + ':' + ncs.config.server.controlPort;
		

		ncs.socket = require('socket.io-client')(serverURL);
		
		ncs.mapControlMessages(ncs.socket);
		
		// Map connection to Server
		ncs.socket.on('connect', function(){	
			
			// Emit event ConnectedToServer
			ncs.eventEmitter.emit(ncs.CONSTANTS.Events.ConnectedToServer);
			
			// Emit message getSTNetworkInfo
			ncs.socket.emit(ncs.CONSTANTS.Messages.getSTNetworkInfo);
		});
		
		
		// Map disconnection from Server
		ncs.socket.on('disconnect', function(){	
			
			// Emit event DisconnectedFromServer
			ncs.eventEmitter.emit(ncs.CONSTANTS.Events.DisconnectedFromServer);

		});
	}
	
	
	
	/**
	 * Map control messages
	 */
	mapControlMessages(socket){
		
		let ncs = this;
		let node = ncs.config.node;
		
		  // Map Message STNetworkInfo
		  socket.on( ncs.CONSTANTS.Messages.STNetworkInfo, function(msg){
			  
			  console.log('<*> ST Node.Messages.STNetworkInfo');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG

		  });

		  
		  // Message getNodeInfo
		  socket.on( ncs.CONSTANTS.Messages.getNodeInfo, function(msg){
			  
			  let numberOfSensors = 0;
			  let numberOfActuators = 0;

			  if (ncs.config.sensors !== null && 
					  ncs.config.sensors.length > 0) {
				  numberOfSensors = ncs.config.sensors.length;
			  }
			  
			  if (ncs.config.actuators !== null && 
					  ncs.config.actuators.length > 0) {
				  numberOfActuators = ncs.config.actuators.length;
			  }
			  
			  let response = {
				"nodeID" : node.nodeID,
				"type" : node.type,
				
				"numSensors" : numberOfSensors,
				"numActuators" : numberOfActuators

			  };
			  
			  // Emit message NodeInfo
			  ncs.socket.emit(ncs.CONSTANTS.Messages.NodeInfo, response);
		  });

		  
		  // Map Message BadNodeConfig
		  socket.on( ncs.CONSTANTS.Messages.BadNodeConfig, function(msg){
			  
			  console.log('<*> ST Node.Messages.BadNodeConfig');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG

			  ncs.eventEmitter.emit(ncs.CONSTANTS.Events.BadNodeConfig, msg);
			  
		  });

		  
		  // Map Message ShutDownNode
		  socket.on( ncs.CONSTANTS.Messages.ShutDownNode, function(msg){
			  console.log('<*> ST Node.Messages.ShutDownNode');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG

			  // Emit message ShutDownNode
			  ncs.eventEmitter.emit(ncs.CONSTANTS.Events.ShutDownNode, msg);
			  
		  });
	}
	
	
	/**
	 * Disconnect from server
	 */
	disconnectFromServer() {
		
		let ncs = this;
		
		if (ncs.socket === null) {
			 throw "Not connected";
		}
		
		ncs.socket.close();
	}
	
	
	/**
	 * Message getNodeInfo
	 */
	_msg_getNodeInfo(socket, msg, options) {
		
		let ncs = this;
		let node = ncs.config.node;
		
		let response = {
			"nodeID" : node.nodeID,
			"type" : node.type,
		
			"numSensors" : 0,
			"numActuators" : 0

		};
		
		if (ncs.config.sensors !== null && 
			ncs.config.sensors.length > 0) {
				response.numberOfSensors = ncs.config.sensors.length;
		}
		  
		if (ncs.config.actuators !== null && 
				ncs.config.actuators.length > 0) {
				response.numberOfActuators = ncs.config.actuators.length;
		}
		
		// Emit message NodeInfo
		ncs.socket.emit(ncs.CONSTANTS.Messages.NodeInfo, response);
		
	}
	
	
}



module.exports = NodeControlService;