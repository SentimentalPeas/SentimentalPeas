app.controller('VotingController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  var refreshIntervalId = setInterval(function() {
    dataFactory.getVoting().then(function(body){
            
      console.log('RESPONSE', body.data);
      if (typeof body.data.winner != 'undefined') {
        dataFactory.data = body.data;
        console.log('We have results, redirect!...');
        clearInterval(refreshIntervalId);
        $location.path('/confirmed');
      } else {
        console.log('No success yet...');
      }
          



    });
  }, 5000);

  $scope.submitVoting = function() {

    $location.path('/confirmed');

  };



}]);