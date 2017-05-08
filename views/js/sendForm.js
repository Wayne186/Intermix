var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Define AngularJS application
var loginApp = angular.module('frontPage', []);

loginApp.constant('__env', env);

loginApp.controller('signInCtrl', ['$scope', '$location', '$window', '$http', '__env', function ($scope, $location, $window, $http, __env) {
	$scope.signInFormModel = {};

	$scope.submitSignInForm = function(valid) {
		if (valid) {
			console.log("submitted!");
			console.log($scope.signInFormModel);
			$http({
				method: 'POST',
				url: __env.loginURL,
				contentType: 'application/json',
				data: $scope.signInFormModel
			}).then(function successCallback(response){
				console.log(response)
				console.log('success');
				$window.location = '/home';
			}).catch(function(err){
				console.log(err);
			})
		} else {
			console.log("Invalid Form!");
		}
	}
}]);


loginApp.controller('acfCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $window, $location, $http, __env) {
	$scope.acfModel = {};

	$scope.submitACF = function(valid) {
		if (valid) {
			console.log("submitted!");
			console.log($scope.acfModel);
			$http({
				method: 'POST',
				url: __env.signupURL,
				contentType: 'application/json',
				data: $scope.acfModel
			}).then(function(response){
				console.log('success');
				$window.location = '/home/';
			}).catch(function(){
				console.log('failure');
			})
		} else {
			console.log("Invalid Form!");
		}
	}
}]);


