/* globals _ */

var Neuron = (function (_) {

	'use strict';

	/**
	 * @link http://natureofcode.com/book/chapter-10-neural-networks/
	 *
	 * We'll again do some improvements, like adding a learning rate to our
	 * perceptron. This time we make use of the valuable information
	 * provided by the linked article but merge it with the improved parts
	 * we already used before.
	 *
	 * @constructor
	 */
	function Neuron() {
		/**
		 * @type {Axon[]}
		 */
		this.inputs = [];

		/**
		 * @type {Axon[]}
		 */
		this.outputs = [];

		this.impulse = 0;
	}

	Neuron.prototype.addInput = function (axon) {
		this.inputs.push(axon);
	};

	/**
	 * You may pass any kind of object but you should keep the pattern
	 * identical once you fed one pattern in.
	 *
	 * Note:
	 * 1. Automatically adds new input parameters to its pattern.
	 * 2. Do not pass a value named "bias", since it will be overwritten.
	 * 3. Pattern values can be of any range.
	 *
	 * Changes:
	 * 1. Bias is put back into the input to be enforced and weighted.
	 * 2. The sigmoid result directly is the output. You could also use a
	 *    sign(...) function to only differ between "black and white" but
	 *    I'd like to have a natural perception.
	 * 3. The output ranges from -1 to +1 instead of "true VS false".
	 *
	 * Example:
	 * perceptron.feedForward({ inputOne: 100, inputTwo: -5.35, inputThree: 0.01 })
	 *
	 * @param {{}} input
	 * @returns {number}
	 */
	Neuron.prototype.feedForward = function () {
		var self = this,
			sum = 1; // 1 for the static bias.

		_.each(this.inputs, function (input) {
			sum += input.potential;
		});

		/*
		 * Sigmoid function:
		 * @link https://en.wikipedia.org/wiki/Sigmoid_function
		 * @link http://wiki.bethanycrane.com/perceptron
		 *
		 * A simpler version would be:
		 * return sum > 0 ? 1 : -1;
		 * Works, too, but it would strip away the "soft perception".
		 *
		 * ~1 at +4
		 * ~0 at -4
		 */
		this.impulse = 1 / (1 + Math.exp(-sum)); // 0 to 1
		this.impulse = 2 * this.impulse - 1; // -1 to +1

		_.each(this.outputs, function (output) {
			output.impulse = self.impulse;
		});

		console.log(
			'Anser:',
			this.answer(),
			'Impulse:',
			this.impulse
		);
	};

	/**
	 * If you want to check for a clear answer like the sign(...)
	 * function would create, you just call this method.
	 *
	 * Example:
	 * perceptron.feedForward(...);
	 * perceptron.answer() -> returns -1 or +1
	 *
	 * @returns {number}
	 */
	Neuron.prototype.answer = function () {
		return this.impulse > 0 ? 1 : -1;
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
	 * @param {number} expectation range [-1 to +1]
	 * @returns {number}
	 */
	Neuron.prototype.train = function (expectation) {
		var error = expectation - this.impulse;

		_.each(this.inputs, function (input) {
			input.adjustWeight(error);
		});
	};

	return Neuron;

})(_);