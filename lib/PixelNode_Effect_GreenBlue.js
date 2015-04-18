/**
 * PixelNode_Effect_GreenBlue 
 * 
 * Ported fadecandy example
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */



/* Class Constructor
 * ==================================================================================================================== */

// extending InputManager
PixelNode_Effect_GreenBlue = require('./PixelNode_Effect.js');

// module export
module.exports = PixelNode_Effect_GreenBlue;


/* Variables
 * ==================================================================================================================== */




/* Methods
 * ==================================================================================================================== */

// draw effect
PixelNode_Effect_GreenBlue.prototype.draw = function() {
	var millis = new Date().getTime();

	var length = this.pixelData["domePixels"]["rings"][0].length;

	for (var pixel = 0; pixel < length; pixel++)
	{
	    var t = pixel * 0.5 + millis * 0.002;
	    var green = 128 + 96 * Math.sin(t);
	    var red = 0; //128 + 0 * Math.sin(t + 0.1);
	    var blue = 128 + 0 * Math.sin(t + 0.3);

		for (var ring = 0; ring < this.pixelData["domePixels"]["rings"].length;ring++) {
			this.pixelData["domePixels"]["rings"][ring][pixel] = [red, green, blue];
		}			    
	}
}