/**
 * PixelNode_Game_Intensity 
 * 
 * Animation Game 
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */
const PixelNode_Game = require('../../core/games/PixelNode_Game.js');




class PixelNode_Game_Intensity extends PixelNode_Game {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options, effects) {
		var self = this;
		super(options, effects);
	}


	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		"targets": [
			"domePixels.strips"
		],
		"addAmount": 0.125,
		"addSpread": 2
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init() {
		console.log("Init Game Fire".grey);
		var self = this;
		
		self.effect = global.pixelNode.gameManager.getEffectByName(self.options.effect);

		if (global.config.inputMode == "server") {
		}
			self.initListener();
		

	}

	reset() {
		this.effect.reset();
	}

	// draw effect – override this
	draw() {
		var self = this;
		self.effect.draw();
	}

	initListener() {
		var self = this;

		global.pixelNode.data.on("changed_inputs_buttons_button_back", function(paths, value) {
			if(self.options.name == global.pixelNode.data.get("game.name") && value) {
				self.reset();
			}
		});

		global.pixelNode.data.on("changed_inputs_buttons", function(paths, value) {
			var found = paths[0].match(/btn_(\d*)/);

			if (value && found != null) {

				index = parseInt(paths[0].split("_")[1]);

				if (self.effect.intensity[index] <= 1- self.options.addAmount) {
					self.addFire(index, self.options.addAmount);
					spread = self.options.addSpread;
					halfspread = self.options.addSpread/2;
					for (var i = 1; i <= halfspread; i++) {
						amount = self.options.addAmount * 0.8 * (halfspread-i+1)/halfspread;

						prev = index - i;
						if (prev < 0) prev += spread;

						next = index + i;
						if (next >= spread) next -= spread;

						self.addFire(prev, amount);
						self.addFire(next, amount);

					};
				}
			}
		});
	}

	addFire(index, amount) {
		var self = this;
		//console.log("addFire",index,amount);
		
		self.effect.intensity[index] += amount;
		if (self.effect.intensity[index] > 1) self.effect.intensity[index] = 1; 
	}


}

// module export
module.exports = PixelNode_Game_Intensity;
