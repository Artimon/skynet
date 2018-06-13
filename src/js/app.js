/* globals angular, Skynet */

(function (angular, Skynet) {

	'use strict';

	var app = angular.module('skynetApp', []);

	app.controller('SkynetCtrl', function ($scope) {
		$scope.skynet = new Skynet();
		$scope.skynet.start();

		/**
		 * @param expectation [-1 ... +1]
		 */
		$scope.train = function (expectation) {
			$scope.skynet.neuron.train(expectation);
			$scope.skynet.stimulate();
		};
	});

})(angular, Skynet);