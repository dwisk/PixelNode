/**
 * PixelNode_Effect_ColouredRain
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

class PixelNode_Effect_ColouredRain extends PixelNode_Effect {

	/* Class Constructor
	* ==================================================================================================================== */


	// define the Student class
	constructor(options,pixelData) {
		super(options, pixelData);

		this.intensity = []
		this.drops = []
		this.color1 = false
		this.dropPrototype = {
		index: null,
			position: -2,
			timerPosition: -2
		};
	}

	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		speed: 1.5,
		gravity: 1,
		direction: 1,
		intensity : 0.9,
		fixedCcolor: null
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Effect ColouredRain".grey);

	}

	// reset effect – override
	reset() {
		// manually init targets (otherwise just happening after initial init)
		this.initTargets();
	}

	// init target – override
	initTarget(target, output, target_name) {
		var self = this;

		for (var ring = 0; ring < target.length;ring++) {
			self.intensity[ring] = Math.random(1)*0.1+self.options.intensity;
		}

		self.dropPrototype.position = target[0].length;
		self.drops[target_name] = [];

	}

	// draw effect on target
	drawTarget(target, output, target_name) {
		var self = this;

		var c1 = self.getColor(["inputs", "rgb", "color_right"]);
		var c2 = self.getColor(["inputs", "rgb", "color_left"]);

		var target_length = target[0].length;

		for (var ring = 0; ring < target.length; ring++) {
			if (self.intensity[ring] == undefined) {
				self.intensity[ring] = Math.random(1) * 0.1 + 0.9
			}

			const ran = Math.round(Math.random() * (0.51 + 0.20 * self.intensity[ring] * self.options.gravity));
			if (ran) {
				self.color1 = !self.color1;

				var drop = {...self.dropPrototype};
				drop.index = ring;
				if (this.options.fixedColor) {
					drop.color = this.options.fixedColor;
				} else {
					drop.color = self.color1 ? c1 : c2;
				}
				drop.position = self.options.direction < 0 ? 0 : target_length - 1;
				drop.timerPosition = self.options.direction < 0 ? 0 : -2;

				self.drops[target_name].push(drop);
			}
			self.fillColor(target[ring], [0, 0, 0]);

			if (self.intensity[ring] >= 0.03) {
				self.intensity[ring] -= 0.002 * self.options.speed * (Math.random(1) * 0.2 + 0.8);
			}
		}

		for (var i = 0; i < self.drops[target_name].length; i++) {
			var drop = self.drops[target_name][i];
			if ((self.options.direction < 0 && drop.position + 3 <= 0) || (self.options.direction > 0 && drop.position - 3 >= target_length)) {
				self.drops[target_name].splice(i, 1);
				i--;
			} else {
				drop.timerPosition += self.options.direction;
				if (self.options.direction > 0) {
					drop.position = Math.floor(drop.timerPosition / self.options.gravity);
				} else {
					drop.position = target_length + Math.floor(drop.timerPosition / self.options.gravity);
				}

				if (drop.position >= 0 && drop.position < target_length) target[drop.index][drop.position] = drop.color;
				if (drop.position + 1 * self.options.direction * -1 >= 0 && drop.position + 1 * self.options.direction * -1 < target_length) target[drop.index][drop.position + 1 * self.options.direction * -1] = self.dimmColor(drop.color, 0.5);
				if (drop.position + 2 * self.options.direction * -1 >= 0 && drop.position + 2 * self.options.direction * -1 < target_length) target[drop.index][drop.position + 2 * self.options.direction * -1] = self.dimmColor(drop.color, 0.33);
			}
		}
	}
}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_ColouredRain;
