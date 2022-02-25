/**
 * PixelNode_Effect_Colorset
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


class PixelNode_Effect_Colorset extends PixelNode_Effect {

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

	/* Class Constructor
	* ==================================================================================================================== */

	// define the Student class
	constructor(options,pixelData) {
		super(options, pixelData);

		this.n = 1;
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
			// self.fillColor(target[ring], [0,0,0]);
			self.fillArray(target[ring], self.options.colorset);
		}
	}

}

// module export
module.exports = PixelNode_Effect_Colorset;
