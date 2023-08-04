/**
 * PixelNode_Sound
 *
 * Base class for managing fonts
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

var extend = require('util')._extend;
var mpg321;
var path = require('path');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Sound(options) {
	this.options = extend(extend(this.base_options, this.default_options), options);

	var self = this;

	// call init
	this.init();
}

// module export
module.exports = PixelNode_Sound;


/* Variables
 * ==================================================================================================================== */

PixelNode_Sound.prototype.base_options = {}
PixelNode_Sound.prototype.default_options = {
	enabled: false,
	dir: "/"
}
PixelNode_Sound.prototype.options = {}
PixelNode_Sound.prototype.player;
PixelNode_Sound.prototype.playing;


/* Methods
 * ==================================================================================================================== */

PixelNode_Sound.prototype.init = function() {
	console.log("Init PixelNode_Sound".grey);
	var self = this;
	if (this.options.enabled) {
		// SIGINT hack
		process.on('SIGINT', function () {
			process.exit();
		});

		mpg321 = require('mpg321');
	  this.player = mpg321().remote();
	  process.on('SIGINT', function(code) {
			console.log(`About to exit with code: ${code}`);
	    self.player.quit();
			console.log(`About to exit with code: ${code}`);
		});
	}
};

PixelNode_Sound.prototype.play = function(file) {
	if (this.options.enabled) {
	  var self = this;

			console.log("PixelNode_Sound", ("play "+path.join(this.options.dir, file)).bold)
	    self.player.play(path.join(process.cwd(), this.options.dir, file));
		self.player.gain(100)
	    self.playing = true;


	}
}


PixelNode_Sound.prototype.stop = function(file) {
	if (this.options.enabled) {
	  var self = this;

			console.log("PixelNode_Sound", "stop".bold)
	    self.player.stop();
	    self.playing = false;

	}
}
