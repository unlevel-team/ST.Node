"use strict";

//const fs = require('fs');

/**
 * Node configuration constants
 * @memberof st.nodeEngine
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeConfiguration_CONSTANTS = {
  "configFile": "conf/nodeconfig.json"
};

/**
 * The Sensor configuration JSON.
 * 
 * @typedef {Object} SensorConfig_JSON
 * @memberof st.nodeEngine.NodeConfiguration
 * @type Object
 * 
 * @property {string} id - Sensor ID
 * @property {string} type - Sensor type
 * @property {boolean} enabled - Enabled flag
 * @property {number} loopTime - loopTime
 * 
 * @property {object} options - Sensor options
 * @property {string} [options.sensorEngineURL] - Sensor engine URL
 * 
 * 
 */

/**
 * The Actuator configuration JSON.
 * 
 * @typedef {Object} ActuatorConfig_JSON
 * @memberof st.nodeEngine.NodeConfiguration
 * @type Object
 * 
 * @property {string} id - Sensor ID
 * @property {string} type - Sensor type
 * @property {boolean} enabled - Enabled flag
 * @property {number} loopTime - loopTime
 * 
 * @property {object} options - Sensor options
 * @property {string} [options.actuatorEngineURL] - Sensor engine URL
 * 
 * 
 */

/**
 * The NodeConfiguration JSON file.
 * 
 * @typedef {Object} NodeConfig_JSON
 * @memberof st.nodeEngine.NodeConfiguration
 * @type Object
 * 
 * @property {string} type='Config' - Type on JSON
 * @property {string} typeExtra='Node' - Type extra on JSON
 * 
 * @property {object} node - Node configuration
 * @property {string} node.nodeID - Node ID
 * @property {string} node.type='STNode' - type of node
 * 
 * @property {object} server - Server configuration
 * @property {string} server.netLocation - Net location
 * @property {number} server.controlPort - Control port
 * 
 * 
 * @property {st.nodeEngine.NodeConfiguration.SensorConfig_JSON[]} sensors - Sensors configuration
 * @property {st.nodeEngine.NodeConfiguration.ActuatorConfig_JSON[]} actuators - Actuators configuration
 * 
 * 
 */

/**
 * NodeConfiguration
 * 
 * @class
 * @memberof st.nodeEngine
 * 
 * @property {object} config - Configuration object
 * 
 */

var NodeConfiguration = function () {

  /**
   * 
   * @constructs NodeConfiguration
   */

  function NodeConfiguration() {
    _classCallCheck(this, NodeConfiguration);

    this.config = null;
    this.CONSTANTS = NodeConfiguration_CONSTANTS;
  }

  /**
   * Read configuration from file
   * 
   * @param {object} options - Options object
   * @param {string} [options.configFile] - configuration file path
   * 
   */


  _createClass(NodeConfiguration, [{
    key: "readFile",
    value: function readFile(options) {

      if (options === undefined) {
        options = {};
      }

      var _configFile = NodeConfiguration_CONSTANTS.configFile;
      if (options.configFile !== undefined) {
        _configFile = options.configFile;
      }

      var fs = require('fs');

      try {
        var obj = JSON.parse(fs.readFileSync(_configFile, 'utf8'));
        this.config = obj;
      } catch (e) {
        // TODO: handle exception
        console.log('NodeConfiguration.readFile Error'); // TODO REMOVE DEBUG LOG
        console.log(e.message); // TODO REMOVE DEBUG LOG
      }

      console.log('NodeConfiguration.readFile OK'); // TODO REMOVE DEBUG LOG
    }
  }]);

  return NodeConfiguration;
}();

module.exports = NodeConfiguration;
//# sourceMappingURL=NodeConfiguration.js.map
