/**
 * PixelNode_Game_EffectQueue
 *
 * Animation Game
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

// extending Game
PixelNode_Game = require('./PixelNode_Game.js');

class PixelNode_Game_EffectQueue extends PixelNode_Game {

	static default_options = { }
	
	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options, effects) {
		super(options, effects);

		this.effect = null;
		this.afterEffect = null;
		this.queueEffect = null;
		this.queueId = 0;

		this.init();
	}


	/* Overridden Methods
	* ==================================================================================================================== */

	// init effect – override
	init () {
		console.log("Init Game Animation".grey);
		var self = this;

		self.setEffectByQueueId(0);

		if (self.options.afterEffect) {
			self.afterEffect = self.getEffectByName(self.options.afterEffect);
		}


		if (global.config.inputMode == "server") {
			global.pixelNode.data.on("changed_inputs_buttons_button_back", function(paths, value) {
				if(self.options.name == global.pixelNode.data.get("game.name") && value) {
					self.nextEffect();
				}
			});
		}
		global.pixelNode.data.on("changed_gameAnimation_queueId", function() {
			if(self.options.name == global.pixelNode.data.get("game.name")) {
				self.setEffectByQueueId.call(self,global.pixelNode.data.get("gameAnimation.queueId"));
			}
		});
		global.pixelNode.data.on("replaced", function() {
			if(self.options.name == global.pixelNode.data.get("game.name")) {
				self.setEffectByQueueId.call(self,global.pixelNode.data.get("gameAnimation.queueId"));
			}
		});
	}

	pixelDataOff() {
		global.pixelNode.gameManager.pixelDataOff();
	}

	// draw effect – override this
	draw () {
		var self = this;
		self.effect.draw();
	if (self.afterEffect) self.afterEffect.draw();

		var counter = global.pixelNode.clock.get();

		if (global.config.inputMode == "server" && counter >=(self.queueEffect.duration || 10000)) {
			console.log("Game Animation: autoplay".grey)
			self.nextEffect();
		}

	}


	nextEffect () {
		var next = this.queueId + 1;
		if (next >= this.options.queue.length) {
			next = 0;
		}
		this.setEffectByQueueId(next);
	};

	setEffectByQueueId (id) {
		this.pixelDataOff();
		if (this.options.queue[id]) {
			this.setEffectByName(this.options.queue[id].effect);
			this.queueEffect = this.options.queue[id];
			this.queueId = id;

			global.pixelNode.data.set("gameAnimation.queueId", id);
			global.pixelNode.data.set("game.subtitle", this.effect.name);
		}
	};

	getEffectByName (name) {
		var self = this;
		var effect = null;
		self.effects.forEach(function(fx) {
			if (fx.name == name) {
				effect = fx;
			}
		});
		return effect;
	}
	setEffectByName (name) {
		var self = this;
		self.pixelDataOff();

		self.effect = self.getEffectByName(name);

		global.pixelNode.clock.reset();

		if (self.effect.reset != undefined)  {
			self.effect.reset();
		}

		console.log(("Changed Effect to " + this.effect.options.name.white + (" (" + this.effect.options.module.name + ")").grey).grey);
		global.pixelNode.data.set("gameAnimation.effect", this.effect.options);
	};

}

// module export
module.exports = PixelNode_Game_EffectQueue;