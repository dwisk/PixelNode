/**
 * PixelNode_Effect
 *
 * Base class for effects
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Inclues
 * ==================================================================================================================== */

var _ = require('underscore');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Effect(options) {	
	this.options = _.extend({},this.base_options, this.default_options, options);
	this.name = this.options.name;
	this.init();
	this.initTargets();
}

// module export
module.exports = PixelNode_Effect;


/* Variables
 * ==================================================================================================================== */

PixelNode_Effect.prototype.base_options = {}
PixelNode_Effect.prototype.default_options = {}
PixelNode_Effect.prototype.options = {}
PixelNode_Effect.prototype.counter = 0
PixelNode_Effect.prototype.name = "unnamed"
PixelNode_Effect.prototype.public_dir = null


/* Override Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect.prototype.init = function() {
	console.log("Init Effect".grey);
}

// reset effect – override
PixelNode_Effect.prototype.reset = function() {
}

// init targets – override for full control
PixelNode_Effect.prototype.initTargets = function() {
	var self = this;
	var target;
	self.options.outputs.forEach(function(output){
		output.targets.forEach(function(outputTarget) {
			var path = outputTarget.split(".");
			target = global.pixelNode.gameManager.pixelData;
			var lastPart;
			var secondLastPart;
			path.forEach(function(part) {
				lastTarget = target;
				if (target[part]) {
					target = target[part];
					lastPart = part;
				}
			});

			if (target) {
				setImmediate(self.initTarget.bind(self), target, output.name, outputTarget);
				lastTarget.mode = lastPart;

			}
		});

	});

	this.counter = global.pixelNode.clock.get();
}

// init target – override
PixelNode_Effect.prototype.initTarget = function(target, output, target_name) {

}


// draw effect – override for full control
PixelNode_Effect.prototype.draw = function() {
	var self = this;
	var target;
	for (var i = 0; i < self.options.outputs.length;i++) {
		for (var j = 0; j < self.options.outputs[i].targets.length;j++) {
			var path = self.options.outputs[i].targets[j].split(".");
			target = global.pixelNode.gameManager.pixelData;
			var lastPart;
			var secondLastPart;
			path.forEach(function(part) {
				lastTarget = target;
				if (target[part]) {
					target = target[part];
					lastPart = part;
				}
			});

			if (target) {
				setImmediate(self.drawTarget.bind(self), target, self.options.outputs[i].name, self.options.outputs[i].targets[j]);
				lastTarget.mode = lastPart;

			}
		}

	}

	this.counter = global.pixelNode.clock.get();
}

// draw effect on targets – override
PixelNode_Effect.prototype.drawTarget = function(target, output, target_name) {

}


/* Methods
 * ==================================================================================================================== */

// draw rainbow
PixelNode_Effect.prototype.getRainbow = function(length, offset, scale) {
	var pixels = [];
	if (!scale) scale = 1;

	for (var pixel = 0; pixel < length; pixel++) {
		c = new HSVColour(pixel/length*360/scale+offset, 100, 100).getRGB();
		pixels[pixel] = [c.r, c.g, c.b];
		//offset += 20;
	}

	return pixels;
}

// draw array values into target
PixelNode_Effect.prototype.fillArray = function(target, array) {
	var length = target.length;
	for (var pixel = 0; pixel < length; pixel++) {
		if (pixel < array.length) {
			target[pixel] = array[pixel];
		} else {
			target[pixel] = array[pixel - array.length ];
		}
	}
}


// fill color
PixelNode_Effect.prototype.fillColor = function(target, c) {
	var length = target.length;
	var color = {};
	if (!c.r) {
		color.r = c[0];
		color.g = c[1];
		color.b = c[2];
	} else {
		color = c;
	}
	for (var pixel = 0; pixel < length; pixel++) {
		target[pixel] = [color.r, color.g, color.b];
		//offset += 20;
	}
}




// draw rainbow
PixelNode_Effect.prototype.getColor = function(data_path, options) {
	var c, c2;
	var self = this;

	// options
	var opts = _.extend({
		speed: 50,
		dimmer: 1,
		offset: 0,
		saturation: 100
	}, options);

	// get color
	c = global.pixelNode.data.fastGet(data_path);

	// return if is set
	if (c && (c[0] != 0 || c[1] != 0 || c[2] != 0)) {
		c2 = new RGBColour(c[0]*opts.dimmer,c[1]*opts.dimmer,c[2]*opts.dimmer).getRGB();

	// else return fading color
	} else {
		c2 = new HSVColour(self.counter/opts.speed+opts.offset, opts.saturation, 100*opts.dimmer).getRGB();
	}

	return [c2.r, c2.g, c2.b];
}

PixelNode_Effect.prototype.dimmColor = function(color, dimmer) {
	return [color[0] * dimmer, color[1] * dimmer, color[2] * dimmer]
}


/* Embedded Helper
 * ==================================================================================================================== */

