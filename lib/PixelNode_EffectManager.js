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

var _ = require('underscore');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_EffectManager(options) {
	console.log("Init EffectManager".grey);
	var self = this;

	this.options = _.extend({}, this.default_options, options);

	this.initPixelData();

	global.config.effects.forEach(function(effect) {		
		var Effect = require(effect.module);
		self.effects.push(new Effect(effect, self.pixelData));
	})

	var EffectOff = require(global.config.effects_off.module);
	self.effect_off = new EffectOff(global.config.effects_off, self.pixelData);

	global.pixelNode_data['effects'] = {
		autoplay: this.options.autoplay,
		force_off: false
	};

	self.setEffectById(0);


	this.draw_interval = setInterval(function() {
	  self.drawEffect();
	  self.counter += 25;
	  if (global.pixelNode_data.effects.autoplay && self.counter >= 10000) {
	  	self.counter = 0;
	  	self.nextEffect();
	  }
	}, 25);  


}

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
PixelNode_EffectManager.prototype.effect_off = null;
PixelNode_EffectManager.prototype.effectId = 0;
PixelNode_EffectManager.prototype.effects = [];


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
	if (global.pixelNode_data.effects.force_off) {
		this.effect_off.draw();
	} else {
		this.effect.draw();
	}
};

PixelNode_EffectManager.prototype.nextEffect = function() {
	var next = this.effectId + 1;
	if (next >= this.effects.length) {
		next = 0;
	}
	this.setEffectById(next);
};
PixelNode_EffectManager.prototype.setEffectById = function(id) {
	this.pixelDataOff();
	this.effect = this.effects[id];
	this.effectId = id;
	console.log(("Changed Effect to " + this.effect.options.name.white + (" (" + this.effect.options.module + ")").grey).grey);
	global.pixelNode_data["effect"] = this.effect.options;
};