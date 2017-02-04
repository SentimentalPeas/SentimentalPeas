app.controller('EventController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {

  $scope.submit = function() {

    dataFactory.data.event.fullName = $scope.fullName;
    dataFactory.data.event.address = $scope.address;
    dataFactory.data.event.time = $scope.time;


    getRestaurantsByAddress(function(err, res) {
      if (err) {
        console.log('ERROR on getRestaurants call');
      } else {
        console.log('SUCCESS on getRestaurants call');
        //$location.path('/contacts');
      }
    });
  };



  $scope.data = dataFactory.data;

  var dataArr = [];
  function getRestaurantsByAddress() {
    var clientData = {
      fullName: $scope.fullName,
      address: $scope.address,
      time: $scope.time
    };
    dataFactory.getRestaurantsByAddress(clientData)
      .then(function (response) {
        
        var restaurants = response.data.businesses;

        // Set to our Factory Data
        dataFactory.data.restaurants = response.data.businesses;

        // Tack on two more options to the data
        for (var i = 0; i < dataFactory.data.restaurants.length; i++) {
          dataFactory.data.restaurants[i].custChoice = false;
          dataFactory.data.restaurants[i].votes = 0;
        }


        // $scope.statmentOne = 'Please Check Mark Resturants To Send To Your Friends';
        // $scope.statmentTwo = 'These are top 10 nearest to the address you entered';

        $scope.restaurants = restaurants;

        console.log('SUCCESS on getRestaurants call');
        $location.path('/contacts');

      }, function (error) {
          $scope.response = 'Unable to load customer data: ' + error.message;
      });
  }




}]);