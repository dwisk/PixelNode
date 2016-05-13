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
var util = require('util');
var _ = require('underscore');
var objectPath = require("object-path");


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Data(options) {
	EventEmitter.call(this);
	var self = this;

	this.options = _.extend({}, this.default_options, options);

	global.pixelNode_data = {};

	
}

// EffectManager inherits EventEmitter
util.inherits(PixelNode_Data, EventEmitter);

// module export
module.exports = PixelNode_Data;


/* Variables
 * ==================================================================================================================== */

PixelNode_Data.prototype.default_options = {
};


/* Functions
 * ==================================================================================================================== */

// get data value from path
PixelNode_Data.prototype.get = function(path) {
	return objectPath.get(global.pixelNode_data, path);
}
// get data value from path
PixelNode_Data.prototype.fastGet = function(path) {
	return getPath(global.pixelNode_data, path);
}

function getPath(obj, arr) {
	var i;
	for (i = 0; i < arr.length; i++) {
		if (obj && (true || obj.hasOwnProperty(arr[i]) || obj[arr[i]])) {
			obj = obj[arr[i]];
		} else {
			return undefined;
		}
	}
};

// set data without emiting events
PixelNode_Data.prototype.setSilent = function(path, value, no_log) {
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
PixelNode_Data.prototype.set = function(path, value, no_log) {
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
PixelNode_Data.prototype.replace = function(value, no_log) {
	console.log("PixelNode_Data: replace".grey);
	global.pixelNode_data = value;
	this.emit("changed", "", value);
	this.emit("replaced");
}

function eachRecursive(obj)
{
    for (var k in obj)
    {
        if (typeof obj[k] == "object" && obj[k] !== null) {
            eachRecursive(obj[k]);
        } else {
            // do something... 
        }
    }
}

// extend data
PixelNode_Data.prototype.extend = function(path, value) {
	var old_value = this.get(path);
	var new_value = _.extend(old_value, value)

	this.set(path, new_value);
}

// create copy of data (sub)objects
PixelNode_Data.prototype.copy = function(path) {
	if (!path) {
		return _.extend({},global.pixelNode_data);
	} else {
		return _.extend({},this.get(path));
	}
}