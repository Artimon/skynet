/* globals _ */

var Axon = (function (_) {

	'use strict';

	function Axon() {
		this.weight = Math.random() * 2 - 1; // Initial weight.
		this.learningRate = 0.1;

		/**
		 * @type {number} Unweighted sigmoid.
		 */
		this.impulse = 0;

		/**
		 * @type {number} Weighted impulse / sigmoid.
		 */
		this.potential = 0;
	}

	/**
	 * @param {number} impulse
	 */
	Axon.prototype.stimulate = function (impulse) {
		this.impulse = impulse;
		this.potential = impulse * this.weight;
	};

	/**
	 * @TODO Keep weights in plausible range.
	 * @link https://de.wikipedia.org/wiki/Nervenzelle#/media/File:Aktionspotential.svg
	 *
	 * @param {number} error
	 */
	Axon.prototype.adjustWeight = function (error) {
		this.weight += this.learningRate * error * this.potential;
	};

	return Axon;

})(_);