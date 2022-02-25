/**
 * Example
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

process.env.NODE_ENV = 'production';

/* Includes
 * -------------------------------------------------------------------------------------------------------------------- */

var PixelNode = require('../index.js');
var b = require('bonescript');


/* Config
 * -------------------------------------------------------------------------------------------------------------------- */

var testPixelNode = new PixelNode({
	config: {
		"title": "Lightcave Table",
		"inputMode": "server",

		"webServer": {
			"start": true,
			"port": 3001
		},

		"gameManager": {
			"idletime": 20 * 60
		},

		// DRIVERS ----------------------------------------------------------------------------------------------------

		"pixelDrivers": [
		{
			"module": "pixelnode-driver-fadecandy",
			"address": "127.0.0.1",
			"port": 7890,
			"delay": 25,
			"dimmer": 1
			}
		],


		// EFFECTS ----------------------------------------------------------------------------------------------------

		"effects": PixelNode.requireFile("LightcaveTable_effects.json"),
		"after_effects": [
			"PlayerColor"
		],


		// INPUTS ----------------------------------------------------------------------------------------------------

		"inputs": PixelNode.requireFile("LightcaveTable_inputs.json"),
		//inputs: [],


		// GAMES  ----------------------------------------------------------------------------------------------------
		"games": PixelNode.requireFile("Lightcave_Games.json"),

		"future_games": [
			{
				"name": "FourRows",
				"module": "../games/PixelNode_Game_FourRows",
				"mappings": {
					"color1": "player1.rings",
					"color2": "player2.rings",
					"canvas": "domePixels.strips"
				},
				"inputs": {
					"color_left": "inputs.rgb.color_left",
					"color_right": "inputs.rgb.color_right",
					"touches": "touch.touches"
				}
			},
			{
				"name": "off",
				"title": "OFF",
				"module": "../games/PixelNode_Game_Animation",
				"mappings": {
					"color1": "player1.rings",
					"color2": "player2.rings",
					"canvas": "domePixels.strips"
				},
				"inputs": {
					"color_left": "inputs.rgb.color_left",
					"color_right": "inputs.rgb.color_right",
					"touches": "touch.touches"
				},
				"queue": [
					{ "effect": "Off", "duration": 100000 }
				],
				"effects": [
					
					{
						"name": "Off",
						"module": "../../effects/PixelNode_Effect_Off",
						"outputs": [
							{
								"name": "ray",
								"targets": [
									"domePixels.rings",
									"inside.rings"
								]
							}
						]
					}
				]
			}	
		]

	},

	mapping: "LightcaveTable_mapping.json"
});



/* Events
 * -------------------------------------------------------------------------------------------------------------------- */

var color_input_was_on = false;

b.pinMode("P8_14", b.OUTPUT);
b.pinMode("P8_15", b.OUTPUT);

var left_on = false;
var right_on = false;

// override effects
testPixelNode.gameManager.on("drawGame_after", function() {

	// show rainbow for player 1 if button is pressed
	if (testPixelNode.data.get("inputs.buttons.button_left")) {
		testPixelNode.gameManager.getEffectByName("RainBowPlayer1").draw();
		left_on = true;
	} else if (left_on) {
		testPixelNode.gameManager.pixelDataOff();
		left_on = false;
	}

	// show rainbow for player 2 if button is pressed
	if (testPixelNode.data.get("inputs.buttons.button_right")) {
		testPixelNode.gameManager.getEffectByName("RainBowPlayer2").draw();
		right_on = true;
	} else if (right_on) {
		testPixelNode.gameManager.pixelDataOff();
		right_on = false;
	}

	// disable buttons if game has no touch_input
	if (!testPixelNode.gameManager.game.options.touch_input) {
		testPixelNode.gameManager.getEffectByName("OffTouch").draw();
	}

	// disable color sensors if game as no color_input
	if (!testPixelNode.gameManager.game.options.color_input) {
		testPixelNode.gameManager.getEffectByName("OffColor").draw();
		if (color_input_was_on) {
			b.digitalWrite("P8_14", 0);
			b.digitalWrite("P8_15", 0);
			color_input_was_on = false;
		} 
	} else {
		if (!color_input_was_on) {
			b.digitalWrite("P8_14", 1);
			b.digitalWrite("P8_15", 1);
			color_input_was_on = true;
		} 
	}
});



/* Check for autooff
 * -------------------------------------------------------------------------------------------------------------------- */

// setInterval(function() {
// 	time = new Date();
// 	hour = time.getHours();
// 
// 	if (((hour >= 20) || (hour < 7))) {
// 		global.pixelNode.data.set("games.force_off", false);
// 	} else {
// 		global.pixelNode.data.set("games.force_off", true);
// 	}
// 	
// },1000*1);
// 