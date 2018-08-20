var Neuron = (function (_) {

	'use strict';

	/**
	 * @link http://natureofcode.com/book/chapter-10-neural-networks/
	 *
	 * @constructor
	 */
	function Neuron() {
		this.input = {};
		this.weights = {};

		this.output = 0; // Sign function like sigmoid result (0 to 1);

		this.learningRate = 1; // Can be adjusted for different learning speeds.
	}

	/**
	 * You may pass any kind of object but you should keep the pattern
	 * identical once you fed one pattern in.
	 *
	 * Note:
	 * 1. Automatically adds new input parameters to its pattern.
	 * 2. Do not pass a value named "bias", since it will be overwritten.
	 * 3. Pattern values can be of any range from 0 to 1.
	 *
	 * Changes:
	 * 1. Bias is put back into the input to be enforced and weighted.
	 * 2. The sigmoid result directly is the output. You could also use a
	 *    sign(...) function to only differ between "black and white" but
	 *    I'd like to have a natural perception.
	 * 3. The output ranges from 0 to 1 instead of "false & true".
	 *
	 * @param {{}} input
	 * @returns {number}
	 */
	Neuron.prototype.feedForward = function (input) {
		var self = this,
			sum = 0;

		this.input = input; // Store last input for learning.
		this.input.bias = 1; // Enforce bias to be weighted.

		_.each(this.input, function (value, name) {
			if (self.weights[name] === undefined) {
				self.weights[name] = self.getInitialWeight();
			}

			sum += self.weights[name] * value;
		});

		/*
		 * Sigmoid function:
		 * @link https://en.wikipedia.org/wiki/Sigmoid_function
		 * @link http://wiki.bethanycrane.com/perceptron
		 *
		 * A simpler version would be:
		 * return sum > 0 ? 1 : 0;
		 * Works, too, but it would strip away the "soft perception".
		 *
		 * ~1 at +4
		 * ~0 at -4
		 */
		this.output = 1 / (1 + Math.exp(-sum)); // 0 to 1
		// this.output = 2 * this.output - 1; // -1 to +1

		return this.output;
	};

	/**
	 * @returns {number}
	 */
	Neuron.prototype.getInitialWeight = function () {
		return 2 * Math.random() - 1;
	};

	/**
	 * If you want to check for a clear answer like the sign(...)
	 * function would create, you just call this method.
	 *
	 * Example:
	 * perceptron.feedForward(...);
	 * perceptron.answer() -> returns 0 or 1
	 *
	 * @returns {number}
	 */
	Neuron.prototype.answer = function () {
		return this.output > 0.5 ? 1 : 0;
	};

	/**
	 * When the perceptron.feedForward(...) method does not result in what you
	 * expected just call the perceptron.train(...) method with the
	 * correct expectation. It will return the new result after rethinking.
	 *
	 * Changes:
	 * Ignoring correct answers on training has been removed to be able to
	 * train stronger perceptions. As the relative error in been taken the
	 * impact on previous trainings is not too hard.
	 *
	 * @param {number} expectation range [0 to 1]
	 * @returns {number}
	 */
	Neuron.prototype.train = function (expectation) {
		var self = this,
			error;

		error = expectation - this.output;

		_.each(this.input, function (value, name) {
			self.weights[name] += self.learningRate * error * value;
		});

		return this.feedForward(this.input);
	};

	return Neuron;

})(_);