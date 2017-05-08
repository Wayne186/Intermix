var env = {};

// Import variables if present (from env.js)
if (window) {
	Object.assign(env, window.__env);
}

var app = angular.module("messages", ['ui.bootstrap.modal']);
// , 'jcs-autoValidate'

// Register environment in AngularJS as constant
app.constant('__env', env);

app.controller("messageController", ['$scope', '$window', '$location', '$http', '__env', function ($scope, $window, $location, $http, __env) {
	$scope.conversations = [];
	var part1 = "";
	var part2 = "";
	var chat_ = {};

	/* Opens and closes modals */
	$scope.open = function () {
		$scope.showModal = true;
	};

	$scope.cancel = function () {
		$scope.showModal = false;
		$scope.editModal = {};
		$scope.showEdit = false;
	};

	/* Opens a conversation */
	$scope.conversation = {};
	// $scope.participant = {};
	$scope.view = function (chat) {
		chat_ = chat;
		$scope.viewMessage = !$scope.viewMessage;
		console.log("Opening chat with: " + chat.participants);
		part1 = chat.participants[0];
		part2 = chat.participants[1];
		$http({
			method: 'GET',
			url: __env.loadConversation,
			contentType: 'application/json',
			data: chat
		}).then(function successCallback(response) {
			$scope.conversation = response;
			console.log("Conversation loaded");
			console.log($scope.conversation);
			$scope.showReply = !$scope.showReply;
			$scope.showSend = !$scope.showSend;
		}).catch(function (err) {
			console.log(err);
		})
	}

	/* Creates a new message */
	$scope.newMessage = {};
	$scope.sendMessage = function () {
		// console.log($scope.newMessage);
		console.log(part1);
		console.log(part2);
		console.log($scope.newMessage.composedMessage);
		$scope.newMessage = {
			'participant1': part1,
			'participant2': part2,
			'composedMessage': $scope.newMessage.composedMessage
		}
		console.log($scope.newMessage);
		$http({
			method: 'POST',
			url: __env.sendReply,
			contentType: 'application/json',
			data: $scope.newMessage
		}).then(function successCallback(response) {
			$window.location.reload();
			$window.onload = function() {
				$scope.view(chat_);	
				console.log("Reloaded");
			};
		}).catch(function (err) {
			console.log(err);
		});
	}

	/* Checks if a message is valid, sends it */
	$scope.mcfModel = {};
	$scope.submitMCF = function (valid) {
		$scope.mcfModel.composedMessage = "New Conversation Created";
		console.log($scope.mcfModel);
		if (valid) {
			console.log('Creating message with: ' + $scope.mcfModel.recipient);
			$http({
				method: 'POST',
				url: __env.createConversation,
				contentType: 'application/json',
				data: $scope.mcfModel
			}).then(function successCallback(response) {
				console.log('User: ' + $scope.mcfModel.recipient);
			})
			$window.location.reload();
		} else {
			console.log('Invalid message');
		}
	}

	/* Fetches all of the conversations */
	$http({
		method: 'GET',
		url: __env.loadAllConversations,
		content: 'application/json',
		data: $scope.mcfModel
	}).then(function successCallback(response) {
		// console.log(response.data)
		$scope.conversations = response.data;
	}).catch(function (err) {
		console.log(err);
	});

}]);