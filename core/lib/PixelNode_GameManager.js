/**
 * PixelNode_GameManager
 *
 * Allows to switch between games
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

var EventEmitter = require('events').EventEmitter;


class PixelNode_GameManager extends EventEmitter {

/* Class Constructor
 * ==================================================================================================================== */

	constructor(options) {
		super();

		console.log("Init GameManager".grey);
		var self = this;

		this.options = {...this.constructor.default_options, ...options};
		this.pixelData = {};
		this.draw_interval = null;
		this.game = null;
		this.listGame = null;
		this.defaultGame = null;
		this.game_off = null;
		this.listId = 0;
		this.games = [];
		this.effects = [];
		this.wasOff = false;
		this.lastInteraction = new Date();
	
		this.initPixelData();

		global.pixelNode.on('ready', function() {
			self.initObserver();

			global.config.effects.forEach(function(effect) {
				var Effect = global.PixelNode.getOption(effect.module);
				self.effects.push(new Effect(effect));
			})

			global.config.games.forEach(function(game) {
				var Game = global.PixelNode.getOption(game.module);
				self.games.push(new Game(game, self.effects));
			})



			// init pixelNode data
			global.pixelNode.data.extend(["games"], {
				force_off: false
			});

			self.setGameByListId(0);

			this.draw_interval = setInterval(function() {
				// draw
				self.drawGame();

				// update counter (deprecated, use clock)
				var counter = global.pixelNode.clock.get();
				global.pixelNode.data.setSilent("counter", counter, true);

			}, 25);

		});


	}



	/* Variables
	* ==================================================================================================================== */

	static default_options = {
		master: true,
		idletime: 5
	};

	/* Functions
	* ==================================================================================================================== */

	// init pixel array and set color to black
	initPixelData() {
		var self = this;

		// loop through mapping
		global.mapping.forEach(function(map) {

			// create rings
			var pixelRings = [];
			map.rings.forEach(function(ring) {
				var pixelRing = [];
				// add object with black color values for each pixel
				ring.px.forEach(function(pixelConfig) {
					pixelRing.push([0,0,0]);
				});
				// push ring into rings
				pixelRings.push(pixelRing);
			});

			// create strips
			var pixelStrips = [];
			map.strips.forEach(function(strip) {
				var pixelStrip = [];
				// add object with black color values for each pixel
				strip.px.forEach(function(pixelConfig) {
					pixelStrip.push([0,0,0]);
				});
				// push strip into rings
				pixelStrips.push(pixelStrip);
			});

			// add map to pixelData
			self.pixelData[map.name] = {
				mode: "off",
				rings: pixelRings,
				strips: pixelStrips
			};
		});
	}

	pixelDataOff() {
		var self = this;
		global.mapping.forEach(function(map) {
			self.pixelData[map.name].mode = "off";
		})
	}

	// draw Games
	drawGame() {
		var self = this;

		// go off if force_off is used
		if (global.pixelNode.data.fastGet(["games","force_off"])) {
			this.getEffectByName("Off").draw();
			this.wasOff = true;

		// draw games
		} else {
			// reset pixel after force_off was used
			if (this.wasOff) {
				this.pixelDataOff();
				this.wasOff = false;
			}

			// hook for applying before games
			this.emit('drawGame_before');

			// draw main game
			this.game.draw();

			// after effects
			global.config.after_effects.forEach(function(effect_name) {
				self.getEffectByName(effect_name).draw();
			});

			// hook for applying after games
			this.emit('drawGame_after');
		}
	};

	nextGame() {
		var next = this.listId + 1;
		if (next >= global.config.games.length) {
			next = 0;
		}
		this.setGameByListId(next);
	};

	prevGame() {
		var next = this.listId - 1;
		if (next < 0) {
			next = global.config.games.length-1;
		}
		this.setGameByListId(next);
	};

	setGameByListId(id, silent) {
		this.pixelDataOff();
		this.setGameByName(global.config.games[id].name);
		this.listGame = global.config.games[id];
		this.listId = id;

		if (silent) {
			global.pixelNode.data.setSilent("games.listId", id);
		} else {
			global.pixelNode.data.set("games.listId", id);
		}
	};

	getGameByName(name) {
		var self = this;
		var game = null;
		self.games.forEach(function(gm) {
			if (gm.name == name) {
				game = gm;
			}
		});
		return game;
	}
	setGameByName(name) {
		var self = this;
		self.pixelDataOff();

		self.game = self.getGameByName(name);

		self.game.reset();

		global.pixelNode.clock.reset();

		console.log(("Changed Game to " + this.game.options.name.white + (" (" + this.game.options.module.name + ")").grey).grey);
		global.pixelNode.data.set("game", this.game.options);
	};

	initObserver() {
		var self = this;
		global.pixelNode.data.on("changed_games_listId", function(paths, value) {
			self.setGameByListId(global.pixelNode.data.get("games.listId"), true);
			self.lastInteraction = new Date();
		});

		global.pixelNode.data.on("changed_inputs", function(paths, value) {
			self.lastInteraction = new Date();
		})
	}

	getEffectByName(name) {
		var self = this;
		var effect = null;
		self.effects.forEach(function(fx) {
			if (fx.name == name) {
				effect = fx;
			}
		});
		if (effect == null) {
			throw new Error('Effect "'+name+'" not found!');
		}
		return effect;
	}

}

// module export
module.exports = PixelNode_GameManager;
