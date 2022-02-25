/**
 * PixelNode_Effect_Colorset
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

class PixelNode_Effect_Colorset extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	// define the Student class
	constructor(options,pixelData) {
		super(options, pixelData);

		this.n = 1;
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		scale: 1,
		speed: 100,
		colorset: [
			[255,0,0],
			[0,255,0],
			[0,0,255],
			[255,0,0],
			[0,255,0],
			[0,0,255],
			[255,0,0],
			[0,255,0],
			[0,0,255],
		]
	}

	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect ColorSet".grey);
	}

	// draw effect on target
	drawTarget(target, output) {
		var self = this;
		for (var ring = 0; ring < target.length;ring++) {
			self.fillArray(target[ring], self.options.colorset);
		}
	}

}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_Colorset;
