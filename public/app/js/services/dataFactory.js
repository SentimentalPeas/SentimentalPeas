app.factory('dataFactory', ['$http', function($http) {

    // This is our API route on our server
    var urlBase = '/api/restaurants';

    // URL used for testing to check if working
    var urlBaseTest = 'https://jsonplaceholder.typicode.com/posts';

    // object to hold all factory methods
    var dataFactory = {};

    // POST call to server API
    dataFactory.getRestaurantsByAddress = function (postData) {
        return $http.post(urlBase, postData);
    };

    // GET call to server API, not currently used but left as example
    dataFactory.getRestaurants = function () {
        return $http.get(urlBase);
    };

    return dataFactory;
}]);