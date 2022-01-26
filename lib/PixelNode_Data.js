/**
 * PixelNode_Data 
 * 
 * Data class for shared data
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var objectPath = require("object-path");

class PixelNode_Data extends EventEmitter {

	/* Class Constructor
	* ==================================================================================================================== */

	constructor(options) {
		super();

		var self = this;

		this.options = {...this.default_options, ...options};

		global.pixelNode_data = {};	
	}


	/* Variables
	* ==================================================================================================================== */

	static default_options = {
	};


	/* Functions
	* ==================================================================================================================== */

	// get data value from path
	get(path) {
		return objectPath.get(global.pixelNode_data, path);
	}
	// get data value from path
	fastGet(path) {
		let obj = global.pixelNode_data;
		for (var i = 0; i < path.length; i++) {
			if (obj && (true || obj.hasOwnProperty(path[i]) || obj[path[i]])) {
				obj = obj[path[i]];
			} else {
				return undefined;
			}
		}
		return obj;
	}

	// set data without emiting events
	setSilent(path, value, no_log) {
		if (this.get(path) !== value) {
			objectPath.set(global.pixelNode_data, path, value);

			if (no_log != true) {
				var paths;
				if (_.isArray(path)) {
					paths = path;
				} else {
					paths = path.split(".");
				}
				console.log("PixelNode_Data: Change: ".grey+(paths.join(".")+" = "+value).white);
			}

		}
	}

	// set data and emit events
	set(path, value, no_log) {
		if (this.get(path) !== value) {
			this.setSilent(path, value, no_log);

			var paths;
			if (_.isArray(path)) {
				paths = path;
			} else {
				paths = path.split(".");
			}
			this.emit("changed", paths, value);
			for (var i = paths.length - 1; i >= 0; i--) {
				this.emit("changed_"+paths.slice(0,i+1).join("_"), paths.slice(i+1), value);
			};
		}
	}

	// replace whole data
	replace(value, no_log) {
		console.log("PixelNode_Data: replace".grey);
		global.pixelNode_data = value;
		this.emit("changed", "", value);
		this.emit("replaced");
	}

	// extend data
	extend(path, value) {
		var old_value = this.get(path);
		var new_value = _.extend(old_value, value)

		this.set(path, new_value);
	}

	// create copy of data (sub)objects
	copy(path) {
		if (!path) {
			return _.extend({},global.pixelNode_data);
		} else {
			return _.extend({},this.get(path));
		}
	}

}

// module export
module.exports = PixelNode_Data;
