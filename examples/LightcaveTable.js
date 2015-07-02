/**
 * Example
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * -------------------------------------------------------------------------------------------------------------------- */

var PixelNode = require('../index.js');


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
			"idletime": 2 * 60
		},

		// DRIVERS ----------------------------------------------------------------------------------------------------

		"pixelDrivers": [
			{
				"module": "pixelnode-driver-fadecandy",
				"address": "127.0.0.1",
				"port": 7890,
				"delay": 50
			}
		],


		// EFFECTS ----------------------------------------------------------------------------------------------------

		"effects": PixelNode.requireFile("LightcaveTable_effects.json"),
		"after_effects": [
			"PlayerColor"
		],


		// INPUTS ----------------------------------------------------------------------------------------------------

		"inputs": PixelNode.requireFile("LightcaveTable_inputs.json"),


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

// override effects
testPixelNode.gameManager.on("drawGame_after", function() {

	// show rainbow for player 1 if button is pressed
	if (testPixelNode.data.get("inputs.buttons.button_left")) {
		testPixelNode.gameManager.getEffectByName("RainBowPlayer1").draw();
	}

	// show rainbow for player 2 if button is pressed
	if (testPixelNode.data.get("inputs.buttons.button_right")) {
		testPixelNode.gameManager.getEffectByName("RainBowPlayer2").draw();
	}

	if (!testPixelNode.gameManager.game.options.touch_input) {
		testPixelNode.gameManager.getEffectByName("OffTouch").draw();
	}
	if (!testPixelNode.gameManager.game.options.color_input) {
		testPixelNode.gameManager.getEffectByName("OffColor").draw();
	}
});



/* Check for autooff
 * -------------------------------------------------------------------------------------------------------------------- */

setInterval(function() {
	time = new Date();
	hour = time.getHours();

	if (((hour >= 20) || (hour < 7))) {
		global.pixelNode.data.set("games.force_off", false);
	} else {
		//global.pixelNode.data.set("games.force_off", true);
	}
	
},1000*1);
