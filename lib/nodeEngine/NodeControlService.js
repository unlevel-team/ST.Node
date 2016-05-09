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
		if (this.socket != null) {
			 throw "Already connected";
		}
		
		let ncs = this;
		
		
		let serverURL = 'http://' +  this.config.server.netLocation + ':' + this.config.server.controlPort;
		

		this.socket = require('socket.io-client')(serverURL);
		
		this.mapControlMessages(this.socket);
		
		this.socket.on('connect', function(){	// Map connection to Server
			  ncs.eventEmitter.emit(ncs.CONSTANTS.Events.ConnectedToServer);
			  
			  ncs.socket.emit(ncs.CONSTANTS.Messages.getSTNetworkInfo);
		});
		

		this.socket.on('disconnect', function(){	// Map disconnection from Server
			  ncs.eventEmitter.emit(ncs.CONSTANTS.Events.DisconnectedFromServer);

		});
	}
	
	
	
	/**
	 * Map control messages
	 */
	mapControlMessages(socket){
		var ncs = this;
		
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message STNetworkInfo
		  socket.on( ncs.CONSTANTS.Messages.STNetworkInfo, function(msg){
			  console.log('<*> ST Node.Messages.STNetworkInfo');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG


		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
		  
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message getNodeInfo
		  socket.on( ncs.CONSTANTS.Messages.getNodeInfo, function(msg){
			  
			  let numberOfSensors = 0;
			  let numberOfActuators = 0;

			  if (ncs.config.sensors != null && 
					  ncs.config.sensors.length > 0) {
				  numberOfSensors = ncs.config.sensors.length;
			  }
			  
			  if (ncs.config.actuators != null && 
					  ncs.config.actuators.length > 0) {
				  numberOfActuators = ncs.config.actuators.length;
			  }
			  
			  let response = {
				"nodeID" : ncs.config.node.nodeID,
				"type" : ncs.config.node.type,
				
				"numSensors" : numberOfSensors,
				"numActuators" : numberOfActuators

			  };
			  
			  ncs.socket.emit(ncs.CONSTANTS.Messages.NodeInfo, response);
		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  

		  
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message BadNodeConfig
		  socket.on( ncs.CONSTANTS.Messages.BadNodeConfig, function(msg){
			  console.log('<*> ST Node.Messages.BadNodeConfig');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG

			  ncs.eventEmitter.emit(ncs.CONSTANTS.Events.BadNodeConfig, msg);
			  
		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
		  
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |\/|···  
		  // Message ShutDownNode
		  socket.on( ncs.CONSTANTS.Messages.ShutDownNode, function(msg){
			  console.log('<*> ST Node.Messages.ShutDownNode');	// TODO REMOVE DEBUG LOG
			  console.log(msg);	// TODO REMOVE DEBUG LOG

			  ncs.eventEmitter.emit(ncs.CONSTANTS.Events.BadNodeConfig, msg);
			  
		  });
		  // · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · ·  ¨¨¨  · · · · · · |/\|···  
	}
	
	
	/**
	 * Disconnect from server
	 */
	disconnectFromServer() {
		if (this.socket == null) {
			 throw "Not connected";
		}
		
		this.socket.close();
	}
}



module.exports = NodeControlService;