'use strict';

// require our modules
var STNode = require('./nodeEngine/ST_Node.js');

/**
 * ST Node Main loop
 */
var stNode = new STNode();

stNode.init_Node();
stNode.init_NodeControlService();

stNode.init_NodeNetManager();
stNode.init_NodeNetService();

stNode.init_MiniCLI();
//# sourceMappingURL=STNodeEngine.js.map
