/**
 * PixelNode_EffectManager 
 * 
 * Allows to switch between pixeleffects
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


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_EffectManager(options) {
	EventEmitter.call(this);

	console.log("Init EffectManager".grey);
	var self = this;

	this.options = _.extend({}, this.default_options, options);

	this.initPixelData();

	global.config.effects.forEach(function(effect) {		
		var Effect = require(effect.module);
		self.effects.push(new Effect(effect));
	})

	global.pixelNode_data['effects'] = {
		autoplay: this.options.autoplay,
		force_off: false
	};

	self.setEffectByQueueId(0);

	this.draw_interval = setInterval(function() {
	  self.drawEffect();
	  self.counter += 25;
	  if (global.pixelNode_data.effects.autoplay && self.counter >=(self.queueEffect.duration || 10000)) {
	  	self.counter = 0;
	  	self.nextEffect();
	  }
	}, 25);  


}

// EffectManager inherits EventEmitter
util.inherits(PixelNode_EffectManager, EventEmitter);


// module export
module.exports = PixelNode_EffectManager;


/* Variables
 * ==================================================================================================================== */

PixelNode_EffectManager.prototype.default_options = {
	autoplay: true
};
PixelNode_EffectManager.prototype.pixelData = {};
PixelNode_EffectManager.prototype.draw_interval = null;
PixelNode_EffectManager.prototype.counter = 0;
PixelNode_EffectManager.prototype.effect = null;
PixelNode_EffectManager.prototype.queueEffect = null;
PixelNode_EffectManager.prototype.effect_off = null;
PixelNode_EffectManager.prototype.queueId = 0;
PixelNode_EffectManager.prototype.effects = [];
PixelNode_EffectManager.prototype.wasOff = false;


/* Functions
 * ==================================================================================================================== */

// init pixel array and set color to black
PixelNode_EffectManager.prototype.initPixelData = function() {
	var self = this;

	// loop through mapping
	global.mapping.forEach(function(map) {

		// create rings
		var pixelRings = [];
		map.rings.forEach(function(ring) {
			var pixelRing = [];
			// add object with black color values for each pixel
			ring.px.forEach(function(pixelConfig) {
				pixelRing.push([0,0,0]);
			});
			// push ring into rings
			pixelRings.push(pixelRing);
		});

		// create strips
		var pixelStrips = [];
		map.strips.forEach(function(strip) {
			var pixelStrip = [];
			// add object with black color values for each pixel
			strip.px.forEach(function(pixelConfig) {
				pixelStrip.push([0,0,0]);
			});
			// push strip into rings
			pixelStrips.push(pixelStrip);
		});

		// add map to pixelData
		self.pixelData[map.name] = {
			mode: "off",
			rings: pixelRings,
			strips: pixelStrips
		};
	});
}

PixelNode_EffectManager.prototype.pixelDataOff = function() {
	var self = this;
	global.mapping.forEach(function(map) {
		self.pixelData[map.name].mode = "off";
	})
}

// draw Effects
PixelNode_EffectManager.prototype.drawEffect = function() {
	// go off if force_off is used
	if (global.pixelNode_data.effects.force_off) {
		this.getEffectByName("Off").draw();
		this.wasOff = true;

	// draw effects
	} else {
		// reset pixel after force_off was used
		if (this.wasOff) { 
			this.pixelDataOff();
			this.wasOff = false;
		}

		// hook for applying before effects
		this.emit('drawEffect_before');

		// draw main effect
		this.effect.draw();
		
		// hook for applying after effects
		this.emit('drawEffect_after');
	}
};

PixelNode_EffectManager.prototype.nextEffect = function() {
	var next = this.queueId + 1;
	if (next >= global.config.queue.length) {
		next = 0;
	}
	this.setEffectByQueueId(next);
};

PixelNode_EffectManager.prototype.setEffectByQueueId = function(id) {
	this.pixelDataOff();
	this.setEffectByName(global.config.queue[id].effect);
	this.queueEffect = global.config.queue[id];
	this.queueId = id;
};

PixelNode_EffectManager.prototype.getEffectByName = function(name) {
	var self = this;
	var effect = null;
	self.effects.forEach(function(fx) {
		if (fx.name == name) {
			effect = fx;
		}
	});
	return effect;
}
PixelNode_EffectManager.prototype.setEffectByName = function(name) {
	var self = this;
	self.pixelDataOff();

	self.effect = self.getEffectByName(name);

	console.log(("Changed Effect to " + this.effect.options.name.white + (" (" + this.effect.options.module + ")").grey).grey);
	global.pixelNode_data["effect"] = this.effect.options;
};