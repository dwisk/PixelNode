/**
 * PixelNode_Effect_Fill
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

const PixelNode_Effect = require('./PixelNode_Effect.js');

class PixelNode_Effect_Fill extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options,pixelData) {
		super(options, pixelData);
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		color: [255,255,255]
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect Fill".grey);
	}

	// draw effect on target
	drawTarget(target, output) {
		var self = this;

		for (var ring = 0; ring < target.length;ring++) {
			self.fillColor(target[ring], self.options.color);
		}

	}


}

// module export
module.exports = PixelNode_Effect_Fill;
