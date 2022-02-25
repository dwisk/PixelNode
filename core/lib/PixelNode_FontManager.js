/**
 * PixelNode_FontManager
 *
 * Base class for managing fonts
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * Example Font
 * ```
 * const PixelNode_Font = require('../../lib/PixelNode_Font');
 *
 * class PixelNode_Font_Abc extends PixelNode_Font {
 *   constructor(callback) {
 *     super(callback, {
 *       name: "04b3",
 *       image: __dirname + "/letters.png",
 *       mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*#.;-_=&%$/@"
 *     });
 *   }
 * }
 * module export module.exports = PixelNode_Font_Abc;
 * ```
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Class Defintion
 * ==================================================================================================================== */

class PixelNode_FontManager {

  /* Class Constructor
  * ==================================================================================================================== */

  constructor(options, fonts) {
    this.options = {...PixelNode_FontManager.default_options, ...options};

    this.fonts = [];

    // configured inputs
    this.loadFonts();

    // call init
    this.init();
  }

  /* Variables
  * ==================================================================================================================== */

  static default_options = {}


  /* Methods
  * ==================================================================================================================== */

  init() {
    console.log("Init PixelNode_FontManager".grey);

  };

  loadFonts() {
    var self = this;
    if (self.fonts.length < global.config.fonts.length) {
      var FontModule = global.PixelNode.getOption(global.config.fonts[self.fonts.length]);
      self.fonts.push(new FontModule(self.loadFonts.bind(self)));
    }
  }

  getFont(name) {
    for (var i = 0; i < this.fonts.length; i++) {
      if (this.fonts[i].name == name) return this.fonts[i];
    }
    console.log(("Pixelnode_FontManager:").grey,("Font '"+name+"' not found!").yellow);
    return false;
  }

}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_FontManager;
