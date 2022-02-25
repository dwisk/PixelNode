/**
 * PixelNode_Driver_FadeCandy
 * 
 * Pixel Driver for FadeCandy
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var OPC = new require('./libs/opc');
var util = require("util");
var colors = require('colors');


/* Class Constructor
 * ==================================================================================================================== */

// extending PixelNode_Driver
PixelNode_Driver = require('pixelnode-driver');

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
	offset: true,
	dimmer: 1
};
PixelNode_Driver_FadeCandy.prototype.client = {};


/* Overriden Methods
 * ==================================================================================================================== */

 // init driver
PixelNode_Driver_FadeCandy.prototype.init = function() {
	var self = this;
	console.log("Init PixelDriver FadeCandy".grey);

	// get new OPC / fadecandy client
	this.client = new OPC(this.options.address, this.options.port);

	// start painter on connect
	this.client.onConnect = function() {
		console.log(("FadeCandy connected to " + this.socket.remoteAddress).green);
		self.startPainter.call(self);
	}

	// log message on disconnect
	this.client.onDisconnect = function() {
		console.log("FadeCandy connection closed".red);
	}

	// exit on error
	this.client.onError = function(error) {
		// tell what is wrong
		console.log(("No FadeCandy Server found at "+self.options.address+":"+self.options.port+"!").red);
		// tell what to do
		console.log("Start FadeCandy Server (fc-server-???) or disable FadeCandy Driver in pixelnode config.".grey);
		// exit process
		process.exit(1);
	}
};

// set's a pixel via fadecandy client
PixelNode_Driver_FadeCandy.prototype.setPixel = function(strip, id, r,g,b) {
	if (this.client.connected)
		this.client.setPixel(id, r * this.options.dimmer, g * this.options.dimmer, b * this.options.dimmer);

}

// tells fadecandy client to write pixels
PixelNode_Driver_FadeCandy.prototype.sendPixels = function() {
	if (this.client.connected)
		this.client.writePixels();
}

