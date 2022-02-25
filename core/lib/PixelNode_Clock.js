/**
 * PixelNode_Clock 
 * 
 * Data class for shared data
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

const EventEmitter = require('events').EventEmitter;

/* Class
 * ==================================================================================================================== */

class PixelNode_Clock extends EventEmitter {

	/* Class Variables
	* ---------------------------------------------------------------------------------------------------------------- */

	default_options = {}


	/* Class Constructor
	* ---------------------------------------------------------------------------------------------------------------- */

	constructor(options) {
		super();
		
		this.clock = 0;
		this.options = {... PixelNode_Clock.default_options, options};

		global.pixelNode.data.setSilent("clockDiff", 0);

		global.pixelNode.data.on("replaced", function(paths, value) {
			var now = new Date();
			var clockBase = new Date(global.pixelNode.data.get("clockSet"));
			global.pixelNode.data.set("clockDiff", now - clockBase, true);
		});
		global.pixelNode.data.set("clockBase", new Date());
		this.reset();
	}


	/* Functions
	 * ---------------------------------------------------------------------------------------------------------------- */

	get() {
		var self = this;
		var clockBase = new Date(global.pixelNode.data.get("clockBase"));
		var clockDiff = global.pixelNode.data.get("clockDiff");
		var now = new Date();
		var old = self.clock;
		self.clock = now - clockBase 
		self.clock -= clockDiff;
		
		return self.clock;
	}

	reset() {
		var self = this;

		if (global.config.inputMode == "server" || override) {
			global.pixelNode.data.set("clockBase", new Date());
			self.clock = 0;
		}
	}
}


/* Module Export
 * ==================================================================================================================== */

module.exports = PixelNode_Clock;
