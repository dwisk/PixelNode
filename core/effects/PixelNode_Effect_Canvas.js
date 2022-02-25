/**
 * PixelNode_Effect_Canvas
 *
   {
     type: "fill",
     color: [255, 0, 100, 0.5]
   },
   {
     type: "line",
     from: [0, 0],
     to: [0, 0],
     color: [255, 255, 255, 0.4]
   },
   {
     type: "rectangle",
     position: [5, 5],
     width: 40,
     height: 10,
     color: [255, 255, 255, 0.6]
   },
   {
     type: "oval",
     position: [0, 0],
     width: 100,
     height: 100,
     color: [255, 255, 255, 1]
   },
   {
     type: "circle",
     position: [25, 25],
     radius: 10,
     color: [255, 255, 255, 0.6]
   },
   {
     type: "map",
     position: [33, 5],
     map: [
       [1, 0, 0, 1],
       [0, 1, 1, 0],
       [0, 1, 1, 0],
       [1, 0, 0, 1]
     ],
     color: [255, 255, 255, 0.6]
   },
   {
     type: "text",
     font: "8bitwonder",
     text: "DWISK",
     position: [3, 10],
     color: [255, 255, 255, 1]
   }
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

const PixelNode_Canvas = require('../lib/PixelNode_Canvas.js');
const PixelNode_Effect = require('./PixelNode_Effect.js');


/* Class Defintion
 * ==================================================================================================================== */

class PixelNode_Effect_Canvas extends PixelNode_Effect {

  /* Class Constructor
  * ==================================================================================================================== */

  constructor(options,pixelData) {
    super(options, pixelData);

    this.canvas;
    this.variables = {};
    this.pos = 4;
    this.dir = 1;
  }

  /* Variables
  * ==================================================================================================================== */


  /* Overridden Methods
  * ==================================================================================================================== */

  // init effect – override
  init() {
    console.log("Init Effect Canvas".grey);
  }

  // draw effect on target
  drawTarget(target, output) {
    var self = this;
    const canvas = new PixelNode_Canvas(target);

    if (typeof self.options.preDraw == "function") {
      self.options.preDraw.bind(self)(target, output);
    }


    for (var i = 0; i < this.options.draw.length; i++) {
      var element = this.options.draw[i];
      switch (element.type) {
        case "fill":
          canvas.fill(element.color);
          break;

        case "line":
          canvas.line(element.from[0], element.from[1], element.to[0], element.to[1], element.color);
          break;

        case "rectangle":
          canvas.rectangle(element.position[0], element.position[1], element.width, element.height, self.getValue(element.color));
          break;

        case "oval":
          canvas.oval(element.position[0], element.position[1], element.width, element.height, element.color);
          break;

        case "circle":
          canvas.circle(element.position[0], element.position[1], element.radius, element.color);
          break;

        case "map":
          canvas.drawMap(element.map, element.position[0], element.position[1], element.color);
          break;

        case "text":

          // get font
          var font = global.pixelNode.fontManager.getFont(element.font);
          // draw whin initialized
          if (font && font.initialized) {
            var map = font.mapWord(self.getValue(element.text));
            var alignOffset = 0;
            switch(self.getValue(element.align)) {
              case "right":
                alignOffset = map.length-1;
                break;
              case "center":
                alignOffset = Math.floor((map.length-1)/2);
                break;

            }
            canvas.drawMap(map, self.getValue(element.position)[0] - alignOffset, self.getValue(element.position)[1], self.getValue(element.color));
          }
          break;
      }
    }

    if (typeof self.options.afterDraw == "function") {
      self.options.afterDraw.bind(self)(target, output);
    }

  }

  reset () {
    this.variables = [];
  }

  getValue(property) {
    if (typeof property == "function") {
      return property.bind(this)();
    } else {
      return property;
    }
  }

  bounce(name, conf) {
    if (this.variables[name] == undefined) this.variables[name] =  {};
    var bounceConf = Object.assign({
      min: 0,
      max: 100,
      speed: 1,
      initialValue: 50,
      initialDirection: 1,
      round: true
    }, this.variables[name], conf);
    if (bounceConf.value == undefined) bounceConf.value = bounceConf.initialValue;
    if (bounceConf.direction == undefined) bounceConf.direction = bounceConf.initialDirection;

    if (bounceConf.value >= bounceConf.max) {
      bounceConf.direction = -1;
    } else if (bounceConf.value <= bounceConf.min) {
      bounceConf.direction = 1;
    }
    bounceConf.value += bounceConf.direction * bounceConf.speed;
    this.variables[name] = bounceConf;
    return bounceConf.round ? Math.round(bounceConf.value) : bounceConf.value;
  }

}

/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_Canvas;
