var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Define AngularJS application
var app = angular.module("userPage", ['ui.bootstrap.modal']);

app.constant('__env', env);
// , 'jcs-autoValidate'

app.controller('userCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $window, $location, $http, __env) {

	/* Get Searched-User information */
	$scope.findModel = {};
	$scope.user = {}
	var Name;
	$scope.findUser = function () {
		console.log('Searching for ' + $scope.findModel.username);
		Name = $scope.findModel.username;
		console.log('saved ' + Name);
		$http({
			method: 'POST',
			url: __env.getForeignUserURL,
			contentType: 'application/json',
			data: $scope.findModel
		}).then(function successCallback(response) {
			$scope.user = response.data;
			console.log(JSON.stringify(response.data));
		}).catch(function (err) {
			console.log(err);
		})
	};

	
	$scope.userRate = {};
	$scope.findRate = function () {
		console.log('Searching for ' + $scope.findModel.username);
		$http({
			method: 'POST',
			url: __env.getRatingURL,
			contentType: 'application/json',
			data: $scope.findModel
		}).then(function successCallback(response) {
			$scope.userRate = response.data;
			console.log(JSON.stringify(response.data));
		}).catch(function (err) {
			console.log(err);
		})
	};


	/* Store rating for searched user */
	$scope.rateModel = {};
	var rateData = {};
	$scope.sendRating = function () {
		rateData = { 'ratingForUsername': Name, 'rating': $scope.rateModel.rating, 
					 'comments': $scope.rateModel.comments};
		console.log($scope.rateModel);
		console.log(rateData);
		$http({
			method: 'POST',
			url: __env.submitRatingURL,
			contentType: 'application/json',
			data: rateData
		}).then(function successCallback(reponse) {
			console.log('Sending rating');
		}).catch(function (err) {
			console.log(err);
		})
		$window.location.href = '/findUser/';
		$window.location.href;
	}

	$scope.openRate = function() {
		$scope.rateFormModal = true;

		$scope.rateModel.ratingForUsername = Name;
		console.log('save ' + $scope.rateModel.ratingbyUsername + ' succeed');
	}

	/* Closes user, project editing */
	$scope.cancel = function () {
		$scope.rateFormModal = false;
	};

	$scope.projects = [];
	$scope.findProj = function() {
		console.log($scope.findModel.username);
		$http({
			method: 'POST',
			url: __env.getForeignUserProjectsURL,
			content: 'application/json',
			data: $scope.findModel
		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.projects = response.data;
			console.log("Print projects" + $scope.projects.projectName);
		}).catch(function (err) {
			console.log(err);
		});
	}
	
}]);