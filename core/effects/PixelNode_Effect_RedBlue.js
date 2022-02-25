/**
 * PixelNode_Effect_RedBlue 
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

const PixelNode_Effect = require('./PixelNode_Effect.js');


/* Class Defintion
 * ==================================================================================================================== */

class PixelNode_Effect_RedBlue extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options,pixelData) {
		super(options,pixelData);
	}


	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		scale: 1,
		speed: 1
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect RedBlue".grey);
	}

	// draw effect on target
	drawTarget(target) {
		var self = this;
		var millis = new Date().getTime();

		for (var ring = 0; ring < target.length;ring++) {
			
			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				var t = pixel / self.options.scale * 0.5 + millis * 0.002 * self.options.speed;
				var red = 128 + 96 * Math.sin(t);
				var green = 0; //128 + 0 * Math.sin(t + 0.1);
				var blue = 128 + 0 * Math.sin(t + 0.3);

				target[ring][pixel] = [red, green, blue];
			}			    
		}

	}
}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_RedBlue;

