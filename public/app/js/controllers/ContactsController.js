app.controller('ContactsController', ['$scope', '$location', 'dataFactory', function($scope, $location, dataFactory) {
  
  // Carry App Data Over
  $scope.data = dataFactory.data;

  $scope.submitContacts = function() {

    $location.path('/restaurants');

  };

  $scope.addContact = function() {
    var newContact = [$scope.contactName, '+1' + $scope.contactNumber]
    dataFactory.data.contacts.push(newContact);
     //$scope.contactNew = '';
  };





}]);