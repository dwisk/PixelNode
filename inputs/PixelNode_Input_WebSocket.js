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

	global.pixelNode_data.changeTrigger = null;

	global.pixelNode_data.inputs = _.extend(global.pixelNode_data.inputs, {
	    button1: false,
	    button2: false,
	    button3: false,

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
  	});

}


/* Methods
 * ==================================================================================================================== */

PixelNode_Input_WebSocket.prototype.initStatusSender = function() {
	var self = this;
	Object.observe(global.pixelNode_data, function(changes) {
		if (!global.pixelNode_data) {
			global.pixelNode_data.changeTrigger = "234u2342343";
		}
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
		  	data: _.extend({},global.pixelNode_data)
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
	  		var path = data.target.split(".");
	  		if (path.length == 2) {
		  		if (global.pixelNode_data[path[0]][path[1]] != data.value) {
			  		global.pixelNode_data[path[0]][path[1]] = data.value;
			  		global.pixelNode_data.changeTrigger = socket.id;
			  		console.log("Input Change: ".grey+(data.target+" = "+data.value).white);
		  		}
		  	} else {
		  		if (global.pixelNode_data[path[0]] != data.value) {
		  			global.pixelNode_data[path[0]] = data.value;
			  		global.pixelNode_data.changeTrigger = socket.id;
			  		console.log("Input Change: ".grey+(data.target+" = "+data.value).white);
				}
		  	}
	  	});

	});
	
}

PixelNode_Input_WebSocket.prototype.sendStatus = function() {
	var self = this;
	this.sockets.forEach(function(socket) {
		// just send pixels if socket is still connected
		if(socket.connected) {
			if (global.pixelNode_data.changeTrigger != socket.id) {
				socket.emit('input_status', _.extend({},global.pixelNode_data));
			}
		// otherwise remove socket from array
		} else {
			console.log(("WebInput disconnected ("+socket.conn.id+")").red);
			self.sockets.splice(self.sockets.indexOf(socket),1);
		}
	});

	global.pixelNode_data.changeTrigger = null;
}


