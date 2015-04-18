/**
 * PixelNode_Input 
 * 
 * Base class for input sources
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Inclues
 * ==================================================================================================================== */

var extend = require('util')._extend;


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Input(options) {	
	this.options = extend(extend(this.base_options, this.default_options), options);
	this.init();
}

// module export
module.exports = PixelNode_Input;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input.prototype.base_options = {}
PixelNode_Input.prototype.default_options = {}
PixelNode_Input.prototype.options = {}


/* Methods
 * ==================================================================================================================== */

 PixelNode_Input.prototype.init = function() {
	console.log("Init Input".grey);
}