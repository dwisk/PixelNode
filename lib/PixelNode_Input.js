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

var _ = require('underscore');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Input(options) {	
	this.options = _.extend({},this.base_options, this.default_options, options);
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

// init input – override
PixelNode_Input.prototype.init = function() {
	console.log("Init Input".grey);
}