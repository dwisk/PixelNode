/**
 * PixelNode_Driver_FadeCandy
 * 
 * LED Driver for FadeCandy
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var OPC = new require('./opc')
var util = require("util");


/* Class Constructor
 * ==================================================================================================================== */

// extending PixelNode_Driver
PixelNode_Driver = require('../PixelNode_Driver');

// define the Student class
function PixelNode_Driver_FadeCandy(options,pixelData) {
  var self = this;
  PixelNode_Driver_FadeCandy.super_.call(self, options, pixelData);
  this.className = "PixelNode_Driver_FadeCandy";
}

// class inheritance 
util.inherits(PixelNode_Driver_FadeCandy, PixelNode_Driver);

// module export
module.exports = PixelNode_Driver_FadeCandy;


/* Variables
 * ==================================================================================================================== */

PixelNode_Driver_FadeCandy.prototype.default_options = {
	pixelColorCorrection: true,
	offset: true
};
PixelNode_Driver_FadeCandy.prototype.client = {};


/* Overriden Methods
 * ==================================================================================================================== */

 // init driver
PixelNode_Driver_FadeCandy.prototype.init = function() {
	console.log("Init PixelDriver FadeCandy:", this.options);

	// get new OPC / fadecandy client
	this.client = new OPC(this.options.address, this.options.port);

	// start painter
	this.startPainter.call(this);
};

// set's a pixel via fadecandy client
PixelNode_Driver_FadeCandy.prototype.setPixel = function(id, r,g,b) {
	this.client.setPixel(id, r, g, b);
}

// tells fadecandy client to write pixels
PixelNode_Driver_FadeCandy.prototype.sendPixels = function() {
	this.client.writePixels();
}

