/**
 * PixelNode_WebSocket 
 * 
 * Websocket Server
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Includes
 * ==================================================================================================================== */


 const express = require('express');
 const http = require('http');
 

/* Class Constructor
 * ==================================================================================================================== */

class PixelNode_WebSocket {


	constructor(options) {
		this.options = {...this.constructor.default_options, ...options};
		
		this.webSocket = null;
		this.sockets = [];
		this.status_interval = 0;
	

		this.init();
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		port: 3001,
		start: true,
	};


	/* Overridden Methods
	* ==================================================================================================================== */

	init() {
		if (this.options.start) {
			this.initWebserver();
		} else {
			console.log("WebSocket deactivated.".grey);
			return;
		}

		// start & remember this
		console.log("Init WebSocket Server".grey);
		
		this.initSockets();
		this.initStatusSender();

		global.pixelNode.data.set("changeTrigger", null);
		global.pixelNode.data.extend("inputs", {});
	}


	/* Methods
	* ==================================================================================================================== */

	initWebserver() {
		console.log('Init WebServer'.grey);
		const app =  express();
	
		// Settings
		app.set('port', process.env.PORT || this.options.port);
	
		// start server
		this.server = http.createServer(app).listen(app.get('port'), function () {
			console.log(('WebServer listening on port ' + app.get('port')).green);
		});
	
		// start socket.io for websockets
		const io = require('socket.io').listen(this.server)
		this.webSocket = io.sockets;
	}

	initStatusSender() {
		var self = this;
		global.pixelNode.data.on("changed", function(paths, value) {
			self.sendStatus.call(self, paths, value);
		});
	}

	initSockets() {
		var self = this;

		// wait for webSocket connections
		this.webSocket.on('connection', function (socket) {
			// emit input init and send options & config
			socket.emit('data_init', {
				options: self.options,
				config: global.config,
				data: global.pixelNode.data.copy(),
				timestamp: new Date()
			});

			// remember socket if input is inited
			socket.on('data_client_inited', function (data) {
				if (data.success) {
					console.log(("Input WebSocket connected ("+socket.conn.id+")").green);
					self.sockets.push(socket);
				}
			});

			// receiving data
			socket.on('input_change', function (data) {
				global.pixelNode.data.set(data.target, data.value)
				global.pixelNode.data.set("changeTrigger", socket.id, true);
			});

		});
		
	}

	sendStatus(paths, value) {
		var self = this;
		this.sockets.forEach(function(socket) {
			// just send pixels if socket is still connected
			if(socket.connected) {
				if (global.pixelNode.data.fastGet("changeTrigger") != socket.id) {
					socket.emit('data_changed', {
						path: paths,
						data: global.pixelNode.data.get(paths)
					});
				}
			// otherwise remove socket from array
			} else {
				console.log(("WebInput disconnected ("+socket.conn.id+")").red);
				self.sockets.splice(self.sockets.indexOf(socket),1);
			}
		});

		global.pixelNode.data.set("changeTrigger", null, true);
	}

}

// module export
module.exports = PixelNode_WebSocket;
