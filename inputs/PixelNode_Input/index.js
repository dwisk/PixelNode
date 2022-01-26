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


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Input(options) {	
	this.options = {...this.base_options, ...this.default_options, ...options};
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

// sets input via PixelNode_Data
PixelNode_Input.prototype.setInputData = function(data, target) {
	var self = this;
	if (target) {		
		global.pixelNode.data.set(["inputs",self.options.name, target], data);
	} else {
		global.pixelNode.data.set(["inputs",self.options.name], data);
	}
}