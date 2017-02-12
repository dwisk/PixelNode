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
var PixelNode_Canvas = require('../lib/PixelNode_Canvas.js');

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
 PixelNode_Effect_Off.prototype.font;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Off.prototype.init = function() {
	console.log("Init Effect Off".grey);
}

PixelNode_Effect_Off.prototype.pos = 4;
PixelNode_Effect_Off.prototype.dir = 1;
// draw effect on target
PixelNode_Effect_Off.prototype.drawTarget = function(target, output) {
	var self = this;
  var c1 = self.getColor(["inputs","rgb","color_right"], {
    dimmer: 0.25,
    offset: 90
  });
  var c2 = self.getColor(["inputs","rgb","color_right"], {
    dimmer: 0.8,
    offset: 90
  });
  canvas = new PixelNode_Canvas(target);
  //canvas.fill(c1);

  // canvas.rectangle(0,0,10,Math.round(this.pos/2),[255-this.pos*2,0,this.pos*3]);
  // canvas.rectangle(0,16,Math.round(this.pos/2+5),2,[0,255,0]);
  // canvas.rectangle(40,10,10,20,[0,0,255]);

  var font = global.pixelNode.fontManager.getFont('8bitwonder');
  if (font && font.initialized) {
    // canvas.drawMap(this.font.mapWord("No"), 6,0, [255,0,0,1]);
    // canvas.drawMap(this.font.mapWord("Camp"), 12,11, [255,255,255,0.8]);
    // canvas.drawMap(this.font.mapWord("Camp"), 0, 22, [255,255,255,0.7]);
    canvas.drawMap(font.mapWord("DWISK"), 3,8, [255,255,255,0.9]);
  }

  canvas.rectangle(3,19,58,8,[0,0,0,0.5]);
  canvas.rectangle(this.pos,19,6,8,[0,0,0]);
  canvas.rectangle(this.pos,26,6,1,[255,255,255]);

  var font2 = global.pixelNode.fontManager.getFont('04b3');
  if (font2 && font2.initialized) {
    canvas.drawMap(font2.mapWord("Spielmaschine"), 4, 20, [255,255,255,0.9]);
  }


  // canvas.line(this.pos+7,17,40,30, [0,228,0]);
  // canvas.oval(this.pos, 10, 15, 10, [255,0,0,0.5]);

  this.pos += this.dir;
  if (this.pos <= 3) {
    this.dir = 1;
    this.pos = 3;
  }
  if (this.pos >= 64-9) {
    this.dir = -1;
    this.pos = 64-9;
  }

}
