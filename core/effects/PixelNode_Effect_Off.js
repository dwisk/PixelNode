/**
 * PixelNode_Effect_Off
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

const PixelNode_Effect = require('./PixelNode_Effect.js');


/* Class Definition
 * ==================================================================================================================== */

class PixelNode_Effect_Off extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	// define the Student class
	constructor(options,pixelData) {
		super(options, pixelData);
	}

	/* Variables
	* ==================================================================================================================== */


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect Off".grey);
	}

	// draw effect on target
	drawTarget(target, output) {
		var self = this;

		for (var ring = 0; ring < target.length;ring++) {
			self.fillColor(target[ring], [0,0,0]);
		}

	}

}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_Off;
