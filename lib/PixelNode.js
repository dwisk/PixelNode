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

var extend = require('util')._extend;
var path = require('path');

/* Local Includes
 * ==================================================================================================================== */

var WebServer = require('./PixelNode_WebServer');
var EffectSwitcher = require('./PixelNode_EffectSwitcher.js');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode(options) {
	options = extend(this.default_options, options);
	this.options = options;

	/* Files
	 * ---------------------------------------------------------------------------------------------------------------- */

	// load config
	global.config = PixelNode.getOption(options.config);

	// load mapping
	global.mapping = PixelNode.getOption(options.mapping);


	/* Modules
	 * ---------------------------------------------------------------------------------------------------------------- */

	// init webserver
	var webServer = new WebServer(config.webServer);

	// init effectswitcher
	var effectSwitcher = new EffectSwitcher();

	// init pixeldriver
	var self = this;
	var PixelDrivers = [];
	global.config.pixelDrivers.forEach(function(pixelDriverConfig) {
		PixelDriver = PixelNode.requireFile(pixelDriverConfig.module);
		self.pixelDrivers.push(new PixelDriver(pixelDriverConfig, effectSwitcher.pixelData));
	});
//	console.log(self.pixelDrivers);

	// init inputmanager
	if (config.inputMode == "server") {
		InputManager = PixelNode.requireFile(options.server_InputManager);	
	} else {
		InputManager = PixelNode.requireFile(options.client_InputManager);	
	}
	var inputManager = new InputManager();
}

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
	if (filename.indexOf("./") != 0) {
		var appDir = path.dirname(require.main.filename);
		return require(appDir + "/" + filename);
	} else {
		return require(filename);
	}
}


