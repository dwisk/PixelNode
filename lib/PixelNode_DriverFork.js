/**
 * PixelNode_DriverFork 
 * 
 * Base class for managing inputs
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */


global.pixelData = {};
var pixelDriver;
var cache = require('node-shared-cache');

if (!process.send) {
} else {
	global.pixelCache = new cache.Cache("pixelNode_pixelData", 557056);

	pixelDriverConfig = process.argv[2];
	process.send("init");

	process.on("message", function(msg) {
		if (msg.action == "config") {
			process.send("config");
			pixelDriverConfig = msg.config;
			global.mapping = msg.mapping;
			try {
				PixelDriver = require(pixelDriverConfig.module);
				pixelDriver = new PixelDriver(pixelDriverConfig, global.pixelData);
			} catch (Exception) {
				process.send(Exception);
			} 
			setInterval(function() {
				global.pixelData = pixelCache.pixelData;
				//console.log("alive", pixelCache.pixelData.domePixels.strips);
				//console.log("client", global.pixelCache.pixelData.domePixels.strips);
			}, 30);

		} else if (msg.action == "pixelData") {
			//pixelData = msg.data;	
			pixelDriver.pixelData = msg.data;
		} else if (msg.action == "pixelDataSub") {
			//console.log("receive");
			pixelDriver.pixelData[msg.map].mode = msg.mode;
			//console.log(msg.index, msg.data);
			pixelDriver.pixelData[msg.map][msg.mode][msg.part][msg.index] = msg.data;
			//console.log(pixelDriver.pixelData[msg.map][msg.mode][msg.part][msg.index]);
			
		} 
		
	});


}