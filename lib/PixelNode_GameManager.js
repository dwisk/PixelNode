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
var util = require('util');
var _ = require('underscore');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_GameManager(options) {
	EventEmitter.call(this);

	console.log("Init GameManager".grey);
	var self = this;

	this.options = _.extend({}, this.default_options, options);

	this.initPixelData();

	global.pixelNode.on('ready', function() {
		self.initObserver();
	});

	global.config.games.forEach(function(game) {		
		var Game = require(game.module);
		self.games.push(new Game(game));
	})

	// init pixelNode data
	global.pixelNode.data.extend(["games"], {
		force_off: false
	});

	self.setGameByQueueId(0);

	this.draw_interval = setInterval(function() {
	  self.drawGame();

	  // master mode is on, set data counter
	  if (self.options.master) {

	  	// incrment counter
		var counter = global.pixelNode.data.get("counter");
		counter += 25;
		global.pixelNode.data.setSilent("counter", counter, true);
	  }
	}, 25);  


}

// GameManager inherits EventEmitter
util.inherits(PixelNode_GameManager, EventEmitter);


// module export
module.exports = PixelNode_GameManager;


/* Variables
 * ==================================================================================================================== */

PixelNode_GameManager.prototype.default_options = {
	master: true
};
PixelNode_GameManager.prototype.pixelData = {};
PixelNode_GameManager.prototype.draw_interval = null;
PixelNode_GameManager.prototype.game = null;
PixelNode_GameManager.prototype.listGame = null;
PixelNode_GameManager.prototype.game_off = null;
PixelNode_GameManager.prototype.listId = 0;
PixelNode_GameManager.prototype.games = [];
PixelNode_GameManager.prototype.wasOff = false;


/* Functions
 * ==================================================================================================================== */

// init pixel array and set color to black
PixelNode_GameManager.prototype.initPixelData = function() {
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

PixelNode_GameManager.prototype.pixelDataOff = function() {
	var self = this;
	global.mapping.forEach(function(map) {
		self.pixelData[map.name].mode = "off";
	})
}

// draw Games
PixelNode_GameManager.prototype.drawGame = function() {
	// go off if force_off is used
	if (global.pixelNode.data.get("games.force_off")) {
		// TODO: not working right now
		this.getGameByName("Off").draw();
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
		
		// hook for applying after games
		this.emit('drawGame_after');
	}
};

PixelNode_GameManager.prototype.nextGame = function() {
	var next = this.listId + 1;
	if (next >= global.config.games.length) {
		next = 0;
	}
	this.setGameByQueueId(next);
};

PixelNode_GameManager.prototype.setGameByQueueId = function(id) {
	this.pixelDataOff();
	this.setGameByName(global.config.games[id].name);
	this.listGame = global.config.games[id];
	this.listId = id;

	global.pixelNode.data.setSilent("games.listId", id);
};

PixelNode_GameManager.prototype.getGameByName = function(name) {
	var self = this;
	var game = null;
	self.games.forEach(function(gm) {
		if (gm.name == name) {
			game = gm;
		}
	});
	return game;
}
PixelNode_GameManager.prototype.setGameByName = function(name) {
	var self = this;
	self.pixelDataOff();

	self.game = self.getGameByName(name);

	global.pixelNode.data.setSilent("counter", 0, true);

	console.log(("Changed Game to " + this.game.options.name.white + (" (" + this.game.options.module + ")").grey).grey);
	global.pixelNode.data.set("game", this.game.options);
};

PixelNode_GameManager.prototype.initObserver = function() {
	var self = this;
	global.pixelNode.data.on("changed_games_listId", function(paths, value) {
		self.setGameByQueueId(global.pixelNode.data.get("games.listId"));	
	})
}