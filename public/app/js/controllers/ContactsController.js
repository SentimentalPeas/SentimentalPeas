app.controller('ContactsController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  $scope.submitContacts = function() {

    $location.path('/restaurants');

  };

  // $scope.phoneNums = ['+5102560992', '+4153131243'];
   
  // $scope.addPhoneNum = function() {
  //  $scope.phoneNums.push('+' + $scope.phoneNumber.toString());
  //    $scope.phoneNumber = '';
  //  };

  //  var user = [$scope.firstName, $scope.lastName]

  //  var stageArr = [];
  //  $scope.stageToFriends = function () {
  //    stageArr = [];
  //    $scope.restaurants.map(function(item){
  //      if (item.custChoice) {
  //        //item.custChoice = false;
  //        stageArr.push(item);
  //      }
  //    });
  //    console.log(stageArr);
  //    dataFactory.stageToFriends(stageArr)
  //  }



}]);