/**
 * PixelNode_Effect
 * 
 * Base class for effects
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Inclues
 * ==================================================================================================================== */

var extend = require('util')._extend;


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Effect(options,pixelData) {	
	this.options = extend(extend(this.base_options, this.default_options), options);
	this.pixelData = pixelData;
	this.init();
}

// module export
module.exports = PixelNode_Effect;


/* Variables
 * ==================================================================================================================== */

PixelNode_Effect.prototype.base_options = {}
PixelNode_Effect.prototype.default_options = {}
PixelNode_Effect.prototype.options = {}
PixelNode_Effect.prototype.pixelData = {}


/* Methods
 * ==================================================================================================================== */

// init effect
PixelNode_Effect.prototype.init = function() {
	console.log("Init Effect:", this.options);
}

// draw effect
PixelNode_Effect.prototype.draw = function() {

}




