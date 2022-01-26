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

var util = require("util");
var _ = require("underscore");

/* Class Constructor
 * ==================================================================================================================== */

// extending Game
PixelNode_Game = require('../lib/PixelNode_Game.js');

// define the Student class
function PixelNode_Game_Sprites(options, effects) {
  var self = this;
  PixelNode_Game_Sprites.super_.call(self, options, effects);
  self.className = "PixelNode_Game_Sprites";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Game_Sprites, PixelNode_Game);

// module export
module.exports = PixelNode_Game_Sprites;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Game_Sprites.prototype.default_options = {
 	"targets": [
 		"domePixels.strips"
 	]
 }

PixelNode_Game_Sprites.prototype.effect = null;

var last_touches = [];

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Game_Sprites.prototype.init = function() {
	console.log("Init Game Fire".grey);
	var self = this;
	
	self.effect = global.pixelNode.gameManager.getEffectByName(self.options.effect);

	if (global.config.inputMode == "server") {
	}
	self.initListener();
	

}

PixelNode_Game_Sprites.prototype.reset = function() {
	this.effect.reset();
}

// draw effect – override this
PixelNode_Game_Sprites.prototype.draw = function() {
	var self = this;
	self.effect.draw();


}


PixelNode_Game_Sprites.prototype.initListener = function() {
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

PixelNode_Game_Sprites.prototype.addSprite = function(index) {
	var self = this;
	
	var sprite = self.effect.spritePrototype != undefined ? _.clone(self.effect.spritePrototype) : {};
	sprite.index = index;
	self.effect.sprites.push(sprite);
}

