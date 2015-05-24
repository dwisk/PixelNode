/**
 * PixelNode_Input_WebSocket 
 * 
 * Ported fadecandy example
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
PixelNode_Input = require('../lib/PixelNode_Input.js');

// define the Student class
function PixelNode_Input_WebSocket(options,pixelData) {
  var self = this;
  PixelNode_Input_WebSocket.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_WebSocket";
}

// class inheritance 
util.inherits(PixelNode_Input_WebSocket, PixelNode_Input);

// module export
module.exports = PixelNode_Input_WebSocket;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_WebSocket.prototype.default_options = {};
PixelNode_Input_WebSocket.prototype.sockets = [];
PixelNode_Input_WebSocket.prototype.status_interval = 0;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_WebSocket.prototype.init = function() {
	// check if WebSErver is configured to run
	if (!config.webServer.start) {
		console.log("WebSimulator PixelDriver needs WebServer to be started!".red);
		console.log("Set webServer.start to true in PixelNode configuration.".grey);
		process.exit(1);
	}

	// start & remember this
	console.log("Init Input WebSocket".grey);
	
	this.initSockets();
	this.initStatusSender();

	global.pixelNode.data.set("changeTrigger", null);
	global.pixelNode.data.extend("inputs",{
	    buttons: {
	    	button1: false,
	    	button2: false,
	    	button3: false
	    },
	    touch: {
		    touches: [
		      false,
		      false,
		      false,
		      false,
		      false,
		      false,
		      false,
		      false,
		      false,
		      false,
		      false,
		      false
		    ]
	    }
  	});

}


/* Methods
 * ==================================================================================================================== */

PixelNode_Input_WebSocket.prototype.initStatusSender = function() {
	var self = this;
	global.pixelNode.data.on("changed", function(paths, value) {
		//if (global.pixelNode.data.get("changeTrigger") != null) {
		//	global.pixelNode.data.set("changeTrigger", "234u2342343", true);
		//}
		self.sendStatus.call(self);
	});
}

PixelNode_Input_WebSocket.prototype.initSockets = function() {
	var self = this;

	// wait for webSocket connections
	global.webSockets.on('connection', function (socket) {
		// emit input init and send options & config
		socket.emit('input_init', {
		  	options: self.options,
		  	config: global.config,
		  	data: global.pixelNode.data.copy()
	  	});

		// remember socket if input is inited
	  	socket.on('input_inited', function (data) {
	  		if (data.success) {
	  			console.log(("Input WebSocket connected ("+socket.conn.id+")").green);
	  			self.sockets.push(socket);
	  		}
	  	});

		// remember socket if simulator is inited
	  	socket.on('input_change', function (data) {
	  		global.pixelNode.data.set(data.target, data.value)
	  		global.pixelNode.data.set("changeTrigger", socket.id, true);
	  	});

	});
	
}

PixelNode_Input_WebSocket.prototype.sendStatus = function() {
	var self = this;
	this.sockets.forEach(function(socket) {
		// just send pixels if socket is still connected
		if(socket.connected) {
			if (global.pixelNode.data.get("changeTrigger") != socket.id) {
				socket.emit('input_status', global.pixelNode.data.copy());
			}
		// otherwise remove socket from array
		} else {
			console.log(("WebInput disconnected ("+socket.conn.id+")").red);
			self.sockets.splice(self.sockets.indexOf(socket),1);
		}
	});

	global.pixelNode.data.set("changeTrigger", null, true);
}


