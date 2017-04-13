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