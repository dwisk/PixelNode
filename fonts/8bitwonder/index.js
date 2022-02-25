"use strict"
/**
 * PixelNode_Font_8bitwonder
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

const PixelNode_Font = require('../PixelNode_Font');


/* Class Constructor
 * ==================================================================================================================== */

class PixelNode_Font_8bitwonder extends PixelNode_Font {

  constructor(callback) {
    super(callback, {
      name: "8bitwonder",
      image: __dirname + "/letters.png",
      mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    });
  }
}

// module export
module.exports = PixelNode_Font_8bitwonder;
