/**
 * PixelNode_Driver_RGBMatrix
 *
 * Pixel Driver for RGBMatrix
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var LedMatrix = require("node-rpi-rgb-led-matrix");
var util = require("util");
var colors = require('colors');


/* Class Constructor
 * ==================================================================================================================== */

// extending PixelNode_Driver
PixelNode_Driver = require('pixelnode-driver');

// define the Student class
function PixelNode_Driver_RGBMatrix(options,pixelData) {
  var self = this;
  PixelNode_Driver_RGBMatrix.super_.call(self, options, pixelData);
  this.className = "PixelNode_Driver_RGBMatrix";
}

// class inheritance
util.inherits(PixelNode_Driver_RGBMatrix, PixelNode_Driver);

// module export
module.exports = PixelNode_Driver_RGBMatrix;


/* Variables
 * ==================================================================================================================== */

PixelNode_Driver_RGBMatrix.prototype.default_options = {
	dimmer: 1,
  rows: 32,
  chainedDisplays: 1
};
PixelNode_Driver_RGBMatrix.prototype.matrix;


/* Overriden Methods
 * ==================================================================================================================== */

 // init driver
PixelNode_Driver_RGBMatrix.prototype.init = function() {
	var self = this;
	console.log("Init PixelDriver RGBMatrix".grey);

  self.matrix = new LedMatrix(self.options.rows, self.options.chainedDisplays, 1);
  self.matrix.clear();

	// start the painter
	self.startPainter.call(self);

};

// set's a pixel
PixelNode_Driver_RGBMatrix.prototype.setPixel = function(strip, id, r,g,b) {
	this.matrix.setPixel(id, strip, r * this.options.dimmer, g * this.options.dimmer, b * this.options.dimmer);
}

// sends all pixels
PixelNode_Driver_RGBMatrix.prototype.sendPixels = function() {
  // not needed for RGBMATRIX
}


/* Methods
 * ==================================================================================================================== */