/*

Colour.js

Objects for handling and processing colours

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/
function Colour(){this.getIntegerRGB=function(){var a=this.getRGB();return{r:Math.round(a.r),g:Math.round(a.g),b:Math.round(a.b),a:a.a}},this.getPercentageRGB=function(){var a=this.getRGB();return{r:100*a.r/255,g:100*a.g/255,b:100*a.b/255,a:a.a}},this.getCSSHexadecimalRGB=function(){var a=this.getIntegerRGB(),b=a.r.toString(16),c=a.g.toString(16),d=a.b.toString(16);return"#"+(2==b.length?b:"0"+b)+(2==c.length?c:"0"+c)+(2==d.length?d:"0"+d)},this.getCSSIntegerRGB=function(){var a=this.getIntegerRGB();return"rgb("+a.r+","+a.g+","+a.b+")"},this.getCSSIntegerRGBA=function(){var a=this.getIntegerRGB();return"rgb("+a.r+","+a.g+","+a.b+","+a.a+")"},this.getCSSPercentageRGB=function(){var a=this.getPercentageRGB();return"rgb("+a.r+"%,"+a.g+"%,"+a.b+"%)"},this.getCSSPercentageRGBA=function(){var a=this.getPercentageRGB();return"rgb("+a.r+"%,"+a.g+"%,"+a.b+"%,"+a.a+")"},this.getCSSHSL=function(){var a=this.getHSL();return"hsl("+a.h+","+a.s+"%,"+a.l+"%)"},this.getCSSHSLA=function(){var a=this.getHSL();return"hsl("+a.h+","+a.s+"%,"+a.l+"%,"+a.a+")"},this.setNodeColour=function(a){a.style.color=this.getCSSHexadecimalRGB()},this.setNodeBackgroundColour=function(a){a.style.backgroundColor=this.getCSSHexadecimalRGB()}}function RGBColour(a,b,c,d){function i(a,b){if(0==b)var c=0;else switch(a){case f.r:var c=60*((f.g-f.b)/b);0>c&&(c+=360);break;case f.g:var c=60*((f.b-f.r)/b)+120;break;case f.b:var c=60*((f.r-f.g)/b)+240}return c}function j(){var a=Math.max(f.r,f.g,f.b),b=a-Math.min(f.r,f.g,f.b);g={h:i(a,b),s:0==a?0:100*b/a,v:a/2.55}}function k(){var a=Math.max(f.r,f.g,f.b),b=a-Math.min(f.r,f.g,f.b),c=a/255-b/510;h={h:i(a,b),s:0==b?0:b/2.55/(.5>c?2*c:2-2*c),l:100*c}}var e=void 0===d?1:Math.max(0,Math.min(1,d)),f={r:Math.max(0,Math.min(255,a)),g:Math.max(0,Math.min(255,b)),b:Math.max(0,Math.min(255,c))},g=null,h=null;this.getRGB=function(){return{r:f.r,g:f.g,b:f.b,a:e}},this.getHSV=function(){return null==g&&j(),{h:g.h,s:g.s,v:g.v,a:e}},this.getHSL=function(){return null==h&&k(),{h:h.h,s:h.s,l:h.l,a:e}}}function HSVColour(a,b,c,d){function i(){if(0==f.s)var a=f.v,b=f.v,c=f.v;else{var d=f.h/60-Math.floor(f.h/60),e=f.v*(1-f.s/100),h=f.v*(1-f.s/100*d),i=f.v*(1-f.s/100*(1-d));switch(Math.floor(f.h/60)){case 0:var a=f.v,b=i,c=e;break;case 1:var a=h,b=f.v,c=e;break;case 2:var a=e,b=f.v,c=i;break;case 3:var a=e,b=h,c=f.v;break;case 4:var a=i,b=e,c=f.v;break;case 5:var a=f.v,b=e,c=h}}g={r:2.55*a,g:2.55*b,b:2.55*c}}function j(){var a=(2-f.s/100)*f.v/2;h={h:f.h,s:f.s*f.v/(50>a?2*a:200-2*a),l:a},isNaN(h.s)&&(h.s=0)}var e=void 0===d?1:Math.max(0,Math.min(1,d)),f={h:(a%360+360)%360,s:Math.max(0,Math.min(100,b)),v:Math.max(0,Math.min(100,c))},g=null,h=null;this.getRGB=function(){return null==g&&i(),{r:g.r,g:g.g,b:g.b,a:e}},this.getHSV=function(){return{h:f.h,s:f.s,v:f.v,a:e}},this.getHSL=function(){return null==h&&j(),{h:h.h,s:h.s,l:h.l,a:e}}}function HSLColour(a,b,c,d){function i(){if(0==f.s)g={r:2.55*f.l,g:2.55*f.l,b:2.55*f.l};else{var b=f.l<50?f.l*(1+f.s/100):f.l+f.s-f.l*f.s/100,c=2*f.l-b;g={r:(a+120)/60%6,g:a/60,b:(a+240)/60%6};for(var d in g)g.hasOwnProperty(d)&&(g[d]=g[d]<1?c+(b-c)*g[d]:g[d]<3?b:g[d]<4?c+(b-c)*(4-g[d]):c,g[d]*=2.55)}}function j(){var a=f.s*(f.l<50?f.l:100-f.l)/100;h={h:f.h,s:200*a/(f.l+a),v:a+f.l},isNaN(h.s)&&(h.s=0)}var e=void 0===d?1:Math.max(0,Math.min(1,d)),f={h:(a%360+360)%360,s:Math.max(0,Math.min(100,b)),l:Math.max(0,Math.min(100,c))},g=null,h=null;this.getRGB=function(){return null==g&&i(),{r:g.r,g:g.g,b:g.b,a:e}},this.getHSV=function(){return null==h&&j(),{h:h.h,s:h.s,v:h.v,a:e}},this.getHSL=function(){return{h:f.h,s:f.s,l:f.l,a:e}}}RGBColour.prototype=new Colour,HSVColour.prototype=new Colour,HSLColour.prototype=new Colour;
