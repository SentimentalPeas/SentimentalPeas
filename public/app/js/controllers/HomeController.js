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
  var dataArr = [];
  function getRestaurantsByAddress() {
    var clientData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      address: $scope.address,
      time: $scope.time
    };
    dataFactory.getRestaurantsByAddress(clientData)
      .then(function (response) {
        
        // var dataArr = [];
        var restaurants = response.data.businesses;

        for (var i = 0; i < restaurants.length; i++) {
          restaurants[i].custChoice = false;
          restaurants[i].votes = 0;
        }

        restaurants.map(function(restaurant){
          //console.log(item.name);
          dataArr.push({name:restaurant.name, rating:restaurant.rating, pic:restaurant.image_url, catogory:restaurant.categories, custChoice:false});
        });
        //console.log(dataArr);
        $scope.statmentOne = 'Please Check Mark Resturants To Send To Your Friends';
        $scope.statmentTwo = 'These are top 10 nearest to the address you entered';
        $scope.response = dataArr;
        $scope.restaurants = restaurants;
        //$scope.response = response.data;
      }, function (error) {
          $scope.response = 'Unable to load customer data: ' + error.message;
      });
  }

  var user = [$scope.firstName, $scope.lastName]

  var stageArr = [];
  $scope.stageToFriends = function () {
    stageArr = [];
    $scope.restaurants.map(function(item){
      if (item.custChoice) {
        //item.custChoice = false;
        stageArr.push(item);
      }
    });
    console.log(stageArr);
    dataFactory.stageToFriends(stageArr)
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