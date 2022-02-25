/**
 * PixelNode_Effect_TwoWave
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

class PixelNode_Effect_TwoWave extends PixelNode_Effect {
	/* Class Constructor
	* ==================================================================================================================== */

	constructor (options,pixelData) {
		super (options, pixelData);
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		scale: 0.5,
		speed: 1,
		waveBase: 0.25,
		waveHeight: 0.25,
		waveTop: false
	}

	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect TwoWave".grey);
	}

	// draw effect on target
	drawTarget(target) {
		var self = this;
		var millis = new Date().getTime();
		var self = this;

		// get color 1
		var c1 = self.getColor(["inputs","rgb","color_left"]);

		// get color 2
		var c2 = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.5,
			offset: 90
		});

		for (var ring = 0; ring < target.length;ring++) {
			const base = target[ring].length * self.options.waveBase;
			const height = target[ring].length* self.options.waveHeight;
			var t = ring / self.options.scale * 0.5 + millis * 0.002 * self.options.speed;
			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				var wave = base + height * Math.sin(t);

				if (global.pixelNode.data.fastGet(["inputs","buttons","btn_"+ring])) {
					c = c1;
				} else if (pixel <= wave) {
					c = self.options.waveTop ? c2: c1;
				} else {
					c = self.options.waveTop ? c1: c2;
				}

				target[ring][pixel] = c;
			}
		}

	}

}

// module export
module.exports = PixelNode_Effect_TwoWave;
