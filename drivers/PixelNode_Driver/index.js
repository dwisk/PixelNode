/**
 * PixelNode_Driver
 * 
 * Base class for led drivers
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Includes
 * ==================================================================================================================== */

/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Driver(options,pixelData) {	
	this.options = {...this.base_options, ...this.default_options, ...options};
	this.className = "PixelNode_Driver";
	this.pixelData = pixelData;
	this.init();
}

// module export
module.exports = PixelNode_Driver;


/* Variables
 * ==================================================================================================================== */

PixelNode_Driver.prototype.base_options = {
	offset: false,
	delay: 50,
	pixelCount: 512,
	pixelColorCorrection: false
}
PixelNode_Driver.prototype.default_options = {}
PixelNode_Driver.prototype.pixelData = {}
PixelNode_Driver.prototype.painter_interval = null;


/* Override Methods
 * ==================================================================================================================== */

// init driver – to be overridden
PixelNode_Driver.prototype.init = function() {
	// override
	console.log("Init PixelDriver:", this.options);
}

// set's a pixel – to be overridden
PixelNode_Driver.prototype.setPixel = function(strip, id, r,g,b) {
	// override
}

// sends Pixels to destination – to be overridden
PixelNode_Driver.prototype.sendPixels = function() {
	// override
}


/* Methods
 * ==================================================================================================================== */

// reset pixels to black
PixelNode_Driver.prototype.resetPixels = function() {
	for (var pixel = 0; pixel < this.options.pixelCount; pixel++)
	{
	    this.setPixel(0, pixel, 0, 0, 0);
	}
}

// start painter interval
PixelNode_Driver.prototype.startPainter = function() {
	var self = this;	

	// initial reset pixels and call painter
	this.resetPixels();
	this.painter.call(self);

	// set interval for painter
	this.painter_interval = setInterval(function() {
	  setImmediate(self.painter.bind(self));
	}, self.options.delay);  
}

// painter
PixelNode_Driver.prototype.painter = function() {
    var self = this;

	for (var m = 0; m < global.pixelNode.gameManager.pixelData.maps.length;m++) {
		mapName = global.pixelNode.gameManager.pixelData.maps[m];
		var map;
		for (var i = 0; i < global.mapping.length;i++) {
			if (global.mapping[i].name === mapName) {
				map = global.mapping[i];

			}
			// break;
		}

		if (self.pixelData[map.name] && self.pixelData[map.name].mode !== "off") {
	    	var ringI = 0;

	    	for (var j = 0; j < map[self.pixelData[map.name].mode].length;j++) {
	    		ring = map[self.pixelData[map.name].mode][j];
	    		self.paintRing(ring, ringI, map);

		    	ringI++;
	    	}
    	}
	}

    //setImmediate(self.sendPixels.bind(self));
    self.sendPixels();
}


PixelNode_Driver.prototype.paintRing = function(ring, ringI, map) {
	var self = this;

	var pixels = self.getPixels(ring);

	// pixels
	var pixelI = 0;
	for (var p = 0; p < pixels.length;p++) {
		pixelConfig = pixels[p];

		const pixelDataMap = self.pixelData[map.name];

		var red = pixelDataMap[pixelDataMap.mode][ringI][pixelI][0];
		var green = pixelDataMap[pixelDataMap.mode][ringI][pixelI][1];
		var blue = pixelDataMap[pixelDataMap.mode][ringI][pixelI][2];
		var alpha = pixelDataMap[pixelDataMap.mode][ringI][pixelI][3];
		// if (map.name == "panel2") console.log(pixelDataMap[pixelDataMap.mode][ringI][pixelI]);
		if (typeof alpha === "undefined" || alpha !== 0) {
			// pixelConfig[2] = [map.name, red, green, blue];

			if (!self.options.pixelColorCorrection || pixelConfig[2] || ring.pixelColorCorrection || map.pixelColorCorrection) {
				self.setPixel(pixelConfig[0], pixelConfig[1], red, green, blue);
			} else {
				self.setPixel(pixelConfig[0], pixelConfig[1], green, red, blue);
			}
		}
    	pixelI++;
	}
}

PixelNode_Driver.prototype.getPixels = function(ring) {
	var self = this;

	// offset ring
	if (self.options.offset && ring.offset) {
		var segment1 = ring.px.slice(ring.offset,12);
		var segment2 = ring.px.slice(0,ring.offset);
		pixels = segment1.concat(segment2);
	} else {
		pixels = ring.px;
	}

	// mirror

	if (ring.mirrow && !ring.px.mirrowed ) {
		tmppixels = [...[], ...pixels];
		var j = 0;
		for (var i = tmppixels.length - 1; i >= 0; i--) {
			pixels[j] = tmppixels[i];
			j++;
		};
		ring.px.mirrowed = true;
	}

	return pixels;
}
