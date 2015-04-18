/**
 * PixelNode_InputManager_Server 
 * 
 * Adds Socket send capability
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */



/* Class Constructor
 * ==================================================================================================================== */

// extending InputManager
PixelNode_InputManager_Server = require('./PixelNode_InputManager.js');

// module export
module.exports = PixelNode_InputManager_Server;


/* Variables
 * ==================================================================================================================== */




/* Methods
 * ==================================================================================================================== */

PixelNode_InputManager_Server.prototype.init = function() {
	console.log("Init InputManager Server".grey);
	
//	console.log(this.data);
}