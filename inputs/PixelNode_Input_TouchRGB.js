/**
 * PixelNode_Input_TouchRGB 
 * 
 * Ported fadecandy example
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var _ = require('underscore');


/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Input = require('../lib/PixelNode_Input.js');

// define the Student class
function PixelNode_Input_TouchRGB(options,pixelData) {
  var self = this;
  PixelNode_Input_TouchRGB.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_TouchRGB";
}

// class inheritance 
util.inherits(PixelNode_Input_TouchRGB, PixelNode_Input);

// module export
module.exports = PixelNode_Input_TouchRGB;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_TouchRGB.prototype.default_options = {};
PixelNode_Input_TouchRGB.prototype.read_interval = 0;
PixelNode_Input_TouchRGB.prototype.intensitySelect = false;
PixelNode_Input_TouchRGB.prototype.colorSelect = false;
PixelNode_Input_TouchRGB.prototype.colorSelect1 = false;
PixelNode_Input_TouchRGB.prototype.colorSelect2 = false;


var lastTouches;
var lastColor1 = [0,0,0];
var lastColor2 = [0,0,0];
var lastIntensity = 0;

var didOverrideColor = false;
var didOverrideIntensity = false;

var effectColorRing1;
var effectColorRing2;

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_TouchRGB.prototype.init = function() {
	// start & remember this
	console.log("Init Input TouchRGB".grey);
	
	// init inputs
	global.pixelNode_data.inputs = _.extend(global.pixelNode_data.inputs, {
		rgb1: null,
		rgb2: null,
		intensity: null
  	});

	lastTouches = global.pixelNode_data.inputs.touches;


	var Effect_Color = require("../effects/PixelNode_Effect_Color");
	effectColorRing1 = new Effect_Color({
		outputs: [
			{
				name: "color1",
				targets: [
					"player1.rings"
				]
			}
		]

	});

	effectColorRing2 = new Effect_Color({
		outputs: [
			{
				name: "color2",
				targets: [
					"player2.rings"
				]
			}
		]

	});


	var self = this;
	global.pixelNode.on('ready', function() {
		self.initObserver();

		self.read_interval = setInterval(function() {
			self.reader();
		}, 25);


	});

	var effectManager = global.pixelNode.effectManager;
	effectManager.on('drawEffect_after', function() {
		self.overrideEffect(effectManager);
	});


}


/* Methods
 * ==================================================================================================================== */

PixelNode_Input_TouchRGB.prototype.reader = function() {
	var c;
	var self = this;
	if (global.pixelNode_data.inputs.button1 == true || global.pixelNode_data.inputs.button2 == true) {
		var newTouches = global.pixelNode_data.inputs.touches;
		//console.log(newTouches);

		// avg hue
		var colors = [];
		var colors_percents = [];
		for (var i = 0; i < newTouches.length; i++) {
			if (newTouches[i]) {
				tc = new HSVColour((i-1)*30, 100, 100).getRGB();
				colors.push(new ColorMix.Color(tc.r, tc.g, tc.b));
			}
		}
		//console.log(colors);
		if (colors.length > 0) {
			var p_sum = 0;
			for (var i = 0; i < colors.length; i++) {
				colors_percents.push(Math.floor(100/colors.length));
				p_sum += Math.floor(100/colors.length);
			}
			if (p_sum != 100) {
				colors_percents[0] += 100-p_sum;
			}

			mc = ColorMix.mix(colors, colors_percents);
			c = [mc.red, mc.green, mc.blue];
		} else {
			c = [0,0,0];
		}

		lastTouches = global.pixelNode_data.inputs.touches;
	}


	if (global.pixelNode_data.inputs.button1 == true) {
		global.pixelNode_data.inputs.rgb1 = _.clone(c);
		lastColor1 = c;
	} else {
		global.pixelNode_data.inputs.rgb1 = lastColor1;
	}

	if (global.pixelNode_data.inputs.button2 == true) {
		global.pixelNode_data.inputs.rgb2 = _.clone(c);
		lastColor2 = c;
	} else {
		global.pixelNode_data.inputs.rgb2 = lastColor2;
	}

	//console.log(global.pixelNode_data.inputs.rgb1);
	//console.log(global.pixelNode_data.inputs.rgb2);





	var intensity;
	if (global.pixelNode_data.inputs.button3 == true) {
		var newTouches = global.pixelNode_data.inputs.touches;
		var touched = undefined;

		for (var i = 0; i < newTouches.length; i++) {			
			if (newTouches[i] && !lastTouches[i]) {
				touched = i;				
				break;
			}
		}
		if (touched !== undefined || touched === 0) {
			intensity = 1 / (newTouches.length-1) * (touched);


			global.pixelNode_data.inputs.intensity = _.clone(intensity);
			lastIntensity = intensity;

			lastTouches = global.pixelNode_data.inputs.touches;
		} else {
			global.pixelNode_data.inputs.intensity = lastIntensity;
		}
	} else {
		global.pixelNode_data.inputs.intensity = lastIntensity;
	}

}

