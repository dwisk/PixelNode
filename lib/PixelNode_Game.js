/**
 * PixelNode_Game
 * 
 * Base class for effects
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

function PixelNode_Game(options, effects) {	
	this.options = _.extend({},this.base_options, this.default_options, options);
	this.name = this.options.name;
	this.effects = effects;
	this.init();
}

// module export
module.exports = PixelNode_Game;


/* Variables
 * ==================================================================================================================== */

PixelNode_Game.prototype.base_options = {}
PixelNode_Game.prototype.default_options = {}
PixelNode_Game.prototype.options = {}

PixelNode_Game.prototype.effects = []
PixelNode_Game.prototype.counter = 0
PixelNode_Game.prototype.public_dir = null


/* Override Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Game.prototype.init = function() {
	console.log("Init Game".grey);
}

// draw effect – override this
PixelNode_Game.prototype.draw = function() {

	this.counter += 10;
}



/* Methods
 * ==================================================================================================================== */


