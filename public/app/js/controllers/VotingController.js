app.controller('VotingController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  $scope.submitVoting = function() {

    $location.path('/confirmed');

  };



}]);