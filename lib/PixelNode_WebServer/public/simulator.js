'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['btford.socket-io']).
  config([function() {

  }]);


 app.factory('socket', function (socketFactory) {
  var host = window.location.hostname;
  var port = window.location.port;
  var socket_url = host + (port ? ":" + port : "");
  var myIoSocket = io.connect('http://' + socket_url, {
    reconnection: true
  });

  var mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  //append reference to socket.socket
  mySocket.socket = myIoSocket.socket;

  return mySocket;
 });

 document.ontouchmove = function(event){
     event.preventDefault();
 }
app.controller('SimulatorCtrl', function ($scope, $http, socket) {

  $scope.mapping = ["test","test2"];
  var pixels = [[1,255,0,255]];

  socket.on('connect', function() {
    console.log('check socket', socket);
    
  });

  socket.on('simulator_init', function (data) {
    console.log("simulator init", data);
    $scope.mapping = data.mapping;
    socket.emit('simulator_inited', {success:true});
  });

  socket.on('simulator_pixels', function (data) {
    pixels = data;
  });

  $scope.getColor = function(px, ring) {
    if (pixels[px[0]]) {
      var colorPixel;
      if (ring % 2 == 0) {
        colorPixel = pixels[px[0]][120-px[1]];
      } else {
        colorPixel = pixels[px[0]][px[1]];
      }

      if (colorPixel && colorPixel[0] != null) {
        return "rgb("+colorPixel[0]+","+colorPixel[1]+","+colorPixel[2]+")";
      } else {
        return "rgb(0,0,0)";
      }
    } else {
      return "rgb(255,0,0)";      
    }
  }


  $scope.parseData = function(data) {
    $scope.effect = data.effect;    
    $scope.autoplay = data.effects.autoplay;
    $scope.force_off = data.effects.force_off;
    $scope.queueId = data.effects.queueId;
  }




});
app.controller('SimulatorCtrl2', function ($scope, $http, socket) {

  $scope.effect = {};
  $scope.autoplay = true;
  $scope.force_off = false;

  $scope.config = {};

  $scope.inputs = {
    button1: false,
    button2: false,
    button3: false,

    touches: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]

  }

  var pixels = [[1,255,0,255]];

  socket.on('connect', function() {
    console.log('check socket', socket);
    
  });

  socket.on('input_init', function (data) {
    console.log("input init", data);
    socket.emit('input_inited', {success:true});
    $scope.parseData(data.data);
    $scope.config = data.config;

    $scope.$watch(function() { return $scope.autoplay}, function(newValue, oldValue) {
      console.log("input_change: ",newValue, oldValue);
      if (newValue !== oldValue) {
        socket.emit('input_change', {target:"effects.autoplay", value: newValue});
        }
    });

    $scope.$watch(function() { return $scope.force_off}, function(newValue, oldValue) {
      console.log("input_change: ",newValue, oldValue);
      if (newValue !== oldValue) {
        socket.emit('input_change', {target:"effects.force_off", value: newValue});
        }
    });

    $scope.$watch("inputs", function(newValue, oldValue) {
      console.log("input_change: ",newValue, oldValue);
      if (newValue !== oldValue) {
        socket.emit('input_change', {target:"inputs", value: newValue});
        }
    }, true);

  });

  socket.on('input_status', function (data) {
    $scope.parseData(data);
    console.log("input_status");
  });

  $scope.parseData = function(data) {
    $scope.effect = data.effect;    
    $scope.autoplay = data.effects.autoplay;
    $scope.force_off = data.effects.force_off;
    $scope.queueId = data.effects.queueId;
  }



});