/**
 * PixelNode_Effect_Off
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

var util = require("util");
PixelNode_Canvas = require('../lib/PixelNode_Canvas.js');

/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Effect = require('../lib/PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_Off(options,pixelData) {
  var self = this;
  PixelNode_Effect_Off.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_Off";
  self.public_dir = __dirname;
}

// class inheritance
util.inherits(PixelNode_Effect_Off, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Off;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_Off.prototype.n = 1;
 PixelNode_Effect_Off.prototype.canvas;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Off.prototype.init = function() {
	console.log("Init Effect Off".grey);
}

PixelNode_Effect_Off.prototype.pos = 0;
PixelNode_Effect_Off.prototype.dir = 1;
// draw effect on target
PixelNode_Effect_Off.prototype.drawTarget = function(target, output) {
	var self = this;
  var c1 = self.getColor(["inputs","rgb","color_right"], {
    dimmer: 0.25,
    offset: 90
  });
  canvas = new PixelNode_Canvas(target);
  canvas.fill(c1);

  canvas.rectangle(0,0,10,1,[255,0,0]);
  canvas.rectangle(0,2,20,1,[0,255,0]);
  canvas.line(this.pos+7,17,40,30, [0,128,0]);
  canvas.rectangle(10,10,10,10,[0,0,255]);
  canvas.oval(this.pos, 10, 15, 10, [255,0,0,0.5]);

  this.pos += this.dir;
  if (this.pos <= 0) {
    this.dir = 1;
    this.pos = 0;
  }
  if (this.pos >= 64-15) {
    this.dir = -1;
    this.pos = 64-15;
  }

}
