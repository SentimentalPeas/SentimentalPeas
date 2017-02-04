// App.js
var app = angular.module("myApp", ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'SplashController',
    templateUrl: 'app/views/splash.html'
  })
  .when('/event', {
    controller: 'EventController',
    templateUrl: 'app/views/event.html'
  })
  .when('/contacts', {
    controller: 'ContactsController',
    templateUrl: 'app/views/contacts.html'
  })
  .when('/restaurants', {
    controller:'RestaurantsController',
    templateUrl: 'app/views/restaurants.html'
  })
  .when('/voting', {
    controller:'VotingController',
    templateUrl: 'app/views/voting.html'
  })
  .when('/confirmed', {
    controller:'ConfirmedController',
    templateUrl: 'app/views/confirmed.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});

