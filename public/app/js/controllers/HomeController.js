app.controller('HomeController', ['$scope', 'dataFactory', function($scope, dataFactory) {

  $scope.submit = function() {
    getRestaurantsByAddress();
  };
  $scope.getRequest = function() {
    getRestaurants();
  };

  // Make POST request to Server API
  // function getRestaurantsByAddress() {
  //   var postData = {
  //     firstName: $scope.firstName,
  //     lastName: $scope.lastName,
  //     address: $scope.address,
  //     time: $scope.time
  //   };
  //   dataFactory.getRestaurantsByAddress(postData)
  //     .then(function (response) {
  //       $scope.response = response.data;
  //     }, function (error) {
  //         $scope.response = 'Unable to load customer data: ' + error.message;
  //     });
  // }


  // var clientDataNew = {};
  // var userName = clientDataNew.firstName + ' ' + clientDataNew.lastName;
  var dataArr = [];
  function getRestaurantsByAddress() {
    var clientData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      address: $scope.address,
      time: $scope.time
    };
    clientDataNew = clientData;
    dataFactory.getRestaurantsByAddress(clientData)
      .then(function (response) {
        
        // var dataArr = [];
        var restaurants= response.data.businesses;
        restaurants.map(function(restaurant){
          //console.log(item.name);
          dataArr.push({name:restaurant.name, rating:restaurant.rating, pic:restaurant.image_url, catogory:restaurant.categories, custChoice:false});
        });
        //console.log(dataArr);
        $scope.statmentOne = 'Please Check Mark Resturants To Send To Your Friends';
        $scope.statmentTwo = 'These are top 10 nearest to the address you entered';
        $scope.response = dataArr;
        //$scope.response = response.data;
      }, function (error) {
          $scope.response = 'Unable to load customer data: ' + error.message;
      });
  }


  $scope.phoneNums = ['+5102560992', '+4153131243'];

  $scope.addPhoneNum = function() {
      $scope.phoneNums.push('+' + $scope.phoneNumber.toString());
      $scope.phoneNumber = '';
    };

  var stageArr = [];
  var stageObj = {};
  $scope.stageToFriends = function () {
    stageArr = [];
    stageObj = {};
    dataArr.map(function(item){
      if (item.custChoice) {
        //item.custChoice = false;
        stageArr.push(item);
      }
    });
    stageObj = {threeChoices: stageArr, phoneNumbers: $scope.phoneNums}
    dataFactory.stageToFriends(stageObj)
    console.log(stageObj);
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