app.controller('SplashController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  $scope.submitSplash = function() {

    $location.path('/event');

  };




}]);