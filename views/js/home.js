var env = {};

// Import variables if present (from env.js)
if (window) {
	Object.assign(env, window.__env);
}

/* Displays the drop-down menu */
function drop() {
	document.getElementById("drop").classList.toggle("show");
}

/* Closes the drop-down menu if outside element clicked */
window.onclick = function (event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

// Define AngularJS application
var app = angular.module("homeapp", ['ui.bootstrap.modal']);

app.constant('__env', env);

app.controller("homeController", ['$scope', '$window', '$location', '$http', '__env', function ($scope, $window, $location, $http, __env) {

	$scope.selectOption = function (option) {
		console.log("Ordering by: " + option);
		$scope.option = option;
		console.log($scope.option);
	}

	$scope.pcfModel = {};

	/* Submits a project */
	$scope.submitPCF = function (valid) {
		if (valid) {
			console.log("submitted!");
			$http({
				method: 'POST',
				url: __env.createProjectURL,
				contentType: 'application/json',
				data: $scope.pcfModel
			}).then(function successCallback(response) {
				console.log(response);
				console.log($scope.pcfModel);
				console.log("Project submitted");
			}).catch(function (err) {
				console.log(err);
			});
		} else {
			console.log("Invalid Form!");
		}
		$scope.showModal = false;
		$window.location.reload();
	};

	/* Opens and closes modals */
	$scope.open = function () {
		$scope.showModal = true;
	};

	$scope.cancel = function () {
		$scope.showModal = false;
		$scope.editModal = {};
		$scope.showEdit = false;
	};

	/* Submits a project edit */
	$scope.editModel = {};
	$scope.editProject = function (project) {
		console.log("Editing a project");
		console.log($scope.editModel);
		$scope.showEdit = true;
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
	};

	/* Submits an application to a project */
	$scope.proj = {};
	$scope.apply = function (project) {
		$scope.proj = project;
		$http({
			method: "POST",
			url: __env.applyURL,
			contentType: "application/json",
			data: $scope.proj
		}).then(function successCallback(response) {
			console.log('Response Data: ' + response.data);
		}).catch(function (err) {
			console.log('Error: ' + err);
		})
	};

	/* Fetches all of the projects */
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
	}).catch(function (err) {
		console.log(err);
	});
}]);