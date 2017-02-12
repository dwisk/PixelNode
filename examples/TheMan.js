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
//var b = require('bonescript');


/* Config
 * -------------------------------------------------------------------------------------------------------------------- */

var testPixelNode = new PixelNode({
	config: {
		"title": "Lightcave Table",
		"inputMode": "server",

		"webServer": {
			"start": false,
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
			"delay": 50,
			"dimmer": 0.5
			}
		],


		// EFFECTS ----------------------------------------------------------------------------------------------------

		"effects": PixelNode.requireFile("TheMan_effects.json"),
		"after_effects": [
		],


		// INPUTS ----------------------------------------------------------------------------------------------------

		//"inputs": PixelNode.requireFile("LightcaveTable_inputs.json"),
		inputs: [],


		// GAMES  ----------------------------------------------------------------------------------------------------
		"games": PixelNode.requireFile("TheMan_Games.json"),

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

	mapping: "TheMan_mapping.json"
});



/* Events
 * -------------------------------------------------------------------------------------------------------------------- */




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
