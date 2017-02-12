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
		"inputMode": "server",

		"webServer": {
			"start": false,
			"port": 3001
		},


		// DRIVERS ----------------------------------------------------------------------------------------------------

		"pixelDrivers": [
			{
				"module": "pixelnode-driver-pixelpusher",
				"delay": 25,
				"dimmer": 1
			}
		],


		// EFFECTS ----------------------------------------------------------------------------------------------------

		"effects": PixelNode.requireFile("BarGames_effects.json"),
		"after_effects": [
		],


		// INPUTS ----------------------------------------------------------------------------------------------------

		"inputs": [
		],


    // FONTS ----------------------------------------------------------------------------------------------------

		"fonts": [
			{
        name: "8bitwonder",
        module: "../fonts/8bitwonder"
      },
			{
        name: "commonpixel",
        module: "../fonts/commonpixel"
      },
			{
        name: "04b3",
        module: "../fonts/04b3"
      },
			{
        name: "hachicro",
        module: "../fonts/hachicro"
      }
		],


		// GAMES  ----------------------------------------------------------------------------------------------------
		"games": PixelNode.requireFile("BarGames_Games.json"),


	},

	mapping: "BarGames_mapping.json"
});



// testPixelNode.gameManager.on("drawGame_after", function() {
//
// 	// show rainbow for player 1 if button is pressed
// 	testPixelNode.gameManager.getEffectByName("Off").draw();
// });

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
