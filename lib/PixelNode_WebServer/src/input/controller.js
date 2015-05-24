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

  socket.on('input_init', function (data) {
    console.log("input init", data);
    socket.emit('input_inited', {success:true});
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

  socket.on('input_status', function (data) {
    $scope.parseData(data);
    console.log("input_status");
  });

  $scope.parseData = function(data) {
    $scope.game = data.game;    
    $scope.force_off = data.games.force_off;
    $scope.listId = data.games.listId;
  }



});