PixelNode_Input_TouchRGB.prototype.overrideEffect = function(effectManager) {
	var self = this;
	if (global.pixelNode_data.inputs.button3 == true) {
		effectManager.getEffectByName("IntensityRing").draw();
		didOverrideIntensity = true;
	}
	else if (didOverrideIntensity) { 
		effectManager.pixelDataOff();
		didOverrideIntensity = false;
	}

	if (global.pixelNode_data.inputs.button1 == true || global.pixelNode_data.inputs.button2 == true) {
		effectManager.getEffectByName("ColorRing").draw();
		if (self.colorSelect1) effectColorRing1.draw();
		if (self.colorSelect2) effectColorRing2.draw();
		didOverrideColor = true;
	}
	else if (didOverrideColor) { 
		effectManager.pixelDataOff();
		didOverrideColor = false;
	}
}

PixelNode_Input_TouchRGB.prototype.initObserver = function() {
	var self = this;
	Object.observe(global.pixelNode_data, function(changes) { self.obseve(changes )});
	self.colorSelect1 = global.pixelNode_data.inputs.button1;
	self.colorSelect2 = global.pixelNode_data.inputs.button2;

	self.intensitySelect = global.pixelNode_data.inputs.button3;

}

PixelNode_Input_TouchRGB.prototype.observe = function(changes) {
	if (global.pixelNode_data.inputs.button1 == true || global.pixelNode_data.inputs.button2 == true) {
		//global.pixelNode_data.overrideEffect = "ColorRing";
		if (!self.colorSelect) {
			lastTouches = global.pixelNode_data.inputs.touches;
			self.colorSelect = true;
		}

	} else {
		self.colorSelect = false;
		//global.pixelNode_data.overrideEffect = null;
	}
	self.colorSelect1 = global.pixelNode_data.inputs.button1;
	self.colorSelect2 = global.pixelNode_data.inputs.button2;

	self.intensitySelect = global.pixelNode_data.inputs.button3;
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

/* ColorMix.js 
http://color-mix.it
*/
var ColorMix;ColorMix=function(){"use strict";var e,r,o;return o=[{reference:0,color:{red:0,green:0,blue:0}},{reference:100,color:{red:255,green:255,blue:255}}],e=function(e,r,o){return this.red=0,this.green=0,this.blue=0,void 0!==e&&(void 0!==r&&void 0!==o?(this.setRed(parseInt(e)),this.setGreen(parseInt(r)),this.setBlue(parseInt(o))):"string"==typeof e&&this.fromHex(e)),this},r=function(){return{RGB:function(e,r,o){if(void 0===e||void 0===r||void 0===o)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGB()"';return{red:isNaN(parseInt(e))?0:parseInt(e),green:isNaN(parseInt(r))?0:parseInt(r),blue:isNaN(parseInt(o))?0:parseInt(o)}},XYZ:function(e,r,o){if(void 0===e||void 0===r||void 0===o)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZ()"';return{x:isNaN(parseFloat(e))?0:parseFloat(e),y:isNaN(parseFloat(r))?0:parseFloat(r),z:isNaN(parseFloat(o))?0:parseFloat(o)}},HSL:function(e,r,o){if(void 0===e||void 0===r||void 0===o)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.HSL()"';return{hue:isNaN(parseInt(e))?0:parseInt(e),sat:isNaN(parseInt(r))?0:parseInt(r),lig:isNaN(parseInt(o))?0:parseInt(o)}},Lab:function(e,r,o){if(void 0===e||void 0===r||void 0===o)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.Lab()"';return{L:isNaN(parseFloat(e))?0:parseFloat(e),a:isNaN(parseFloat(r))?0:parseFloat(r),b:isNaN(parseFloat(o))?0:parseFloat(o)}},RGBtoXYZ:function(e,r,o){var t,i,n,a;if(void 0!==e&&void 0!==r&&void 0!==o)t=new this.RGB(e,r,o);else{if(void 0===e||"object"!=typeof e||void 0===e.red||void 0===e.green||void 0===e.blue)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".';t=new this.RGB(e.red,e.green,e.blue)}return a=parseFloat(t.red/255),n=parseFloat(t.green/255),i=parseFloat(t.blue/255),a=100*(a>.04045?Math.pow((a+.055)/1.055,2.4):a/=12.92),n=100*(n>.04045?Math.pow((n+.055)/1.055,2.4):n/=12.92),i=100*(i>.04045?Math.pow((i+.055)/1.055,2.4):i/=12.92),new this.XYZ(.4124*a+.3576*n+.1805*i,.2126*a+.7152*n+.0722*i,.0193*a+.1192*n+.9505*i)},XYZtoRGB:function(e,r,o){var t,i,n,a,s,l,d;if(void 0!==e&&void 0!==r&&void 0!==o)t=new this.XYZ(e,r,o);else{if(void 0===e||"object"!=typeof e||void 0===e.x||void 0===e.y||void 0===e.z)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoRGB()".';t=new this.XYZ(e.x,e.y,e.z)}return s=t.x/100,l=t.y/100,d=t.z/100,a=3.2406*s+-1.5372*l+d*-.4986,n=s*-.9689+1.8758*l+.0415*d,i=.0557*s+l*-.204+1.057*d,a=255*(a>.0031308?1.055*Math.pow(a,1/2.4)-.055:a*=12.92),n=255*(n>.0031308?1.055*Math.pow(n,1/2.4)-.055:n*=12.92),i=255*(i>.0031308?1.055*Math.pow(i,1/2.4)-.055:i*=12.92),new this.RGB(Math.round(a),Math.round(n),Math.round(i))},RGBtoHSL:function(e,r,o){var t,i,n,a,s,l,d,h,c,u,p;if(void 0!==e&&void 0!==r&&void 0!==o)n=new this.RGB(e,r,o);else{if(void 0===e||"object"!=typeof e||void 0===e.red||void 0===e.green||void 0===e.blue)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".';n=new this.RGB(e.red,e.green,e.blue)}if(u=n.red/255,d=n.green/255,s=n.blue/255,h=Math.max(u,d,s),c=Math.min(u,d,s),i=(h+c)/2,h===c)t=a=0;else{switch(l=h-c,a=i>.5?l/(2-h-c):l/(h+c),h){case"red":t=(d-s)/l+(null!=(p=s>d)?p:{6:0});break;case"green":t=(s-u)/l+2;break;case"blue":t=(u-d)/l+4}t/=6}return new this.HSL(Math.floor(360*t),Math.floor(100*a),Math.floor(100*i))},XYZtoLab:function(e,r,o){var t,i,n,a;if(void 0!==e&&void 0!==r&&void 0!==o)t=new this.XYZ(e,r,o);else{if(void 0===e||"object"!=typeof e||void 0===e.x||void 0===e.y||void 0===e.z)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoLab()".';t=new this.XYZ(e.x,e.y,e.z)}return i=t.x/95.047,n=t.y/100,a=t.z/108.883,i=i>.008856?Math.pow(i,1/3):7.787*i+16/116,n=n>.008856?Math.pow(n,1/3):7.787*n+16/116,a=a>.008856?Math.pow(a,1/3):7.787*a+16/116,new this.Lab(116*n-16,500*(i-n),200*(n-a))},LabtoXYZ:function(e,r,o){var t,i,n,a;if(void 0!==e&&void 0!==r&&void 0!==o)t=new this.Lab(e,r,o);else{if(void 0===e||"object"!=typeof e||void 0===e.L||void 0===e.a||void 0===e.b)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoXYZ()".';t=new this.Lab(e.L,e.a,e.b)}return n=(t.L+16)/116,i=t.a/500+n,a=n-t.b/200,n=Math.pow(n,3)>.008856?Math.pow(n,3):(n-16/116)/7.787,i=Math.pow(i,3)>.008856?Math.pow(i,3):(i-16/116)/7.787,a=Math.pow(a,3)>.008856?Math.pow(a,3):(a-16/116)/7.787,new this.XYZ(95.047*i,100*n,108.883*a)},RGBtoLab:function(e,r,o){if(void 0===e||void 0===r||void 0===o)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoLab()"';return this.XYZtoLab(this.RGBtoXYZ(e,r,o))},LabtoRGB:function(e,r,o){if(void 0===e||void 0===r||void 0===o)throw'Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoRGB()"';return this.XYZtoRGB(this.LabtoXYZ(e,r,o))}}}(),e.prototype={fromHex:function(e){var r,o,t;return e=String(e)||"",e.length>0?("#"===e[0]&&(e=e.slice(1)),3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=parseInt(e.slice(0,2),16),o=parseInt(e.slice(2,4),16),r=parseInt(e.slice(4,6),16),this.setRed(isNaN(t)?0:t),this.setGreen(isNaN(o)?0:o),this.setBlue(isNaN(r)?0:r)):(this.setRed(0),this.setGreen(0),this.setBlue(0)),this},setRed:function(e){return void 0!==e&&(this.red=Math.min(255,Math.max(0,parseInt(e)))),this},getRed:function(){return this.red},setGreen:function(e){return void 0!==e&&(this.green=Math.min(255,Math.max(0,parseInt(e)))),this},getGreen:function(){return this.green},setBlue:function(e){return void 0!==e&&(this.blue=Math.min(255,Math.max(0,parseInt(e)))),this},getBlue:function(){return this.blue},toString:function(e){var r;switch(e){case"rgb":return"rgb("+this.red+", "+this.green+", "+this.blue+")";case"rgba":return"rgba("+this.red+", "+this.green+", "+this.blue+", 1)";case"hsl":return r=ColorMix.ColorSpace.RGBtoHSL(this.red,this.green,this.blue),"hsl("+r.hue+", "+r.sat+"%, "+r.lig+"%)";case"hsla":return r=ColorMix.ColorSpace.RGBtoHSL(this.red,this.green,this.blue),"hsla("+r.hue+", "+r.sat+"%, "+r.lig+"%, 1)";default:return"#"+((1<<24)+(this.red<<16)+(this.green<<8)+this.blue).toString(16).slice(1)}},useAsBackground:function(e){var r,o,t;if("object"==typeof e&&null!==e)e.css&&e.css("background-color","rgb("+this.red+", "+this.green+", "+this.blue+")");else if(e=String(e),e.length>0)if(void 0!==window.jQuery)window.jQuery(e).css("background-color","rgb("+this.red+", "+this.green+", "+this.blue+")");else{if("string"==typeof e)switch(e[0]){case"#":o=document.getElementById(e);break;case".":if(document.getElementsByClassName)o=document.getElementsByClassName(e);else for(o=[],r=document.getElementsByTagName("*"),t=r.length;t--;)r[t].className===e.slice(1)&&o.push(r[t])();break;default:o=document.getElementsByTagName(e)}for(t=o.length;t--;)(o[t].style["background-color"]="rgb("+this.red+", "+this.green+", "+this.blue+")")()}return this},useAsColor:function(e){var r,o,t;if("object"==typeof e&&null!==e)e.css&&e.css("color","rgb("+this.red+", "+this.green+", "+this.blue+")");else if(e=String(e),e.length>0)if(void 0!==window.jQuery)window.jQuery(e).css("color","rgb("+this.red+", "+this.green+", "+this.blue+")");else{if("string"==typeof e)switch(e[0]){case"#":o=document.getElementById(e);break;case".":if(document.getElementsByClassName)o=document.getElementsByClassName(e);else for(o=[],r=document.getElementsByTagName("*"),t=r.length;t--;)r[t].className===e.slice(1)&&o.push(r[t])();break;default:o=document.getElementsByTagName(e)}for(t=o.length;t--;)(o[t].style.color="rgb("+this.red+", "+this.green+", "+this.blue+")")()}return this}},{Color:e,ColorSpace:r,mix:function(e,r){var o,t,i,n,a,s,l;if(void 0===e||"[object Array]"!==Object.prototype.toString.call(e))throw'"ColorMix.mix()" first parameter should be an array of ColorMix.Color objects';if(void 0===r)for(r=[],l=e.length;l--;)r[l]=100/e.length;else if("[object Array]"!==Object.prototype.toString.call(r))throw'"ColorMix.mix()" second parameter should be an array of percents. (nnumber values)';if(e.length!==r.length)throw'"ColorMix.mix()" parameters should be arrays of the same size !';for(l=e.length,o=0,a=0,s=0,i=0;l--;){if(!(e[l]instanceof ColorMix.Color))throw'"ColorMix.mix()" color at index: '+l+" should be an instance of ColorMix.Color() object !";if(i+=r[l],i>100)throw'Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.';t=ColorMix.ColorSpace.RGBtoLab(e[l].getRed(),e[l].getGreen(),e[l].getBlue()),o+=t.L*r[l]/100,a+=t.a*r[l]/100,s+=t.b*r[l]/100}if(100!==i)throw'Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.';return n=ColorMix.ColorSpace.LabtoRGB(o,a,s),new ColorMix.Color(n.red,n.green,n.blue)},setGradient:function(e){return void 0!==e&&"[object Array]"===Object.prototype.toString.call(e)&&(o=e),this},getGradient:function(){return o},blend:function(e){var r,t,i,n,a,s;if(void 0===e)throw'Missing "ColorMix.blend()" first parameter.';if(e=parseInt(e),isNaN(e))throw'Invalid "ColorMix.blend()" first parameter: you should provide a number.';if(i=o.length,a=o[0],n=o[i-1],e<=a.reference)return new ColorMix.Color(a.color.red,a.color.green,a.color.blue);if(e>=n.reference)return new ColorMix.Color(n.color.red,n.color.green,n.color.blue);for(;i--;)s=o[i],s.reference<=e&&s.reference>a.reference?a=s:s.reference>=e&&s.reference<n.reference&&(n=s);return r=new ColorMix.Color(a.color.red,a.color.green,a.color.blue),t=new ColorMix.Color(n.color.red,n.color.green,n.color.blue),a.percent=Math.abs(100/((a.reference-n.reference)/(e-n.reference))),n.percent=100-a.percent,new ColorMix.mix([r,t],[a.percent,n.percent])}}}();

