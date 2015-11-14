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

var util = require("util");

/* Class Constructor
 * ==================================================================================================================== */

// extending Game
PixelNode_Game = require('../../lib/PixelNode_Game.js');

// define the Student class
function PixelNode_Game_Intensity(options, effects) {
  var self = this;
  PixelNode_Game_Intensity.super_.call(self, options, effects);
  self.className = "PixelNode_Game_Intensity";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Game_Intensity, PixelNode_Game);

// module export
module.exports = PixelNode_Game_Intensity;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Game_Intensity.prototype.default_options = {
 	"targets": [
 		"domePixels.strips"
 	],
 	"addAmount": 0.125,
 	"addSpread": 2
 }

PixelNode_Game_Intensity.prototype.effect = null;

var last_touches = [];

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Game_Intensity.prototype.init = function() {
	console.log("Init Game Fire".grey);
	var self = this;
	
	self.effect = global.pixelNode.gameManager.getEffectByName(self.options.effect);

	if (global.config.inputMode == "server") {
	}
		self.initListener();
	

}

PixelNode_Game_Intensity.prototype.reset = function() {
	this.effect.reset();
}

// draw effect – override this
PixelNode_Game_Intensity.prototype.draw = function() {
	var self = this;
	self.effect.draw();


}


PixelNode_Game_Intensity.prototype.initListener = function() {
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
			console.log(index);

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
PixelNode_Game_Intensity.prototype.addFire = function(value) {

}

PixelNode_Game_Intensity.prototype.addFire = function(index, amount) {
	var self = this;
	//console.log("addFire",index,amount);
	
	self.effect.intensity[index] += amount;
	if (self.effect.intensity[index] > 1) self.effect.intensity[index] = 1; 
}

