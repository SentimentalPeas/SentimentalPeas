app.controller('ConfirmedController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  // Encode full address for use with Google Static Maps
  $scope.mapAddress = encodeURIComponent(dataFactory.data.winner.location.address[0] + ',' + dataFactory.data.winner.location.city + ',' + dataFactory.data.winner.location.state_code);

  $scope.submitConfirmed = function() {

  };




}]);