app.controller('HomeController', ['$scope', 'dataFactory', function($scope, dataFactory) {

  $scope.submit = function() {
    getRestaurantsByAddress();
  };
  $scope.getRequest = function() {
    getRestaurants();
  };

  // Make POST request to Server API
  function getRestaurantsByAddress() {
    var postData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      address: $scope.address,
      time: $scope.time
    };
    dataFactory.getRestaurantsByAddress(postData)
      .then(function (response) {
        $scope.response = response.data;
      }, function (error) {
          $scope.response = 'Unable to load customer data: ' + error.message;
      });
  }

  // This is a GET request not currently used but left for example if needed
  function getRestaurants() {
    dataFactory.getRestaurants()
      .then(function (response) {
        $scope.response = response.data;
      }, function (error) {
          $scope.response = 'Unable to load customer data: ' + error.message;
      });
  }

}]);