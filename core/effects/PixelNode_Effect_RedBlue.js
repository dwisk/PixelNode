/**
 * PixelNode_Effect_RedBlue 
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

var util = require("util");


/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Effect = require('./PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_RedBlue(options,pixelData) {
  var self = this;
  PixelNode_Effect_RedBlue.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_RedBlue";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_RedBlue, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_RedBlue;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_RedBlue.prototype.default_options = {
 	scale: 1,
 	speed: 1
 }


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_RedBlue.prototype.init = function() {
	console.log("Init Effect RedBlue".grey);
}

// draw effect on target
PixelNode_Effect_RedBlue.prototype.drawTarget = function(target) {
	var self = this;
	var millis = new Date().getTime();

	for (var ring = 0; ring < target.length;ring++) {
		
		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			var t = pixel / self.options.scale * 0.5 + millis * 0.002 * self.options.speed;
			var red = 128 + 96 * Math.sin(t);
			var green = 0; //128 + 0 * Math.sin(t + 0.1);
			var blue = 128 + 0 * Math.sin(t + 0.3);

			target[ring][pixel] = [red, green, blue];
		}			    
	}

}


