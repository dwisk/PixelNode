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

var util = require("util");

/* Class Constructor
 * ==================================================================================================================== */

// extending Game
PixelNode_Game = require('../../lib/PixelNode_Game.js');

// define the Student class
function PixelNode_Game_EffectQueue(options, effects) {
  var self = this;
  PixelNode_Game_EffectQueue.super_.call(self, options, effects);
  self.className = "PixelNode_Game_EffectQueue";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Game_EffectQueue, PixelNode_Game);

// module export
module.exports = PixelNode_Game_EffectQueue;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Game_EffectQueue.prototype.default_options = {}

PixelNode_Game_EffectQueue.prototype.effects = [];
PixelNode_Game_EffectQueue.prototype.effect = null;
PixelNode_Game_EffectQueue.prototype.queueEffect = null;
PixelNode_Game_EffectQueue.prototype.queueId = 0;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Game_EffectQueue.prototype.init = function() {
	console.log("Init Game Animation".grey);
	var self = this;

	//self.options.effects.forEach(function(effect) {		
	//	var Effect = require(effect.module);
	//	self.effects.push(new Effect(effect));
	//})

	self.setEffectByQueueId(0);

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

PixelNode_Game_EffectQueue.prototype.pixelDataOff = function() {
	var self = this;
	if (global.pixelNode.gameManager) {
		global.mapping.forEach(function(map) {
			global.pixelNode.gameManager.pixelData[map.name].mode = "off";
		});
	}
}

// draw effect – override this
PixelNode_Game_EffectQueue.prototype.draw = function() {
	var self = this;
	self.effect.draw();

	var counter = global.pixelNode.clock.get();
	
	if (global.config.inputMode == "server" && counter >=(self.queueEffect.duration || 10000)) {
		console.log("Game Animation: autoplay".grey)
		self.nextEffect();
	}

}


PixelNode_Game_EffectQueue.prototype.nextEffect = function() {
	var next = this.queueId + 1;
	if (next >= this.options.queue.length) {
		next = 0;
	}
	this.setEffectByQueueId(next);
};

PixelNode_Game_EffectQueue.prototype.setEffectByQueueId = function(id) {
	this.pixelDataOff();
	if (this.options.queue[id]) {
		this.setEffectByName(this.options.queue[id].effect);
		this.queueEffect = this.options.queue[id];
		this.queueId = id;

		global.pixelNode.data.set("gameAnimation.queueId", id);
		global.pixelNode.data.set("game.subtitle", this.effect.name);
	}
};

PixelNode_Game_EffectQueue.prototype.getEffectByName = function(name) {
	var self = this;
	var effect = null;
	self.effects.forEach(function(fx) {
		if (fx.name == name) {
			effect = fx;
		}
	});
	return effect;
}
PixelNode_Game_EffectQueue.prototype.setEffectByName = function(name) {
	var self = this;
	self.pixelDataOff();

	self.effect = self.getEffectByName(name);

	global.pixelNode.clock.reset();

	if (self.effect.reset != undefined)  {
		self.effect.reset();
	}

	console.log(("Changed Effect to " + this.effect.options.name.white + (" (" + this.effect.options.module + ")").grey).grey);
	global.pixelNode.data.set("gameAnimation.effect", this.effect.options);
};

