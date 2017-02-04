app.factory('dataFactory', ['$http', function($http) {

    // This is our API route on our server
    var urlBase = '/api/restaurants';

    // object to hold all factory methods
    var dataFactory = {};

    dataFactory.data = {
      event: {
        firstName: null,
        lastName: null,
        address: null,
        time: null,
      },
      restaurants: null,
      options: []
    };

    // POST call to server API
    dataFactory.getRestaurantsByAddress = function (postData) {
        return $http.post(urlBase, postData);
    };

    // POST to server with users 3 choices and user name
    dataFactory.stageToFriends = function () {
        return $http.post(urlBase + '/stageToFriends', dataFactory.data.options);
    };

    return dataFactory;
}]);