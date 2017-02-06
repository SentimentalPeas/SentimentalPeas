app.factory('dataFactory', ['$http', function($http) {

    
    // This is our API route on our server
    var urlBase = '/api';

    // object to hold all factory methods
    var dataFactory = {};

    dataFactory.data = {
      event: {
        fullName: null,
        address: null,
        time: null,
        timer: 'test'
      },
      restaurants: null,
      options: [],
      contacts: [
          ['Bill', '+14356401931'],
          ['Abiy', '+12404391140'],
          ['Jawad', '+15102690993'],
          ['Max', '+19084157888'], 
        ],
    };

    // POST call to server API
    dataFactory.getRestaurantsByAddress = function (postData) {
        return $http.post(urlBase + '/restaurants', postData);
    };

    // GET call to server API, not currently used but left as example
    dataFactory.getVoting = function () {
        return $http.get(urlBase + '/voting');
    };

    // POST to server with users 3 choices and user name
    dataFactory.stageToFriends = function () {
        return $http.post(urlBase + '/stageToFriends', dataFactory.data);
    };

    // GET call to server with the three choices
    dataFactory.friendGetsThreeChoices = function () {
        return $http.get(urlBase + '/getTreeChoices', dataFactory.data);
    };
    
    return dataFactory;
}]);