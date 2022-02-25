/**
 * PixelNode_Effect_Heartbeat
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

const PixelNode_Effect = require('./PixelNode_Effect.js');


/* Class Defintion
 * ==================================================================================================================== */

class PixelNode_Effect_Heartbeat extends PixelNode_Effect {

    /* Class Constructor
     * ==================================================================================================================== */

    // define the Student class
    constructor(options, pixelData) {
        super(options, pixelData);

        this.colorSelect = false;
        this.hueSelect = 0;
    }


    /* Variables
     * ==================================================================================================================== */

    static default_options = {
        dimmer: 1
    }


    /* Overridden Methods
     * ==================================================================================================================== */

    // init effect – override
    init() {
        console.log("Init Effect Heartbeat".grey);
    }

    // draw effect on target
    drawTarget(target, output) {
        var self = this;

        var red = self.getRed();

        for (var ring = 0; ring < target.length; ring++) {
            for (var pixel = 0; pixel < target[ring].length; pixel++) {
                target[ring][pixel] = [red, 0, 0];
            }
        }
    }

    getRed() {
        var counter = global.pixelNode.clock.get();
        var f = 1.5;
        var t = (counter % (1000 * f)) / 1000 / f; // Zehntelsekunden
        var red = 100;
        if (t >= 0 && t < 0.2) {
            red = 100 * EasingFunctions.easeInOutCubic(t * 5);
        } else if (t >= 0.2 && t < 0.4) {
            red = 100 - 60 * EasingFunctions.easeInOutCubic(t * 5 - 1);
        } else if (t >= 0.4 && t < 0.6) {
            red = 40 + 40 * EasingFunctions.easeInOutCubic(t * 5 - 2);
        } else if (t >= 0.6 && t < 0.8) {
            red = 80 - 80 * EasingFunctions.easeInOutCubic(t * 5 - 3);
        } else {
            red = 0
        }

        return (100 + Math.round(red * 1.55)) * this.options.dimmer;
    }

}

/* Easing
 * ==================================================================================================================== */

EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) {
        return t
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
        return t * t
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
        return t * (2 - t)
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
        return t * t * t
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
        return (--t) * t * t + 1
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
        return t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
        return t * t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    }
}


/* Module exports
 * ==================================================================================================================== */

module.exports = PixelNode_Effect_Heartbeat;
