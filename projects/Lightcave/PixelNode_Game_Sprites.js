/**
 * PixelNode_Game_Sprites 
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


class PixelNode_Game_Sprites extends PixelNode_Game {

	/* Class Constructor
	* ==================================================================================================================== */
	constructor(options, effects) {
		super(options, effects);
	}


	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		"targets": [
			"domePixels.strips"
		]
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

				self.addSprite(index);
			}
		});
	}

	addSprite(index) {
		var self = this;
		
		var sprite = self.effect.spritePrototype != undefined ? _.clone(self.effect.spritePrototype) : {};
		sprite.index = index;
		self.effect.sprites.push(sprite);
	}

}

// module export
module.exports = PixelNode_Game_Sprites;

