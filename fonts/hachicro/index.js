"use strict"
/**
 * PixelNode_Font_hachicro
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

class PixelNode_Font_hachicro extends PixelNode_Font {

 constructor(callback) {
   super(callback, {
     name: "hachicro",
     image: __dirname + "/letters.png",
     mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*#.;-_=&%$/@"
   });
 }
}

// module export
module.exports = PixelNode_Font_hachicro;
