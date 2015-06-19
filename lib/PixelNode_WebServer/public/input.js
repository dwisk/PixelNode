'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['btford.socket-io', 'slick']).
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

  $scope.game = {};
  $scope.autoplay = true;
  $scope.force_off = false;
  $scope.listId = 1;
  $scope.queueId = 0;

  $scope.config = {};


  var pixels = [[1,255,0,255]];

  socket.on('connect', function() {
    console.log('check socket', socket);
    
  });

  socket.on('data_init', function (data) {
    console.log("data init", data);
    socket.emit('data_client_inited', {success:true});
    $scope.parseData(data.data);
    $scope.config = data.config;

    $scope.$watch(function() { return $scope.listId}, function(newValue, oldValue) {
      console.log("list change: ",newValue, oldValue);
      if (newValue !== oldValue) {
        socket.emit('input_change', {target:"games.listId", value: newValue});
          
        }
    });

    $scope.$watch(function() { return $scope.force_off}, function(newValue, oldValue) {
      console.log("force change: ",newValue, oldValue);
      if (newValue !== oldValue) {
        socket.emit('input_change', {target:"games.force_off", value: newValue});
        }
    });

    $scope.$watch("inputs", function(newValue, oldValue) {
      console.log("input_change: ",newValue, oldValue);
      if (newValue !== oldValue) {
        socket.emit('input_change', {target:"inputs", value: newValue});
        }
    }, true);

  });

  socket.on('data_changed', function (data) {
    //$scope.parseData(data);
    if (data.path[0] == "game") {
      $scope.game = data.data;
    }
    if (data.path[0] == "games" && data.path[1] == "listId") {
      $scope.listId = data.data;
    }
    console.log("data_changed", data);
  });

  $scope.parseData = function(data) {
    $scope.game = data.game;    
    $scope.force_off = data.games.force_off;
    $scope.listId = data.games.listId;
  }



});