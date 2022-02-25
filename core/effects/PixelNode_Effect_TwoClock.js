/**
 * PixelNode_Effect_TwoClock
 *
 * Clock Effect
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

const PixelNode_Effect = require('./PixelNode_Effect.js');

class PixelNode_Effect_TwoClock extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options,pixelData) {
		super(options,pixelData);
		
		this.colorSelect = false;
		this.hueSelect = 0;
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		scale: 1,
		offset: -1
	}

	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect TwoClock".grey);
	}

	// draw effect on target
	drawTarget(target, output) {
		var self = this;

		var c1, c2, c3;

		// get color 1
		c1 = self.getColor(["inputs","rgb","color_left"]);

		// get color 2
		c2 = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.5,
			offset: 0
		});

		// get color 2
		c3 = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.5,
			offset: 90
		});

		//console.log(c1, c2);
		var time = new Date();
		var internal_scale = 60 / target.length;
		var hour = time.getHours() + self.options.offset;
		var minute = time.getMinutes() + self.options.offset * internal_scale;
		var second = time.getSeconds() + self.options.offset * internal_scale;

		if (hour >= 12 ) hour -= 12;
		if (minute >= 60 ) minute -= 60;
		if (second >= 60 ) second -= 60;

		if (hour < 0 ) hour += 12;
		if (minute < 0 ) minute += 60;
		if (second < 0 ) second += 60;

		for (var ring = 0; ring < target.length;ring++) {
			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				if ( (minute >= ring*internal_scale && minute < (ring+1)*internal_scale && pixel >= 1*self.options.scale)
				|| (ring == hour && pixel > 3*self.options.scale)
					) {
					target[ring][pixel] = c2;
				} else if (global.pixelNode.data.fastGet(["inputs","buttons","btn_"+ring])
				||	(second >= ring*internal_scale && second < (ring+1)*internal_scale )
					) {
					target[ring][pixel] = c1;
				} else {
					target[ring][pixel] = c3;
				}
			}
		}
	}

}

// module export
module.exports = PixelNode_Effect_TwoClock;
