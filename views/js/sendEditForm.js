var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Define AngularJS application
var profileApp = angular.module('profilePage', []);

profileApp.constant('__env', env);

profileApp.controller('editProfCtrl', ['$scope', '$window', '$location', '$http', '__env', function ($scope, $location, $window, $http, __env) {
	$scope.users = [];
	$scope.projects = [];
	$scope.editModel = {};
	$scope.searchModel = {};
	
	/* Loads data on startup */
	$scope.loadData = function() {
		console.log("Load Data!");
		console.log($scope.user);
		$http({
			method: 'GET',
			url: __env.getUserURL,
			contentType: 'application/json',
			data: $scope.editModel
		}).then(function successCallback(response){
			console.log(response.data);
			$scope.users = response.data;
			console.log("Print user data" + $scope.users.username);
		}).catch(function(err){
			console.log(err);
		})
		console.log($scope.editModel);
	}

	$scope.submitName = function (valid) {
		if (valid) {
			console.log("search!");
			console.log($scope.searchModel);
			$http({
				method: 'POST',
				url: __env.getForeignUserURL,
				contentType: 'application/json',
				data: $scope.searchModel
			}).then(function successCallback(response) {
				console.log(response);
				console.log("search succeed");
			}).catch(function (err) {
				console.log(err);
			});
		} else {
			console.log("Invalid Form!");
		}
	};
	
	/* Logs user out of website */
	logoutBTN.onclick = function() {
		console.log("logout!");
		console.log($scope.banner);
		$http({
			method: 'GET',
			url: __env.logoutURL,
			contentType: 'application/json',
			data: $scope.banner
		}).then(function successCallback(response){
			console.log("succeed");
			window.location.replace('/');
			console.log("Print user data" + $scope.users.username);
		}).catch(function(err){
			console.log(err);
		})
		console.log($scope.banner);
	}
    /*$scope.reset = function() {
        $scope.editModel = angular.copy($scope.master);
    };
    $scope.reset();*/

	$scope.submitEdit = function(valid) {
		if (valid) {
			console.log("submitted!");
			console.log($scope.editModel);
			$http({
				method: 'POST',
				url: __env.updateUserURL,
				contentType: 'application/json',
				data: $scope.editModel
			}).then(function successCallback(response){
				console.log(response);
				$window.location = '/home/';
				$scope.editModel = false;
			}).catch(function(err){
				console.log(err);
			});
		} else {
			console.log("Invalid Form!");
		}
	}

	$scope.projectForm = {};

	$scope.addProject = function () {
		console.log($scope.projectForm);

		$http.post({
			method: "POST",
			url: __env.homeURL,
			contentType: "application/json",
			data: $scope.projectForm
		}).then(function (response) {
			console.log("Successfully sent");
		}).catch(function () {
			console.log("Failed to send");
		});
	};

	$scope.submitPCF = function (valid) {
		if (valid) {
			console.log("submitted!");
			console.log($scope.pcfModel);
			$http({
				method: 'POST',
				url: __env.createProjectURL,
				contentType: 'application/json',
				data: $scope.pcfModel
			}).then(function successCallback(response) {
				console.log(response);
			}).catch(function (err) {
				console.log(err);
			});
		} else {
			console.log("Invalid Form!");
		}
	};

	$scope.open = function () {
		$scope.showModal = true;
	};

	$scope.ok = function () {
		$scope.showModal = false;
	};

	$scope.cancel = function () {
		$scope.showModal = false;
	};

	$scope.pcfModel = {};

	$scope.editModel = {};
	$scope.editProject = function () {
		console.log("submitted!");
		console.log($scope.editModel);
		$http({
			method: 'GET',
			url: __env.getProjectURL,
			contentType: 'application/json',
			data: $scope.editModel
		}).then(function successCallback(response) {
			console.log(response.data);
		}).catch(function (err) {
			console.log(err);
		});
		console.log($scope.editModel);
	};

	$scope.apply = function () {
		$http({
			method: "POST",
			url: __env.applyURL,
			contentType: "application/json",
			data: $scope.projectName
		}).then(function successCallback(response) {
			console.log(response.data);
		}).catch(function (err) {
			console.log(err);
		});
	};

	$scope.submitEdit = function (valid) {
		if (valid) {
			console.log("Edit submitted!");
			console.log($scope.editModel);
			$http({
				method: 'POST',
				url: __env.updateUserURL,
				contentType: 'application/json',
				data: $scope.editModel
			}).then(function successCallback(response) {
				console.log(response);
				$window.location.href = '/home/';
				$window.location.href;
			}).catch(function (err) {
				console.log(err);
			});
		} else {
			console.log("Invalid Form!");
		}
	};

	$scope.projects = [];
	$http({
		method: 'GET',
		url: __env.myProjectsURL,
		content: 'application/json',
		data: $scope.pcfModel
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.projects = response.data;
		console.log("Print projects" + $scope.projects.projectName);
	}).catch(function (err) {
		console.log(err);
	});


	
}]);

/*profileApp.controller('editProfCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('').success(function(data){
		$scope.master = data;
	})
    $scope.master = {username:"Wayne", email:"wayne186645@gmail.com"};
    $scope.reset = function() {
        $scope.editModel = angular.copy($scope.master);
    };
    $scope.reset();
}]);*/
