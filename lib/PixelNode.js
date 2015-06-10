/**
 * PixelNode 
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Inclues
 * ==================================================================================================================== */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var extend = require('util')._extend;
var path = require('path');
var colors = require('colors');

/* Local Includes
 * ==================================================================================================================== */

var PixelNode_WebServer = require('./PixelNode_WebServer');
var PixelNode_GameManager = require('./PixelNode_GameManager.js');
var PixelNode_Data = require('./PixelNode_Data.js');
var PixelNode_Clock = require('./PixelNode_Clock.js');
var PixelNode_InputManager = require("./PixelNode_InputManager.js");	


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode(options) {
	EventEmitter.call(this);

	options = extend(this.default_options, options);
	this.options = options;

	global.pixelNode = this;
	var self = this;

	/* Files
	 * ---------------------------------------------------------------------------------------------------------------- */

	// load config
	global.config = PixelNode.getOption(options.config);

	// load mapping
	global.mapping = PixelNode.getOption(options.mapping);


	/* Modules
	 * ---------------------------------------------------------------------------------------------------------------- */

	// init Data
	self.data = new PixelNode_Data();

	// init Clock
	self.clock = new PixelNode_Clock();

	// init gameManager
	self.gameManager = new PixelNode_GameManager();

	// init webserver
	self.webServer = new PixelNode_WebServer(config.webServer);

	// init pixeldriver
	var PixelDrivers = [];
	global.config.pixelDrivers.forEach(function(pixelDriverConfig) {
		PixelDriver = PixelNode.requireFile(pixelDriverConfig.module);
		self.pixelDrivers.push(new PixelDriver(pixelDriverConfig, self.gameManager.pixelData));
	});

	// init inputmanager
	self.inputManager = new PixelNode_InputManager();

	self.emit("ready");
}

// PixelNode inherits EventEmitter
util.inherits(PixelNode, EventEmitter);

// module export
module.exports = PixelNode;


/* Variables
 * ==================================================================================================================== */

PixelNode.prototype.default_options = {
	config: "config.json",
	mapping: "mapping.json",
	server_InputManager: './PixelNode_InputManager_Server.js',
	client_InputManager: './PixelNode_InputManager.js'
}
PixelNode.prototype.options = {}
PixelNode.prototype.pixelDrivers = []
PixelNode.prototype.webServer = null
PixelNode.prototype.gameManager = null
PixelNode.prototype.inputManager = null
PixelNode.prototype.data = null


/* Methods
 * ==================================================================================================================== */

/**
 * @param option {String|Object}
 * @return {Object} 
 */

PixelNode.getOption = function(option) {
	if (typeof option == "string") {
		return PixelNode.requireFile(option);
	} else if (typeof option == "object") {
		return option;
	} else {
		return null;
	}
}

PixelNode.requireFile = function(filename) {
	if (filename.indexOf("./") !== 0) {
		var appDir = path.dirname(require.main.filename);
		try {
		    return require(appDir + "/" + filename);
		} catch(e) {
			if (e.toString().indexOf(".json") >= 0)  { 
				console.log(("JSON Parse error in "+filename+"!").red);
				console.log(e.toString().grey) 
				process.exit(1);
			} else {
		    	return require(filename);
		    }
		}

	} else {
		return require(filename);
	}
}


