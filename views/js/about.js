var env = {};

// Import variables if present (from env.js)
if (window) {
	Object.assign(env, window.__env);
}
var app = angular.module('about', []);

app.constant('__env', env);

app.controller("MainController", ['$scope', '$window', '$location', '$http', '__env', function ($scope, $window, $location, $http, __env) {

	$scope.formModel = {};
	/* Submits feedback to gmail account */
	$scope.onSubmit = function () {
		console.log($scope.formModel);
		$http({
			method: "POST",
			url: __env.submitFeedbackURL,
			contentType: "application/json",
			data: $scope.formModel
		}).then(function (response) {
			console.log("Successfully sent");
		}).catch(function (ras) {
			console.log("Failed to send " + ras.status);
		});
	};

}]);