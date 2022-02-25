/**
 * PixelNode_Effect_TwoGlitter
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

class PixelNode_Effect_TwoGlitter extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options,pixelData) {
		super(options, constructor);
	}

	/* Variables
	* ==================================================================================================================== */



	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect TwoGlitter".grey);
	}

	// draw effect on target
	drawTarget(target) {
		var self = this;
		var ran;
		var c, c1, c2;

		// get color 1
		c1 = self.getColor(["inputs","rgb","color_left"]);

		// get color 2
		c2 = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.5,
			offset: 90
		});


		var intensity;
		var rawIntensity = global.pixelNode.data.fastGet(["inputs","intensity"]);
		if (rawIntensity != null) {
			intensity = rawIntensity/2.5 + 0.6;
		} else {
			intensity = 0.6;
		}

		for (var ring = 0; ring < target.length;ring++) {

			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				ran = Math.round(Math.random()*intensity/1);

				if (ran == 1 || global.pixelNode.data.fastGet(["inputs","touch","touches",pixel])) {
					target[ring][pixel] = c1
				} else {
					target[ring][pixel] = c2
				}
			}
		}

	}

}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_TwoGlitter;
