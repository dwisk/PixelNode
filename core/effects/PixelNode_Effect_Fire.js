/**
 * PixelNode_Effect_Fire
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

const PixelNode_Effect = require('./PixelNode_Effect.js');


/* Includes
 * ==================================================================================================================== */

class PixelNode_Effect_Fire extends PixelNode_Effect {

	static default_options = {
		scale: 1,
		speed: 0.5
	}

	/* Class Constructor
	* ==================================================================================================================== */


	// define the Student class
	constructor(options, pixelData) {
		super(options, pixelData);

		this.height = 1
		this.intensity = []
	}


	/* Variables
	* ==================================================================================================================== */

	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect Fire".grey);
	}

	// reset effect – override
	reset() {
		// manually init targets (otherwise just happening after initial init)
		this.initTargets();
	}

	// init target – override
	initTarget(target, output, target_name) {
		var self = this;
		target_name = target_name.replace(".", "_");

		for (var ring = 0; ring < target.length;ring++) {
			self.intensity[ring] = Math.random(1)*0.1+0.9;
		}

	}

	// draw effect on target
	drawTarget(target) {
		var self = this;
		var millis = new Date().getTime();

		for (var ring = 0; ring < target.length; ring++) {
			const flicker = Math.random(1) * 0.5 + 0.5;
			const tmp_height = self.intensity[ring] * flicker;

			if (self.intensity[ring] == undefined) {
				self.intensity[ring] = Math.random(1) * 0.1 + 0.9
			}

			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				var red = 0;
				var green = 0;
				var blue = 0;
				let height;
				if (target[ring].length - target[ring].length * tmp_height * 0.9 < pixel) {
					red = 225;
					height = target[ring].length;
					green = 255 * (pixel - (height - height * tmp_height * 0.9)) / (height * tmp_height * 0.9);

					if (green < 0 || green > 255) {
						red = green = blue = 0
					};
				} else
				if (target[ring].length - target[ring].length * tmp_height * 0.8 < pixel) {
					red = 196;
					height = target[ring].length;
					green = 196 * (pixel - (height - height * tmp_height * 0.8)) / (height * tmp_height * 0.8);

					if (green < 0 || green > 196) {
						red = green = blue = 0
					};
				} else
				if (target[ring].length - target[ring].length * tmp_height < pixel) {
					red = 128;
					height = target[ring].length;
					green = 128 * (pixel - (height - height * tmp_height)) / (height * tmp_height);

					if (green < 0 || green > 128) {
						red = green = blue = 0
					};
				}

				target[ring][pixel] = [red, green, blue];

			}

			if (tmp_height >= 0.1) {
				self.intensity[ring] -= 0.001 * self.options.speed * (Math.random(1) * 0.2 + 0.8);
			}
		}

	}

}

// module export
module.exports = PixelNode_Effect_Fire;
