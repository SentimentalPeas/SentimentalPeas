app.controller('FriendController', ['$scope', 'dataFactory', function($scope, dataFactory) {
	$scope.data = dataFactory.data;
  dataFactory.friendGetsThreeChoices();
}]);