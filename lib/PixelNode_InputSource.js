/**
 * PixelNode_InputSource 
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

function PixelNode_InputSource(options) {	
	this.options = extend(extend(this.base_options, this.default_options), options);
	this.init();
}

// module export
module.exports = PixelNode_InputSource;


/* Variables
 * ==================================================================================================================== */

PixelNode_InputSource.prototype.base_options = {}
PixelNode_InputSource.prototype.default_options = {}
PixelNode_InputSource.prototype.options = {}


/* Methods
 * ==================================================================================================================== */

 PixelNode_InputSource.prototype.init = function() {
	console.log("Init InputSource");
}