/* globals describe, it, expect */

describe('Neuron', function () {

	'use strict';

	var patterns = {
		and: [
			{ inputs: { a: 0, b: 0 }, expectation: 0 },
			{ inputs: { a: 0, b: 1 }, expectation: 0 },
			{ inputs: { a: 1, b: 0 }, expectation: 0 },
			{ inputs: { a: 1, b: 1 }, expectation: 1 }
		],
		nand: [
			{ inputs: { a: 0, b: 0 }, expectation: 1 },
			{ inputs: { a: 0, b: 1 }, expectation: 1 },
			{ inputs: { a: 1, b: 0 }, expectation: 1 },
			{ inputs: { a: 1, b: 1 }, expectation: 0 }
		],
		or: [
			{ inputs: { a: 0, b: 0 }, expectation: 0 },
			{ inputs: { a: 0, b: 1 }, expectation: 1 },
			{ inputs: { a: 1, b: 0 }, expectation: 1 },
			{ inputs: { a: 1, b: 1 }, expectation: 1 }
		],
		nor: [
			{ inputs: { a: 0, b: 0 }, expectation: 1 },
			{ inputs: { a: 0, b: 1 }, expectation: 0 },
			{ inputs: { a: 1, b: 0 }, expectation: 0 },
			{ inputs: { a: 1, b: 1 }, expectation: 0 }
		],
		not: [
			{ inputs: { a: 0 }, expectation: 1 },
			{ inputs: { a: 1 }, expectation: 0 }
		],
		xor: [
			{ inputs: { a: 0, b: 0 }, expectation: 0 },
			{ inputs: { a: 0, b: 1 }, expectation: 1 },
			{ inputs: { a: 1, b: 0 }, expectation: 1 },
			{ inputs: { a: 1, b: 1 }, expectation: 0 }
		]
	};

	/**
	 * @param {*} pattern
	 * @param {number} epochs
	 * @param {*} [options]
	 * @returns {Neuron}
	 */
	function trainer(pattern, epochs, options) {
		var sut,
			errors = 0,
			answer,
			set,
			i;

		options = options || {};

		sut = new Neuron(options.learningRate);
		sut.training = {
			errors: 0,
			tests: 0
		};

		for (i = 0; i < epochs; ++i) {
			set = _.sample(pattern);

			sut.feedForward(set.inputs);
			answer = sut.answer();
			sut.training.tests += 1;

			if (answer !== set.expectation) {
				sut.training.errors += 1;

				// options.log && console.log('Weights:', sut.weights);
				// options.log && console.log('Training...', set);
				sut.train(set.expectation);
			}
		}

		_.each(pattern, function (set) {
			var answer,
				output;

			output = sut.feedForward(set.inputs);
			answer = sut.answer();

			options.log && console.log('Test:', set.inputs, set.expectation, answer, output);

			expect(answer).toEqual(set.expectation);
		});

		options.log && console.log('Weights:', sut.weights, '; errors:', errors);

		return sut;
	}

	describe('simple logical gates', function () {

		it('can learn AND', function () {
			trainer(patterns.and, 100);
		});

		it('can learn NAND', function () {
			trainer(patterns.nand, 100);
		});

		it('can learn OR', function () {
			trainer(patterns.or, 100);
		});

		it('can learn NOR', function () {
			trainer(patterns.nor, 100);
		});

		it('can learn NOT', function () {
			trainer(patterns.not, 100);
		});

	});

	describe('binary combinations', function () {
		/*
		 * XOR = (NOT a AND b) OR (a AND NOT b)
		 */
		it('can learn XOR', function () {
			var sut,
				answer,
				output;

			sut = {
				and: trainer(patterns.and, 100),
				or: trainer(patterns.or, 100),
				not: trainer(patterns.not, 100)
			};

			_.each(patterns.xor, function (set) {
				var inputs = {},
					answer,
					output;

				// NOT a AND b
				sut.not.feedForward({ a: set.inputs.a });
				sut.and.feedForward({
					a: sut.not.answer(),
					b: set.inputs.b
				});

				inputs.a = sut.and.answer();

				// a AND NOT b
				sut.not.feedForward({ a: set.inputs.b });
				sut.and.feedForward({
					a: set.inputs.a,
					b: sut.not.answer()
				});

				inputs.b = sut.and.answer();

				// a' OR b'
				output = sut.or.feedForward(inputs);
				answer = sut.or.answer();

				// console.log(inputs, set.expectation, answer, output);

				expect(answer).toEqual(set.expectation);
			});
		});
	});

	describe('higher operations', function () {

		it('can cut ambiguous inputs', function () {
			var sut,
				patterns = {};

			patterns.full = [
				{ inputs: { a: 0, b: 0 }, expectation: 0 },
				{ inputs: { a: 0, b: 1 }, expectation: 0 },
				{ inputs: { a: 1, b: 0 }, expectation: 1 },
				{ inputs: { a: 1, b: 1 }, expectation: 1 }
			];

			patterns.cut = [
				{ inputs: { a: 0 }, expectation: 0 },
				{ inputs: { a: 1 }, expectation: 1 }
			];

			sut = trainer(patterns.full,  100/*, { log: true }*/);

			delete sut.weights.b;

			_.each(patterns.cut, function (set) {
				sut.feedForward(set.inputs);

				expect(sut.answer()).toEqual(set.expectation);
			})
		});

		it('can learn by inputs with similar bias activation', function () {
			var pattern;

			pattern = [
				// AND from a & b
				{ inputs: { a: 0, b: 0, c: 0, d: 0 }, expectation: 0 },
				{ inputs: { a: 0, b: 1, c: 0, d: 0 }, expectation: 0 },
				{ inputs: { a: 1, b: 0, c: 0, d: 0 }, expectation: 0 },
				{ inputs: { a: 1, b: 1, c: 0, d: 0 }, expectation: 1 },

				// OR from c & d
				{ inputs: { a: 0, b: 0, c: 0, d: 0 }, expectation: 0 },
				{ inputs: { a: 0, b: 0, c: 0, d: 1 }, expectation: 1 },
				{ inputs: { a: 0, b: 0, c: 1, d: 0 }, expectation: 1 },
				{ inputs: { a: 0, b: 0, c: 1, d: 1 }, expectation: 1 }
			];

			trainer(pattern, 200);

			pattern = [
				// NAND from a & b
				{ inputs: { a: 0, b: 0, c: 0, d: 0, e: 0 }, expectation: 1 },
				{ inputs: { a: 0, b: 1, c: 0, d: 0, e: 0 }, expectation: 1 },
				{ inputs: { a: 1, b: 0, c: 0, d: 0, e: 0 }, expectation: 1 },
				{ inputs: { a: 1, b: 1, c: 0, d: 0, e: 0 }, expectation: 0 },

				// NOR from c & d
				{ inputs: { a: 0, b: 0, c: 0, d: 0, e: 0 }, expectation: 1 },
				{ inputs: { a: 0, b: 0, c: 0, d: 1, e: 0 }, expectation: 0 },
				{ inputs: { a: 0, b: 0, c: 1, d: 0, e: 0 }, expectation: 0 },
				{ inputs: { a: 0, b: 0, c: 1, d: 1, e: 0 }, expectation: 0 },

				// NOT from e
				{ inputs: { a: 0, b: 0, c: 0, d: 0, e: 0 }, expectation: 1 },
				{ inputs: { a: 0, b: 0, c: 0, d: 0, e: 1 }, expectation: 0 }
			];

			trainer(pattern, 300, { log: true });
		});

		it('can be used to draw linear separation', function () {
			var sut = trainer(patterns.nand, 100),
				size = 256,
				canvas,
				context,
				red,
				green,
				blue,
				x,
				y;

			canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;

			context = canvas.getContext('2d');

			for (x = 0; x < size; ++x) {
				for (y = 0; y < size; ++y) {
					sut.feedForward({
						a: x / size,
						b: (size - y) / size
					});

					red = 255 * sut.output;
					green = 63 * sut.answer();
					blue = 255 * (1 - sut.output);

					context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
					context.fillRect(x, y, 1, 1);
				}
			}

			document.getElementsByTagName('body')[0].appendChild(canvas);
		});

	});
});