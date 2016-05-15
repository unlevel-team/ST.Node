"use strict";

/*
 Node Net manager
 
 - Provides net management for node.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node
 
 
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataChannelsManager = require('../stNetwork/DataChannel.js').DataChannelsManager;

/**
 * Node net manager
 */

var NodeNetManager = function (_DataChannelsManager) {
	_inherits(NodeNetManager, _DataChannelsManager);

	function NodeNetManager(config) {
		_classCallCheck(this, NodeNetManager);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeNetManager).call(this));

		_this.config = config;

		return _this;
	}

	/**
  * Add data channel to node
  */


	_createClass(NodeNetManager, [{
		key: 'addDataChannelToNode',
		value: function addDataChannelToNode(dchID, config) {

			var nnetm = this;
			var node = nnetm.config._node;
			var nodeConfig = node.nodeConfiguration.config;

			var dch_Config = {
				id: dchID,
				type: nnetm.CONSTANTS.Config.DCtype_socketio,
				_nodeID: nodeConfig.node.nodeID,
				_node: node,
				_dchID: nodeConfig.node.nodeID + '.' + dchID,
				_netState: nnetm.CONSTANTS.States.DCstate_Config
			};

			// · · · ^^^ · · ·  ^^^ · · ·  ^^^ · · · ^^^ · · ·  ^^^ · |\/|···
			// Extra config parameters
			if (config != undefined && config != null) {

				if (config.mode) {
					dch_Config.mode = config.mode;
				}

				if (config.socketPort) {
					dch_Config.socketPort = config.socketPort;
				}

				if (config.netLocation) {
					dch_Config.netLocation = config.netLocation;
				}
			}
			// · · · ^^^ · · ·  ^^^ · · ·  ^^^ · · · ^^^ · · ·  ^^^ · |/\|···

			var dch = DataChannelsManager.get_DataChannel(dch_Config);

			nnetm.addDataChannel(dch);
		}

		/**
   * Set data channel options
   */

	}, {
		key: 'setDCOptions',
		value: function setDCOptions(dch, options) {

			var nnetm = this;

			if (dch.config.state == dch.CONSTANTS.States.DCstate_Working) {
				throw "Bad data channel state";
			}

			if (options.loopTime) {
				dch.config.loopTime = options.loopTime;
			}

			if (options.netLocation) {
				dch.config.netLocation = options.netLocation;
			}

			if (options.socketPort) {
				dch.config.socketPort = options.socketPort;
			}
		}
	}]);

	return NodeNetManager;
}(DataChannelsManager);

module.exports = NodeNetManager;
//# sourceMappingURL=NodeNetManager.js.map
