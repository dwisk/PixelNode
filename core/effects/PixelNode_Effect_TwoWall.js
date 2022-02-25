/**
 * PixelNode_Effect_TwoWall
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

class PixelNode_Effect_TwoWall extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor (options,pixelData) {
		super(options,pixelData);
		this.counterOffset = 0;
		this.cfirst = false;
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		scale: 1
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect TwoWall".grey);
	}

	reset() {
		var self = this;
		self.counterOffset = 0;
	}

	// draw effect on target
	drawTarget(target) {
		var self = this;
		var c, c1, c2, c2b;

		// get color 1
		c1 = self.getColor(["inputs","rgb","color_left"]);

		// get color 2
		c2 = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.5,
			offset: 90
		});

		// get color 2b
		c2b = self.getColor(["inputs","rgb","color_right"], {
			dimmer: 0.75,
			offset: 45
		});

		var speed = 100;
		const position = Math.floor(((self.counter - self.counterOffset) / speed) % target[0].length);
		let height = Math.floor(((self.counter - self.counterOffset) / speed) / target[0].length) * self.options.scale;
		if (height >= target.length) {
			self.counterOffset = self.counter;
			height = 0;
			self.cfirst = !self.cfirst;
		}

		if (self.counterOffset > self.counter) {
			self.reset();
		}

		// draw effect
		for (var ring = 0; ring < target.length;ring++) {
			var p = 0;
			// console.log(ring,Math.round(self.counter/10/target.length) % 12);


			for (var pixel = 0; pixel < target[ring].length; pixel++) {
				if (global.pixelNode.data.fastGet(["inputs","touch","touches",pixel])) {
					c = [0,0,0];
				} else if (ring < height || (ring < height+self.options.scale && pixel <= position)) {
					c = self.cfirst ? c1 : c2;
				} else if ((ring < height+self.options.scale && pixel <= position+1)) {
					c = c2b;
				} else {
					c = self.cfirst ? c2 : c1;
				}
				target[ring][pixel] = c;
			}
		}

	}

}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_TwoWall;
