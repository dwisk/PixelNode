/**
 * PixelNode_Game
 * 
 * Base class for games
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

class PixelNode_Game {

	static base_options = {}
	static default_options = { "parent": true}

	static get defaultOptions() {
		return this.default_options;
	}

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options, effects) {	
		this.options = {...PixelNode_Game.base_options, ...this.constructor.defaultOptions, ...options};

		this.counter = 0;
		
		this.name = this.options.name;
		this.effects = effects;
		// this.init();
	}

	/* Override Methods
	* ==================================================================================================================== */

	// init game – override
	init() {
		console.log("Init Game".grey);
	}

	// init game – override
	reset() {
	}

	// draw game – override this
	draw() {
		this.counter += 10;
	}

}



/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Game;