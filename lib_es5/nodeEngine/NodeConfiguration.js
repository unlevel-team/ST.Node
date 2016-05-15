"use strict";

//const fs = require('fs');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeConfiguration_CONSTANTS = {
	"configFile": "conf/nodeconfig.json"
};

var NodeConfiguration = function () {
	function NodeConfiguration() {
		_classCallCheck(this, NodeConfiguration);

		this.config = null;
		this.CONSTANTS = NodeConfiguration_CONSTANTS;
	}

	_createClass(NodeConfiguration, [{
		key: "readFile",
		value: function readFile() {
			var fs = require('fs');

			try {
				var obj = JSON.parse(fs.readFileSync(NodeConfiguration_CONSTANTS.configFile, 'utf8'));
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
