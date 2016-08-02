/**
 * SomeThings Node
 * 
 * starts a STNode
 */

/**
 * SomeThins project
 * 
 * @namespace st
 */


/**
 * SomeThings Node Engine
 * 
 * @namespace st.nodeEngine
 * @memberof  st
 * 
 */



// Gulp+Babel tricks ~ ~ - - ~ ~ ~ - - ~ \/ ~ ~
var devMode = false;

if (!process.argv[2] || 
		process.argv[2] !== 'dev') {
	
	var gulp_babelTricks = require('./toES5.js');
	gulp_babelTricks.source_map_support_Install();
	
} else {
	
	devMode = true;
	console.log('Running in Dev mode...');	// TODO REMOVE DEBUG LOG
	console.log('Arguments');	// TODO REMOVE DEBUG LOG
	console.log(process.argv);	// TODO REMOVE DEBUG LOG
}
// ~ - - ~ ~ ~ - - ~ ~ ~ - - ~ ~ ~ - - ~ /\ ~ ~


// Parse arguments
var _sliceIndex = 2;
if (devMode === true) {
	_sliceIndex++;
}

var _argv = require('minimist')(process.argv.slice(_sliceIndex));
console.log(_argv);	// TODO REMOVE DEBUG LOG


/**
 * import STNode
 * @ignore
 */
const STNode = require('./nodeEngine/ST_Node.js');

// Set node options
var _nOptions = {
	'config': {
		'devMode': devMode,
		'argv': _argv
	}	
};

if (_argv.configfile !== undefined) {
	_nOptions.config.configfile = _argv.configfile;
}



/**
 * ST Node Main loop
 * 
 * @ignore
 * 
 */
var stNode = new STNode(_nOptions);

try {
	
	try {
		stNode.init_Node();	
	} catch (e) {
		// TODO: handle exception
		throw "Cannot initialize ST Node. " + e;
	}
	
	
	try {
		stNode.init_NodeNetManager();
	} catch (e) {
		// TODO: handle exception
		throw "Cannot initialize Node Net manager. " + e;
	}
	
	
	try {
		stNode.init_NodeNetService();
	} catch (e) {
		// TODO: handle exception
		throw "Cannot initialize Node Net service. " + e;
	}
	
	try {
		stNode.init_NodeCOMSystem();
	} catch (e) {
		// TODO: handle exception
		throw "Cannot initialize Node COM System. " + e;
	}
	
	
	try {
		stNode.init_MiniCLI();
	} catch (e) {
		// TODO: handle exception
		throw "Cannot initialize MiniCLI. " + e;
	}
	
} catch (e) {
	
	// TODO: handle exception
	console.log("Something happens.");
	console.log(e);
}




