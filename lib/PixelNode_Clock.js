/**
 * PixelNode_Clock 
 * 
 * Data class for shared data
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('underscore');
var objectPath = require("object-path");


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Clock(options) {
	EventEmitter.call(this);
	var self = this;

	this.options = _.extend({}, this.default_options, options);
	
	global.pixelNode.data.setSilent("clockDiff", 0);

	global.pixelNode.data.on("replaced", function(paths, value) {
		var now = new Date();
		var clockBase = new Date(global.pixelNode.data.get("clockSet"));
		global.pixelNode.data.set("clockDiff", now - clockBase, true);
	});
	global.pixelNode.data.set("clockBase", new Date());
	self.reset();
}

// EffectManager inherits EventEmitter
util.inherits(PixelNode_Clock, EventEmitter);

// module export
module.exports = PixelNode_Clock;


/* Variables
 * ==================================================================================================================== */

PixelNode_Clock.prototype.default_options = {};
PixelNode_Clock.prototype.clock = 0;


/* Functions
 * ==================================================================================================================== */

PixelNode_Clock.prototype.get = function() {
	var self = this;
 	var clockBase = new Date(global.pixelNode.data.get("clockBase"));
 	var clockDiff = global.pixelNode.data.get("clockDiff");
 	var now = new Date();
 	var old = self.clock;
 	self.clock = now - clockBase 
 	self.clock -= clockDiff;
 	
 	return self.clock;
}

PixelNode_Clock.prototype.reset = function(override) {
	var self = this;

	if (global.config.inputMode == "server" || override) {
		global.pixelNode.data.set("clockBase", new Date());
		self.clock = 0;
	}
}