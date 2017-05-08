var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Define AngularJS application
var analyticApp = angular.module('AnalyticPage', []);

analyticApp.constant('__env', env);

analyticApp.controller('projCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $location, $window, $http, __env) {	
	/* Loads data on startup */
	$scope.projects = [];
	$http({
		method: 'GET',
		url: __env.getProjectAnalyticURL,
		content: 'application/json',
		data: $scope
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.projects = response.data;
		console.log("Print projects" + $scope.projects[0].projectName);
		console.log(JSON.stringify($scope.users));
	}).catch(function (err) {
		console.log(err);
	});

}]);


analyticApp.controller('userCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $location, $window, $http, __env) {	

	$scope.users = [];
	$http({
		method: 'GET',
		url: __env.getAllUserURL,
		content: 'application/json',
		data: $scope
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.users = response.data;
		console.log(JSON.stringify(response.data));
		console.log(JSON.stringify($scope.users));
	}).catch(function (err) {
		console.log(err);
	});
}]);

analyticApp.controller('skillCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $location, $window, $http, __env) {	

	$scope.skills = {};
	$http({
		method: 'GET',
		url: __env.getAllSkillURL,
		content: 'application/json',
		data: $scope
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.skills = response.data;
		console.log(JSON.stringify(response.data));
	}).catch(function (err) {
		console.log(err);
	});
}]);


