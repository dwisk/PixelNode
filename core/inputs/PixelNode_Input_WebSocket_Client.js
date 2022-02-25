/**
 * PixelNode_Input_WebSocket_Client
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var _ = require('underscore');


/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Input = require('pixelnode-input');

// define the Student class
function PixelNode_Input_WebSocket_Client(options,pixelData) {
  var self = this;
  PixelNode_Input_WebSocket_Client.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_WebSocket_Client";
}

// class inheritance
util.inherits(PixelNode_Input_WebSocket_Client, PixelNode_Input);

// module export
module.exports = PixelNode_Input_WebSocket_Client;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_WebSocket_Client.prototype.default_options = {
	server: 'http://beaglebone.local:3001'
};
PixelNode_Input_WebSocket_Client.prototype.sockets = [];
PixelNode_Input_WebSocket_Client.prototype.status_interval = 0;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_WebSocket_Client.prototype.init = function() {
	// start
	console.log("Init Input WebSocket Client".grey);

	this.initSockets();
}


/* Methods
 * ==================================================================================================================== */

PixelNode_Input_WebSocket_Client.prototype.initSockets = function() {
	var self = this;

	// Connect to server
	var io = require('socket.io-client')
	var socket = require("socket.io-client")(self.options.server); // This is a client connecting to the SERVER 2

	// event listener for connection
	socket.on("connect",function(){
		console.log('WebSocket Connected!'.green);
	});

	// event listener for initialization
	socket.on('data_init', function (data) {
	  console.log("Websocket Init");

	  // save data
	  global.pixelNode.data.replace({...data.data, ...{clockSet: data.timestamp}});

	  // emit success
	  socket.emit('data_client_inited', {success:true});
	});

	// event listener for new data
	socket.on('data_changed', function (data) {
	  //console.log("Websocket: data changed", data.path, data.data);

	  global.pixelNode.data.set(data.path, data.data, true);
	  // replace data
	  //global.pixelNode.data.replace(data);
	});

}
