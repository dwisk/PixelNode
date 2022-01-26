/**
 * PixelNode_WebServer 
 * 
 * Supplies web-interface for gameswitcher
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Includes
 * ==================================================================================================================== */

const express = require('express');
const http = require('http');


/* Class
 * ==================================================================================================================== */

class PixelNode_WebServer {

  /* Class Variables
	 * ---------------------------------------------------------------------------------------------------------------- */

  default_options = {
    port: 3001,
    start: true,
    title: "Pixel Node"
  }


	/* Class Constructor
	 * ---------------------------------------------------------------------------------------------------------------- */

  constructor (options) {
    this.options = {...PixelNode_WebServer.default_options, ...options};

    if (this.options.start) {
      this.start();
    }
  }


  /* Functions
   * ---------------------------------------------------------------------------------------------------------------- */

  start() {
    console.log('Init WebServer'.grey);
    const app =  express();

    // Settings
    app.set('port', process.env.PORT || this.options.port);

    // start server
    this.server = http.createServer(app).listen(app.get('port'), function () {
      console.log(('WebServer listening on port ' + app.get('port')).green);
    });

    // start socket.io for websockets
    const io = require('socket.io').listen(this.server)
    global.webSockets = io.sockets;
  };

}

/* Module Export
 * ==================================================================================================================== */

module.exports = PixelNode_WebServer;
