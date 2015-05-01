app.controller('SimulatorCtrl', function ($scope, $http, socket) {

  $scope.effect = {};
  $scope.autoplay = true;
  $scope.force_off = false;

  var pixels = [[1,255,0,255]];

  socket.on('connect', function() {
    console.log('check socket', socket);
    
  });

  socket.on('input_init', function (data) {
    console.log("input init", data);
    socket.emit('input_inited', {success:true});
    $scope.parseData(data.data);

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

  });

  socket.on('input_status', function (data) {
    $scope.parseData(data);
    console.log("input_status");
  });

  $scope.parseData = function(data) {
    $scope.effect = data.effect;    
    $scope.autoplay = data.effects.autoplay;
    $scope.force_off = data.effects.force_off;
  }



});