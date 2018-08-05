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
var fs = require('fs');

/* Local Includes
 * ==================================================================================================================== */

var PixelNode_WebServer = require('./PixelNode_WebServer');
var PixelNode_GameManager = require('./PixelNode_GameManager.js');
var PixelNode_Data = require('./PixelNode_Data.js');
var PixelNode_Clock = require('./PixelNode_Clock.js');
var PixelNode_InputManager = require("./PixelNode_InputManager.js");
var PixelNode_FontManager = require("./PixelNode_FontManager.js");
var PixelNode_Sound = require("./PixelNode_Sound.js");


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

  // init soundmanager
	self.sound = new PixelNode_Sound(config.sound);

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

global.pixelnodeRequireFile = PixelNode.requireFile = function(filename) {
	var appDir = path.dirname(require.main.filename);
	if (filename.indexOf("./") !== 0) {
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
		try {
			return require(filename);
		} catch(e) {
			if (filename.indexOf("./") == 0) {
				return require(filename.replace("./", appDir + "/"));
			} else {
				console.log(e.toString().grey)
				process.exit(1);
			}
		}
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
		} else if (map.createStrips) {
			map.rings = [];
			var r = 0;
			map.strips.forEach(function(strip) {
				strip.px = [];
				if (strip.serial) {
					strip.serial.forEach(function(sequence) {
						if (sequence.from < sequence.to) {
							for (var i = sequence.from; i <= sequence.to; i++) {
								strip.px.push([sequence.nbr, i]);
								if (!map.rings[i]) {
									map.rings[i] = {px: []};
								}
								map.rings[i].px.push([sequence.nbr, i]);
							}
						} else {
							for (var i = sequence.from; i >= sequence.to; i--) {
								strip.px.push([sequence.nbr, i]);
								if (!map.rings[i]) {
									map.rings[i] = {px: []};
								}
								map.rings[i].px.push([sequence.nbr, i]);
							}

						}
					})
				}
			});
		} else if (map.csv) {
			map.rings = [];
			map.strips = [];
			var csvfile = fs.readFileSync(map.csv.file).toString();
			var ringIds = csvfile.split("\n");
			var group = map.csv.group || 10;

			for (var i = 0; i < ringIds.length; i++) {
				var stripIds = ringIds[i].split("\t");

				var ringId = Math.floor(i/1);
				for (var j = 0; j < stripIds.length; j++) {
					var stringId = Math.floor(j/group);
					if (!map.rings[ringId]) map.rings[ringId] = {px:[]};

					// rings
					if (stripIds[j] >= 0) {
						if (typeof map.rings[ringId].px[stringId] == "undefined") map.rings[ringId].px[stringId] = [0];
						map.rings[ringId].px[stringId].push(stripIds[j]);
					}

					// strips
					if (!map.strips[stringId]) map.strips[stringId] = {px:[]};
					if (stripIds[j] >= 0) {
						if (typeof map.strips[stringId].px[ringId] == "undefined") map.strips[stringId].px[ringId] = [0];
						map.strips[stringId].px[ringId].push(stripIds[j]);
					}

				}


			}

			// fs.writeFileSync("parsedStrips.json", JSON.stringify(map.strips, null, 4) )
			// fs.writeFileSync("parsedRings.json", JSON.stringify(map.rings, null, 4) )
		}
	});

	return mapping;
}
