app.controller('RestaurantsController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  $scope.submitRestaurants = function() {

    dataFactory.data.restaurants.map(function(restaurant){
     if (restaurant.custChoice) {
       dataFactory.data.options.push(restaurant);
     }
    });
    
    dataFactory.stageToFriends()


    $location.path('/voting');

  };




}]);