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


  $scope.getColor = function(px) {
    var colorPixel = pixels[px[1]];
    if (colorPixel) {
      return "rgb("+colorPixel[0]+","+colorPixel[1]+","+colorPixel[2]+")";
    } else {
      return "rgb(0,0,0)";
    }
  }





});