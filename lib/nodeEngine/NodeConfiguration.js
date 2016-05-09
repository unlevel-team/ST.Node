"use strict";

//const fs = require('fs');

const NodeConfiguration_CONSTANTS = {
	"configFile" : "conf/nodeconfig.json"
};


class NodeConfiguration {
	
	
	constructor() {
		this.config = null;
		this.CONSTANTS = NodeConfiguration_CONSTANTS;
	}
	
	readFile() {
		var fs = require('fs');
		
		try {
			var obj = JSON.parse(fs.readFileSync(NodeConfiguration_CONSTANTS.configFile, 'utf8'));
			this.config = obj;
		} catch (e) {
			// TODO: handle exception
			console.log('NodeConfiguration.readFile Error');	// TODO REMOVE DEBUG LOG
			console.log(e.message);	// TODO REMOVE DEBUG LOG

		}
		
		console.log('NodeConfiguration.readFile OK');	// TODO REMOVE DEBUG LOG

    }
}

module.exports = NodeConfiguration;




