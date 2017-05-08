var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Define AngularJS application
var profileApp = angular.module('userPage', []);

profileApp.constant('__env', env);

profileApp.controller('userCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $location, $window, $http, __env) {
	$scope.editModel = {};
	$scope.projects = [];

	$http({
		method: 'GET',
		url: __env.getAllProjectsURL,
		content: 'application/json',
		data: $scope.pcfModel
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.projects = response.data;
		console.log("Print projects" + $scope.projects.projectName);
	}).catch(function(err) {
		console.log(err);
	});

	$scope.loadData = function() {
		console.log("Load Data!");
		console.log($scope.editModel);
		$http({
			method: 'GET',
			url: __env.getUserURL,
			contentType: 'application/json',
			data: $scope.editModel
		}).then(function successCallback(response){
			console.log(response.data);
		}).catch(function(err){
			console.log(err);
		})
		console.log($scope.editModel);
	}
}]);