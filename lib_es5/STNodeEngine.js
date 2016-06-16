'use strict';

/**
 * SomeThings Node
 * 
 * starts a STNode
 */

// Gulp+Babel tricks ~ ~ - - ~ ~ ~ - - ~ \/ ~ ~
var devMode = false;

if (!process.argv[2] || process.argv[2] !== 'dev') {

	var gulp_babelTricks = require('./toES5.js');
	gulp_babelTricks.source_map_support_Install();
} else {

	devMode = true;
	console.log('Running in Dev mode...'); // TODO REMOVE DEBUG LOG
	console.log('Arguments'); // TODO REMOVE DEBUG LOG
	console.log(process.argv); // TODO REMOVE DEBUG LOG
}
// ~ - - ~ ~ ~ - - ~ ~ ~ - - ~ ~ ~ - - ~ /\ ~ ~

// require our modules
var STNode = require('./nodeEngine/ST_Node.js');

/**
 * ST Node Main loop
 */
var stNode = new STNode();

try {

	stNode._devMode = devMode;

	stNode.init_Node();

	stNode.init_NodeNetManager();
	stNode.init_NodeNetService();

	stNode.init_NodeCOMSystem();

	stNode.init_MiniCLI();
} catch (e) {

	// TODO: handle exception
	console.log("Something happens.");
	console.log(e);
}
//# sourceMappingURL=STNodeEngine.js.map
