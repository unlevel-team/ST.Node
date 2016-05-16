/**
 * SomeThings Node
 * 
 * starts a STNode
 */


// Gulp+Babel tricks · · - - · · · - - · \/ · ·
if (!process.argv[2] || 
		process.argv[2] != 'dev') {
	
	var gulp_babelTricks = require('./toES5.js');
	gulp_babelTricks.source_map_support_Install();
	
} else {
	console.log('Running in Dev mode...');	// TODO REMOVE DEBUG LOG
	console.log('Arguments');	// TODO REMOVE DEBUG LOG
	console.log(process.argv);	// TODO REMOVE DEBUG LOG
}
// · - - · · · - - · · · - - · · · - - · /\ · ·


// require our modules
const STNode = require('./nodeEngine/ST_Node.js');


/**
 * ST Node Main loop
 */
var stNode = new STNode();

stNode.init_Node();
stNode.init_NodeControlService();

stNode.init_NodeNetManager();
stNode.init_NodeNetService();

stNode.init_MiniCLI();


