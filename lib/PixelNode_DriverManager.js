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

	var self = this;

	// init pixeldriver
	global.config.pixelDrivers.forEach(function(pixelDriverConfig) {
		PixelDriver = require(pixelDriverConfig.module);
		self.pixelDrivers.push(new PixelDriver(pixelDriverConfig, global.pixelNode.gameManager.pixelData));
	});


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


/* Methods
 * ==================================================================================================================== */

PixelNode_DriverManager.prototype.init = function() {
	console.log("Init PixelNode_DriverManager Base".grey);
	
};


PixelNode_DriverManager.prototype.setPixel = function(target, ring, pixel,color) {
	var self = this;

	self.pixelDrivers.forEach(function(pixelDriver) {
		pixelDriver.send({action:"pixel", target:target, ring:ring, pixel:pixel, color:color})
	})
	
};