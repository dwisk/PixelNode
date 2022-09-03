/**
 * PixelNode_Input_TinkerforgeTouch 
 * 
 * Inputs from Tinkerforge Multitouch sensor
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var Tinkerforge = require('tinkerforge');

/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Input = require('pixelnode-input');

// define the Student class
function PixelNode_Input_TinkerforgeTouch(options,pixelData) {
  var self = this;
  PixelNode_Input_TinkerforgeTouch.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_TinkerforgeTouch";
}

// class inheritance 
util.inherits(PixelNode_Input_TinkerforgeTouch, PixelNode_Input);

// module export
module.exports = PixelNode_Input_TinkerforgeTouch;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_TinkerforgeTouch.prototype.default_options = {
	"verbose": false,
	"timer": 100,
	"sensitivty": 50,
	"pincount": 12,
	"offset": 0,
	host: 'localhost',
	port: 4223,
	uid: 'xyz'
};
PixelNode_Input_TinkerforgeTouch.prototype.touchsensor = null;

PixelNode_Input_TinkerforgeTouch.prototype.lastPins = [];
PixelNode_Input_TinkerforgeTouch.prototype.pins = [];
PixelNode_Input_TinkerforgeTouch.prototype.last_result = [];


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_TinkerforgeTouch.prototype.init = function() {
	var self = this;

	// start
	console.log("Init Input TinkerforgeTouch".grey, "on", self.options.uid);

	// get new OPC / TinkerforgeLED2 client
	var ipcon = new Tinkerforge.IPConnection(); // Create IP connection
	this.client = new Tinkerforge.BrickletMultiTouchV2(self.options.uid, ipcon); // Create device object

	// init input values
	self.init_inputs = Object.assign({});
	self.init_inputs["touches"] = [];
	self.pins = [];
	self.lastPins = [];
	for (var i = 0; i < self.options.pincount; i++) {
		self.init_inputs["touches"][i] = false;
		self.pins[i] = false;
		self.lastPins[i] = false;
	};

	// init pixelNode data
	global.pixelNode.data.extend(["inputs",self.options.name], self.init_inputs);


	// init sensor
	ipcon.connect(self.options.host, self.options.port,
		function (error) {
			console.log('Error: ' + error);
		}
	);

	ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
		(connectReason) => {
			console.log((`TinkerforgeTouch connected to ${self.client.deviceDisplayName} : ${self.client.deviceIdentifier}`).green);
			// self.touchsensor.set_thresholds(self.options.treshold_touch, self.options.treshold_release);

			self.client.setElectrodeSensitivity(50);
			self.client.recalibrate();

			// start effect
			self.start(function(result) {
				// do offset
				if (self.options.offset != 0) {
					var segment1 = result.slice(self.options.offset);
					var segment2 = result.slice(0,self.options.offset);
					self.pins = segment1.concat(segment2);
				} else {
					self.pins = result;
				}
				self.pins[12] = self.options.name;

				// check if touch-point changes
				for (var i = self.pins.length - 1; i >= 0; i--) {
					if (self.pins[i] !== self.lastPins[i]) {
						self.lastPins[i] = self.pins[i];
						global.pixelNode.data.set(["inputs", self.options.name, "touches", i], self.pins[i], !self.options.verbose);
					} 
				}
			});
		}
	);

	
}


/* Methods
 * ==================================================================================================================== */

// start python listener
PixelNode_Input_TinkerforgeTouch.prototype.start = function(callback) {
	var self = this;
	

	// Interval for reading the sensor
	setInterval(function() {
		// self.touchsensor.set_thresholds(self.options.treshold_touch, self.options.treshold_release);

		// get touch values
		self.client.getTouchState(
            function (state) {
                // console.log('Proximity: ' + state[12]);

				// prepare some result array
				var ret = [];

				// loop through pins
				for (var i = 0; i < self.options.pincount; i++) {
					// push status into array
					// ret.push ((t & (1 << i)) > 0);
					//ret.push (self.touchsensor.is_touched(i));
					ret.push(state[i]);
				}

				// if (self.options.verbose) console.log(ret);

				// return status array
				callback(ret);

            },
            function (error) {
                console.log('Error: ' + error);
            }
        );

	}, self.options.timer);

}
