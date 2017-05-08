var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Define AngularJS application
var banApp = angular.module('banPage', []);

banApp.constant('__env', env);

banApp.controller('banUserCtrl', ['$scope', '$location', '$window', '$http', '__env', function ($scope, $location, $window, $http, __env) {
	$scope.banUserModel = {};

	/* Sends the user to be banned */
	$scope.submitBanUserForm = function(valid) {
		if (valid) {
			console.log("submitted!");
			console.log($scope.banUserModel);
			$http({
				method: 'POST',
				url: __env.banUserURL,
				contentType: 'application/json',
				data: $scope.banUserModel
			}).catch(function(err){
				console.log(err);
			})
		} else {
			console.log("Invalid Form!");
		}
	}
}]);


banApp.controller('banProjCtrl', ['$scope', '$location', '$window', '$http', '__env', function ($scope, $location, $window, $http, __env) {
	$scope.banUserModel = {};

	/* Sends the project to be banned */
	$scope.submitBanProjForm = function(valid) {
		if (valid) {
			console.log("submitted!");
			console.log($scope.banProjModel);
			$http({
				method: 'POST',
				url: __env.banProjectURL,
				contentType: 'application/json',
				data: $scope.banProjModel
			}).catch(function(err){
				console.log(err);
			})
		} else {
			console.log("Invalid Form!");
		}
	}
}]);