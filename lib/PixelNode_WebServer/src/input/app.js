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