/**
 * PixelNode_Input_MPR121 
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
var MPR121 = require("./MPR121");
var spawn = require('child_process').spawn;


/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Input = require('../../lib/PixelNode_Input.js');

// define the Student class
function PixelNode_Input_MPR121(options,pixelData) {
  var self = this;
  PixelNode_Input_MPR121.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_MPR121";
}

// class inheritance 
util.inherits(PixelNode_Input_MPR121, PixelNode_Input);

// module export
module.exports = PixelNode_Input_MPR121;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_MPR121.prototype.default_options = {
	"data_target": "touches",
	"crash_waittime": 1,
	"crash_cautious_lifetime": 20,
	"crash_cautious_waittime": 2
};

var firstInit = 0;
var lastInit = 0;
var crashCount = 0;

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_MPR121.prototype.init = function() {
	var self = this;

	lastInit = new Date();
	if (firstInit == 0) firstInit = new Date();

	// start
	console.log("Init Input MPR121".grey);

	// init input values
	var init_inputs = {};
	init_inputs[self.options.data_target] = [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false
	];

	// init pixelNode data
	global.pixelNode_data.inputs[self.options.name] = _.extend(global.pixelNode_data.inputs[self.options.name], init_inputs);

	// start effect
	self.start(function(result) {
		self.setInputData(result, self.options.data_target)
		//global.pixelNode_data.inputs[self.options.name][self.options.data_target] = result;
	})


}


/* Methods
 * ==================================================================================================================== */

// start python listener
PixelNode_Input_MPR121.prototype.start = function(callback) {
	var self = this;

 	// spawn pythong process
	var ls = spawn('python', ['-u', __dirname + '/touch.py']);
	this.callback = callback;

	// data listener
	ls.stdout.on('data', function (data) {
		// get rid of empty lines
		var str = data.toString().replace("\n","");

		// check if result is valid
		if (str.length > 2) {
			// parse data
			var parts = str.replace("[","").replace("]","").split(",");

			// get pin data
			var pins = [];
			parts.forEach(function(pin) {
				pins.push( pin == "true");
			})

			// send pin data to callback
			callback(pins);
		}
	});

	// close listener
	ls.on('close', function (code) {
		if (code == 0 ) {
			console.log('PixelNode_Input_MPR121: python process exited'.grey);
		} else {
			// crash stats
			crash = new Date();
			crashCount++;
			lifetime = Math.round((crash - lastInit)/1000);
			avg_lifetime = Math.round((crash - firstInit)/1000/crashCount);

			// wait time
			waittime = self.options.crash_waittime;
			if (lifetime < self.options.crash_cautious_lifetime) waittime = self.options.crash_cautious_waittime;

			// output
			console.log(('MPR121 crashed after '+ lifetime+ 's (avg ' + avg_lifetime + 's). Restarting in ' + waittime + 's.').yellow);

			// new init after waittime
			setTimeout(function() {
				self.init();
			}, waittime*1000);
		}
	});

}

