var env = {};

// Import variables if present (from env.js)
if (window) {
	Object.assign(env, window.__env);
}

var app = angular.module("profile", ['ui.bootstrap.modal']);
// , 'jcs-autoValidate'

// Register environment in AngularJS as constant
app.constant('__env', env);

app.controller("profileController", ['$scope', '$window', '$location', '$http', '__env', function ($scope, $window, $location, $http, __env) {

	/* Loads user data on startup */
	var a;
	var mylabel = document.getElementById("target");
	$scope.loadData = function () {
		console.log("Load Data!");
		console.log($scope.user);
		$http({
			method: 'GET',
			url: __env.getUserURL,
			contentType: 'application/json',
			data: $scope.editModel
		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.users = response.data;
			console.log("Print user data" + $scope.users.username);
			str = JSON.stringify(response.data);
			var i = str.indexOf("Total");
			var j = str.indexOf("Count");
			var total = str.substring(i+7, i+8);
			var count = str.substring(j+7, j+8);
			console.log(total/count);
			a = total/count;
			if(Number.isNaN(a)) {
				console.log("here");
				a = "N/A"
			}
			mylabel.innerText = a;
		}).catch(function (err) {
			console.log(err);
		})
		console.log($scope.editModel);
	}

	/* Retrieves the project to be edited */
	$scope.editModel = {};
	$scope.editProject = function (project) {
		console.log("Editing a project");
		console.log($scope.editModel);
		$scope.showProject = true;
		$scope.editModel = project;
		$http({
			method: 'GET',
			url: __env.getProjectURL,
			contentType: 'application/json',
			data: $scope.editModel
		}).then(function successCallback(response) {
			console.log(response.data);
		}).catch(function (err) {
			console.log(err);
		})
		console.log($scope.editModel);
	};

	/* Removes a selected teamMember */
	var remove = {};
	$scope.remove = function (teamMember) {
		remove = { 'teamMember': teamMember, 'projectName': $scope.editModel.projectName, 'projectLeader': $scope.editModel.projectLeader };
		console.log(remove);
		console.log('Removing ' + teamMember + ' from ' + remove.projectName);
		$http({
			method: 'POST',
			url: __env.removeUserURL,
			content: 'application/json',
			data: remove
		}).then(function successCallback(response) {
			console.log('User removed');
		}).catch(function (err) {
			console.log(err);
		});
		$window.location.reload();
	}

	/* Sends a project-edit */
	$scope.submitEdit = function () {
		console.log("Edit submitted");
		console.log($scope.editModel);
		$http({
			method: 'POST',
			url: __env.updateProjectURL,
			contentType: 'application/json',
			data: $scope.editModel
		}).then(function successCallback(response) {
			console.log(response);
			$window.location.href = '/home/';
			$window.location.href;
		}).catch(function (err) {
			//console.log(err);
		})
		$scope.showEdit = false;
		$scope.showProject = false;
		$window.location.reload();
	};

	/* Opens user editing */
	$scope.editProfile = {};
	$scope.open = function (user) {
		$scope.showEdit = true;
		$scope.editProfile = user;
		$http({
			method: 'GET',
			url: __env.getUserURL,
			contentType: 'application/json',
			data: $scope.editProfile
		}).then(function successCallback(response) {
			console.log(response.data);
		}).catch(function (err) {
			console.log(err);
		})
	};

	/* Sends a user edit */
	$scope.sendProfile = function () {
		console.log($scope.editProfile);
		$http({
			method: 'POST',
			url: __env.updateUserURL,
			contentType: 'application/json',
			data: $scope.editProfile
		}).then(function successCallback(response) {
			console.log(response.data);
			$window.location = '/home/';
		}).catch(function (err) {
			console.log(err);
		});
		$window.location.reload();
	}

	/* Closes user, project editing */
	$scope.cancel = function () {
		$scope.showProject = false;
		$scope.editModal = {};
		$scope.showEdit = false;
	};

	/* Retrieves projects to be displayed */
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