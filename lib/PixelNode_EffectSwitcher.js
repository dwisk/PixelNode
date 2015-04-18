/**
 * PixelNode_EffectSwitcher 
 * 
 * Allows to switch between pixeleffects
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_EffectSwitcher() {
	console.log("Init PixelNode_EffectSwitcher");
	
	this.initPixelData();

	var self = this;
	this.draw_interval = setInterval(function() {
	  self.drawEffect();
	}, 25);  

	Effect = require("./PixelNode_Effect_RedBlue");
	this.effect = new Effect({}, this.pixelData);

}

// module export
module.exports = PixelNode_EffectSwitcher;


/* Variables
 * ==================================================================================================================== */

PixelNode_EffectSwitcher.prototype.pixelData = {};
PixelNode_EffectSwitcher.prototype.draw_interval = null;
PixelNode_EffectSwitcher.prototype.effect = null;


/* Functions
 * ==================================================================================================================== */

// init pixel array and set color to black
PixelNode_EffectSwitcher.prototype.initPixelData = function() {
	var self = this;

	global.mapping.forEach(function(map) {

		var pixelRings = [];
		map.rings.forEach(function(ring) {
			var pixelRing = [];
			ring.px.forEach(function(pixelConfig) {
				pixelRing.push([0,0,0]);
			});
			pixelRings.push(pixelRing);

		});
		self.pixelData[map.name] = {
			rings: pixelRings
		};
	});
}

// draw Effects
PixelNode_EffectSwitcher.prototype.drawEffect = function() {
	this.effect.draw();
};