/**
 * PixelNode_Input_GPIO 
 * 
 * Ported fadecandy example
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var _ = require('underscore');
var b = require('bonescript');



/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Input = require('../lib/PixelNode_Input.js');

// define the Student class
function PixelNode_Input_GPIO(options,pixelData) {
  var self = this;
  PixelNode_Input_GPIO.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_GPIO";
}

// class inheritance 
util.inherits(PixelNode_Input_GPIO, PixelNode_Input);

// module export
module.exports = PixelNode_Input_GPIO;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_GPIO.prototype.default_options = {
	pins: [
		{ number: "P8_8", input: "button1", default: false },
		{ number: "P8_10", input: "button2", default: false },
		{ number: "P8_12", input: "button3", default: false }
	]
};
PixelNode_Input_GPIO.prototype.status_interval = 0;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_GPIO.prototype.init = function() {
	var self = this;

	// start
	console.log("Init Input GPIO".grey);

	// init pins
	this.initPins();

	// start interval to get pin status
	self.status_interval = setInterval(function() {self.getPinStatus()}, 200 );

}


/* Methods
 * ==================================================================================================================== */

PixelNode_Input_GPIO.prototype.initPins = function() {
	var self = this;
	
	// inputs
	var init_inputs = {};

	// init
	self.options.pins.forEach(function(pin) {
		// set input mode
		b.pinMode(pin.number, b.INPUT);
		
		// set inputs
		init_inputs[pin.input] = pin.default;
	});

	// init pixelNode data
	global.pixelNode_data.inputs[self.options.name] = _.extend(global.pixelNode_data.inputs[self.options.name], init_inputs);

}

PixelNode_Input_GPIO.prototype.getPinStatus = function() {
	var self = this;

	self.options.pins.forEach(function(pin) {
		b.digitalRead(pin.number, function(x) {
			global.pixelNode_data.inputs[self.options.name][pin.input] = x.value == 1;
		} );
	});



}



