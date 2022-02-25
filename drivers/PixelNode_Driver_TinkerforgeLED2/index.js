/**
 * PixelNode_Driver_TinkerforgeLED2
 * 
 * Pixel Driver for TinkerforgeLED2
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var colors = require('colors');
var Tinkerforge = require('tinkerforge');

/* Class Constructor
 * ==================================================================================================================== */

// extending PixelNode_Driver
PixelNode_Driver = require('pixelnode-driver');

// define the Student class
function PixelNode_Driver_TinkerforgeLED2(options,pixelData) {
  var self = this;
  PixelNode_Driver_TinkerforgeLED2.super_.call(self, options, pixelData);
  this.className = "PixelNode_Driver_TinkerforgeLED2";
}

// class inheritance 
util.inherits(PixelNode_Driver_TinkerforgeLED2, PixelNode_Driver);

// module export
module.exports = PixelNode_Driver_TinkerforgeLED2;


/* Variables
 * ==================================================================================================================== */

PixelNode_Driver_TinkerforgeLED2.prototype.default_options = {
	pixelColorCorrection: false,
	offset: 0,
	dimmer: 1,
	host: 'localhost',
	port: 4223,
	uid: 'xyz'

};
PixelNode_Driver_TinkerforgeLED2.prototype.client = {};
PixelNode_Driver_TinkerforgeLED2.prototype.pixels = [];
PixelNode_Driver_TinkerforgeLED2.prototype.pixelsFirstpart = true;


/* Overriden Methods
 * ==================================================================================================================== */

 // init driver
PixelNode_Driver_TinkerforgeLED2.prototype.init = function() {
	var self = this;
	console.log("Init PixelDriver TinkerforgeLED2".grey);

	// get new OPC / TinkerforgeLED2 client
	var ipcon = new Tinkerforge.IPConnection(); // Create IP connection
	this.client = new Tinkerforge.BrickletLEDStripV2(self.options.uid, ipcon); // Create device object

	ipcon.connect(self.options.host, self.options.port,
		function (error) {
			console.log("Init PixelDriver TinkerforgeLED2".grey, 'Error: '.red + error);
		}
	);

	ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
		(connectReason) => {
			console.log((`TinkerforgeLED2 connected to ${self.client.deviceDisplayName} : ${self.client.deviceIdentifier}`).green);
			console.log(`TinkerforgeLED2 delay: ${self.options.delay/2}`.grey);
			self.client.setChipType(Tinkerforge.BrickletLEDStripV2.CHIP_TYPE_WS2812);
			// self.client.setChannelMapping(Tinkerforge.BrickletLEDStripV2.CHANNEL_MAPPING_GRB); // for spielmaschine dd
			self.client.setChannelMapping(Tinkerforge.BrickletLEDStripV2.CHANNEL_MAPPING_RGB);
			self.client.setFrameDuration(self.options.delay);
			console.log("TinkerforgeLED2".grey, "RGB","sy");
			self.startPainter.call(self);
			// initially set one pixel
			this.client.setLEDValues(0, [0, 0, 0]);
		}
	);

	// frame started callback for sending pixels in sync with framerate
	self.client.on(Tinkerforge.BrickletLEDStripV2.CALLBACK_FRAME_STARTED,
		function (param) {
			let halfwayThrough = Math.floor(self.pixels.length / 2)
			let firstPixels = self.pixels.slice(0, halfwayThrough);
			let secondPixels = self.pixels.slice(halfwayThrough, self.pixels.length);

			if (self.pixelsFirstpart) {
				self.client.setLEDValues(0, firstPixels);
			} else {
				self.client.setLEDValues(halfwayThrough, secondPixels);
			}
			self.pixelsFirstpart = ! self.pixelsFirstpart;
		}
	);

};

// set's a pixel via TinkerforgeLED2 client
PixelNode_Driver_TinkerforgeLED2.prototype.setPixel = function(strip, id, r,g,b) {
	this.pixels[id * 3 + 0] = max255(r * this.options.dimmer);
	this.pixels[id * 3 + 1] = max255(g * this.options.dimmer);
	this.pixels[id * 3 + 2] = max255(b * this.options.dimmer);
}

// tells TinkerforgeLED2 client to write pixels
PixelNode_Driver_TinkerforgeLED2.prototype.sendPixels = function() {
	// not needed, we're using the Frame Started Callback
	
}

// helper function for keeping values below 255
function max255(value) {
	if (value > 255) return 255;
	return value
}