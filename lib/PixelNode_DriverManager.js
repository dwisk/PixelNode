/**
 * PixelNode_DriverManager 
 * 
 * Base class for managing inputs
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

var extend = require('util')._extend;
var fork = require('child_process').fork;


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_DriverManager(options) {	
	this.options = extend(extend(this.base_options, this.default_options), options);

	// call init
	this.init();
}

// module export
module.exports = PixelNode_DriverManager;


/* Variables
 * ==================================================================================================================== */

PixelNode_DriverManager.prototype.base_options = {}
PixelNode_DriverManager.prototype.default_options = {}
PixelNode_DriverManager.prototype.options = {}
PixelNode_DriverManager.prototype.pixelDrivers = []
PixelNode_DriverManager.prototype.pixelCache = []


/* Methods
 * ==================================================================================================================== */

PixelNode_DriverManager.prototype.init = function() {
	console.log("Init PixelNode_DriverManager Base".grey);

	var self = this;

	// init pixeldriver
	global.config.pixelDrivers.forEach(function(pixelDriverConfig) {
		//PixelDriver = require(pixelDriverConfig.module);
		console.log("Init PixelDriver".grey, pixelDriverConfig.module)
		pixelDriver = fork(__dirname+"/PixelNode_DriverFork");
		pixelDriver.on('message', function(data) {
		  console.log('pixelDriver data: '.yellow, data);
		});
		pixelDriver.on('error', function(data) {
		  console.log('pixelDriver error: '.red, data);
		});
		pixelDriver.on('close', function(code) {
		  console.log('pixelDriver close: '.red, code);
		});
		pixelDriver.send({
			action: "config", 
			config: pixelDriverConfig,
			mapping: global.mapping
		});
		self.pixelDrivers.push(pixelDriver);
		


		//self.pixelDrivers.push(new PixelDriver(pixelDriverConfig, global.pixelNode.gameManager.pixelData));
	});

};


PixelNode_DriverManager.prototype.setPixel = function(target, ring, pixel,color) {
	var self = this;

	self.pixelDrivers.forEach(function(pixelDriver) {
		pixelDriver.send({action:"pixel", target:target, ring:ring, pixel:pixel, color:color})
	})
	
};