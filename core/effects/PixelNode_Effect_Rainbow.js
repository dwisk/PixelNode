/**
 * PixelNode_Effect_Rainbow 
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

class PixelNode_Effect_Rainbow extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options,pixelData) {
		super(options,pixelData);
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		scale: 1,
		speed: 100
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect Rainbow".grey);
	}

	// draw effect on target
	drawTarget(target, output) {
		var self = this;
		var colors = [];

		if (target[0]) {
			colors = self.getRainbow(target[0].length, self.counter*self.options.speed/1000, self.options.scale);
			
			for (var ring = 0; ring < target.length;ring++) {
				self.fillArray(target[ring], colors);		    
			}
		}

	}


}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_Rainbow;