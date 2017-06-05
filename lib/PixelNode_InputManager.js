/**
 * PixelNode_InputManager
 *
 * Base class for managing inputs
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

function PixelNode_InputManager(options) {
	this.options = extend(extend(this.base_options, this.default_options), options);

	var self = this;

	global.pixelNode.data.set(["inputs"], {});


	// configured inputs
	global.config.inputs.forEach(function(input) {
		// prepare data object
		global.pixelNode.data.extend(["inputs",input.name], {inited: true});

		// prepare data object
		var input_module = global.pixelnodeRequireFile(input.module);
		self.inputs[input.name] = new input_module(input);
	});

	// call init
	this.init();
}

// module export
module.exports = PixelNode_InputManager;


/* Variables
 * ==================================================================================================================== */

PixelNode_InputManager.prototype.base_options = {}
PixelNode_InputManager.prototype.default_options = {}
PixelNode_InputManager.prototype.options = {}
PixelNode_InputManager.prototype.data = {};
PixelNode_InputManager.prototype.inputs = [];


/* Methods
 * ==================================================================================================================== */

PixelNode_InputManager.prototype.init = function() {
	console.log("Init PixelNode_InputManager Base".grey);

};
