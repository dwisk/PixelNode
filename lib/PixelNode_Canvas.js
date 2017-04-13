/**
 * PixelNode_Canvas
 *
 * Pixel Drawing Helpers
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

function PixelNode_Canvas(canvas, options) {
	this.options = _.extend({}, this.default_options, options);
	this.name = this.options.name;
	this.init(canvas);
}

// module export
module.exports = PixelNode_Canvas;


/* Variables
 * ==================================================================================================================== */

PixelNode_Canvas.prototype.default_options = {}
PixelNode_Canvas.prototype.options = {}
PixelNode_Canvas.prototype.canvas = [
  [ [0,0,0],  [0,0,0],  [0,0,0] ],
  [ [0,0,0],  [0,0,0],  [0,0,0] ],
  [ [0,0,0],  [0,0,0],  [0,0,0] ]
]
PixelNode_Canvas.prototype.canvasWidth = 3
PixelNode_Canvas.prototype.canvasHeight = 3


/* Override Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Canvas.prototype.init = function(canvas) {
  this.canvas = canvas;
  this.canvasHeight = canvas.length;
  this.canvasWidth = canvas[0].length;
}



/* Methods
 * ==================================================================================================================== */


// fill
PixelNode_Canvas.prototype.fill = function(color) {
  for (var y = 0; y < this.canvas.length; y++) {
    for (var x = 0; x < this.canvas[y].length; x++) {
      this.dot(x, y, color);
    }
  }
}

// rectangle
PixelNode_Canvas.prototype.rectangle = function(x1, y1, w, h, color) {
	if (y1 < 0) y1 = 0;
	if (x1 < 0) x1 = 0;

  var y2 = y1 + h-1;
  var x2 = x1 + w;

	// if (y2 > this.canvasHeight) y2 = this.canvasHeight-1;
	// if (x2 > this.canvasWidth) x2 = this.canvasWidth-1;

  for (var y = y1; y <= y2; y++) {
    for (var x = x1; x < x2; x++) {
      this.dot(x, y, color);
    }
  }
  //console.log(this.canvas[10]);
}


PixelNode_Canvas.prototype.dot = function (x, y, color) {
  try {
    if (color.length == 4) {
      var oldColor = this.canvas[x][y];
      var alpha = color[3]
      var r = alpha * color[0] + (1 - alpha) * oldColor[0]
      var g = alpha * color[1] + (1 - alpha) * oldColor[1]
      var b = alpha * color[2] + (1 - alpha) * oldColor[2]
      this.canvas[x][y] = [r,g,b];
    } else {
      this.canvas[x][y] = color;
    }
  } catch(e) {
    //console.log("Canvas Error".red, "Dot out of scope:", x,y);
  }
}

PixelNode_Canvas.prototype.absDot = function (x, y, color) {
  this.dot(Math.round(x), Math.round(y), color);
}

PixelNode_Canvas.prototype.circle = function (x0, y0, radius, color) {
  var x = radius;
  var y = 0;
  var radiusError = 1 - x;

  while (x >= y) {
    this.dot(x + x0, y + y0, color);
    this.dot(y + x0, x + y0, color);
    this.dot(-x + x0, y + y0, color);
    this.dot(-y + x0, x + y0, color);
    this.dot(-x + x0, -y + y0, color);
    this.dot(-y + x0, -x + y0, color);
    this.dot(x + x0, -y + y0, color);
    this.dot(y + x0, -x + y0, color);
    y++;

    if (radiusError < 0) {
        radiusError += 2 * y + 1;
    }
    else {
        x--;
        radiusError+= 2 * (y - x + 1);
    }
  }
};

PixelNode_Canvas.prototype.oval = function(x, y, w, h, color) {
   var x0 = y0 = 0;
   var x1 = x0 + w;
   var y1 = y0 + h;

   var a = Math.abs(x1-x0), b = Math.abs(y1-y0), b1 = b&1; /* values of diameter */
   var dx = 4*(1-a)*b*b, dy = 4*(b1+1)*a*a; /* error increment */
   var err = dx+dy+b1*a*a, e2; /* error of 1.step */

   if (x0 > x1) { x0 = x1; x1 += a; } /* if called with swapped points */
   if (y0 > y1) y0 = y1; /* .. exchange them */
   y0 += (b+1)/2; y1 = y0-b1;   /* starting pixel */
   a *= 8*a; b1 = 8*b*b;

   var map = PixelNode_Canvas.rect([],0,0,w, h, false);

   while (x0 <= x1){
       PixelNode_Canvas.rect(map, Math.round(x0), Math.round(y1), Math.round(x1), Math.round(y0), true);
      //  this.absDot(x1, y0, color); /*   I. Quadrant */
      //  this.absDot(x0, y0, color); /*  II. Quadrant */
      //  this.absDot(x0, y1, color); /* III. Quadrant */
      //  this.absDot(x1, y1, color); /*  IV. Quadrant */
       e2 = 2*err;
       if (e2 <= dy) { y0++; y1--; err += dy += a; }  /* y step */
       if (e2 >= dx || 2*err > dy) { x0++; x1--; err += dx += b1; } /* x step */
   }

   while (y0-y1 < b) {  /* too early stop of flat ellipses a=1 */
       map[x0-1][y0] = true;
       map[x1+1][y0++] = true;
       map[x0-1][y1] = true;
       map[x1+1][y1--] = true;
   }
   this.drawMap(map, x, y, color);
};

PixelNode_Canvas.prototype.drawMap = function(map, x0, y0, color) {
  for (var x = 0; x < map.length; x++) {
    for (var y = 0; y < map[x].length; y++) {
      if (map[x][y]) {
        this.dot(x0 + x, y0 + y, color);
      }
    }
  }
}

// rectangle
PixelNode_Canvas.rect = function(map, x1, y1, x2, y2, value) {
  for (var x = x1; x < x2; x++) {
    for (var y = y1; y <= y2; y++) {
      if (!map[x]) { map[x] = []; }
      map[x][y] = value;
    }
  }
  return map;
  //console.log(this.canvas[10]);
}

PixelNode_Canvas.prototype.line = function(x0, y0, x1, y1, color){
   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;

   while(x0!=x1 || y0!=y1) {
     this.dot(x0,y0,color);  // Do what you need to for this

     var e2 = 2*err;
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }
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
