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
		"title": "Lightcave Dome",
		"inputMode": "client",

		"webServer": {
			"start": false,
			"port": 3001
		},


		// DRIVERS ----------------------------------------------------------------------------------------------------

		"pixelDrivers": [
			{
				"module": "pixelnode-driver-pixelpusher",
				// "module": "../lib/PixelNode_Driver_RGBMatrix.js",
				"delay": 15,
				"dimmer": 1,
				"rows": 32,
				"chainedDisplays": 2

			}
			//,{
			//	"module": "pixelnode-driver-websimulator",
			//	"delay": 50,
			//	"dimmer": 1
			//}
		],


		// EFFECTS ----------------------------------------------------------------------------------------------------

		"effects": PixelNode.requireFile("BarGames_effects.json"),
		"after_effects": [
		],


		// INPUTS ----------------------------------------------------------------------------------------------------

		"inputs": [
		],



		// GAMES  ----------------------------------------------------------------------------------------------------
		"games": PixelNode.requireFile("BarGames_Games.json"),

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

	mapping: "BarGames_mapping.json"
});




/* Check for autooff
 * -------------------------------------------------------------------------------------------------------------------- */

//setInterval(function() {
//	time = new Date();
//	hour = time.getHours();
//
//	if (((hour >= 20) || (hour < 7))) {
//		global.pixelNode.data.set("games.force_off", false);
//	} else {
//		global.pixelNode.data.set("games.force_off", true);
//	}
//
//},1000*1);

