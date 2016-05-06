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


var pixelData = {};
var pixelDriver;

if (!process.send) {
} else {
	pixelDriverConfig = process.argv[2];
	process.send("init");

	process.on("message", function(msg) {
		if (msg.action == "config") {
			pixelDriverConfig = msg.config;
			global.mapping = msg.mapping;
			try {
				PixelDriver = require(pixelDriverConfig.module);
				pixelDriver = new PixelDriver(pixelDriverConfig, pixelData);
			} catch (Exception) {
				process.send(Exception);
			} 

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