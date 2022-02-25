/**
 * PixelNode_Effect_TwoRay
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

class PixelNode_Effect_TwoRay extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options,pixelData) {
		super(options,pixelData);
	}

	/* Variables
	* ==================================================================================================================== */


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect TwoRay".grey);
	}

	// draw effect on target
	drawTarget(target, output_name) {
		var self = this;

		// get color 1
		var c1 = self.getColor(["inputs","rgb","color_left"]);

		// get color 2
		var c2 = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.5,
			offset: 90
		});

		// draw effect
		for (var ring = 0; ring < target.length;ring++) {
			// console.log(ring,Math.round(self.counter/10/target.length) % 12);
			if(ring,Math.round(self.counter/100/target.length) % target.length == ring) {
				c = c1;
			} else if (global.pixelNode.data.fastGet(["inputs","buttons","btn_"+ring])) {
				c = c1;
			} else {
				c = c2;
			}

			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				target[ring][pixel] = c;
			}
		}

	}

}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_TwoRay;
