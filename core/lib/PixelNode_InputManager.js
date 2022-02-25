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


/* Node Includes
 * ==================================================================================================================== */

var extend = require('util')._extend;

class PixelNode_InputManager {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options) {
		this.options = extend(extend(this.base_options, this.default_options), options);

		var self = this;

		this.base_options = {}
		this.default_options = {}
		this.options = {}
		this.data = {};
		this.inputs = [];

		global.pixelNode.data.set(["inputs"], {});


		// configured inputs
		global.config.inputs.forEach(function(input) {
			// prepare data object
			global.pixelNode.data.extend(["inputs",input.name], {inited: true});

			// prepare data object
			var input_module = global.PixelNode.getOption(input.module);
			self.inputs[input.name] = new input_module(input);
		});

		// call init
		this.init();
	}


	/* Methods
	* ==================================================================================================================== */

	init() {
		console.log("Init PixelNode_InputManager Base".grey);
	};

}


// module export
module.exports = PixelNode_InputManager;