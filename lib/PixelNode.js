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
var PixelNode_FontManager = require("./PixelNode_FontManager.js");


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
	global.mapping = PixelNode.parseMapping(PixelNode.getOption(options.mapping));


	/* Modules
	 * ---------------------------------------------------------------------------------------------------------------- */

	// init Data
	self.data = new PixelNode_Data();

	// init Clock
	self.clock = new PixelNode_Clock();

  // init fontmanager
	self.fontManager = new PixelNode_FontManager();

	// init gameManager
	self.gameManager = new PixelNode_GameManager(config.gameManager);

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
PixelNode.prototype.fontManager = null
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

PixelNode.parseMapping = function(mapping) {
	mapping.forEach(function(map) {
		if (map.matrix) {
			var strips = [];
			for (var x = 0; x < map.sizeX; x++) {
				pixels = [];
				for (var y = 0; y < map.sizeY; y++) {
					pixels.push([x,y]);
				}
        if (map.flip) pixels = pixels.reverse();
				strips.push({"px": pixels})
			}

			var rings = [];
			for (var x = 0; x < map.sizeY; x++) {
				pixels = [];
				for (var y = 0; y < map.sizeX; y++) {
					pixels.push([y,x]);
				}
        if (map.flip) pixels = pixels.reverse();
				rings.push({"px": pixels})
			}

      if (map.flip) {
        rings = rings.reverse();
        strips = strips.reverse();
      }

			if (map.rotate == true) {
				map.strips = rings;
				map.rings = strips;
			} else {
				map.strips = strips;
				map.rings = rings;

			}
		}
	});

	return mapping;
}
