/**
 * PixelNode_WebServer 
 * 
 * Supplies web-interface for effectswitcher
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Inclues
 * ==================================================================================================================== */

var extend = require('util')._extend;
var express = require('express'),
	http = require('http'),
	path = require('path');


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_WebServer(options) {
	this.options = extend(this.default_options, options);

	if (this.options.start) {
		this.start();
	}
}

// module export
module.exports = PixelNode_WebServer;


/* Variables
 * ==================================================================================================================== */

PixelNode_WebServer.prototype.default_options = {
	port: 3001,
	start: true,
	title: "Pixel Node"
}
PixelNode_WebServer.prototype.options = {}
PixelNode_WebServer.prototype.app = null;
PixelNode_WebServer.prototype.server = null;


/* Methods
 * ==================================================================================================================== */

PixelNode_WebServer.prototype.start = function() {
  console.log('Init WebServer'.grey);
  app =  express();
  this.app = app;

  // pass options
  app.locals.options = this.options;
  app.locals.basedir = path.join(__dirname, 'src');

  // Settings
  app.set('port', process.env.PORT || this.options.port);
  app.set('views', __dirname + '/src');
  app.set('view engine', 'jade');

  // Static files
  app.use(express.static(__dirname + '/public'));
  app.use('/libs', express.static(__dirname + '/libs'));

  global.pixelNode.effectManager.effects.forEach(function(effect) {
    console.log('effects/'+effect.name, effect.public_dir);
    app.use('/effects/'+effect.name, express.static(effect.public_dir));
  });

  // Routes
  app.get('/', this.input);
  app.get('/simulator', this.simulator);

  // redirect all others to the index (HTML5 history)
  //app.get('*', this.input);

  // start server
  this.server = http.createServer(app).listen(app.get('port'), function () {
  	console.log(('WebServer listening on port ' + app.get('port')).green);
  });

  // start socket.io for websockets
  io = require('socket.io').listen(this.server)
  global.webSockets = io.sockets;
};

/* Views
 * ==================================================================================================================== */

PixelNode_WebServer.prototype.input = function(req, res){
  res.render('input/view', {options: req.app.locals.options, config: global.config});
};

PixelNode_WebServer.prototype.simulator = function(req, res){
  res.render('simulator/view', {options: req.app.locals.options, config: global.config});
};

