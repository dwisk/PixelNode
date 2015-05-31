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

 	var clockBase = global.pixelNode.data.get("clockBase");
 	var now = new Date();
 	var old = self.clock;
 	self.clock = now - clockBase;
 	
 	return self.clock;
}

PixelNode_Clock.prototype.reset = function() {
	var self = this;

	global.pixelNode.data.setSilent("clockBase", new Date(), true);
	self.clock = 0;
}