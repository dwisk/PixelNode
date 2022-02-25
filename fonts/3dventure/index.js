"use strict"
/**
 * PixelNode_Font_3dventure
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

class PixelNode_Font_3dventure extends PixelNode_Font {

  constructor(callback) {
    super(callback, {
      name: "3dventure",
      image: __dirname + "/letters.png",
      mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*#.;-_=&%$/@"
    });
  }
}

// module export
module.exports = PixelNode_Font_3dventure;
