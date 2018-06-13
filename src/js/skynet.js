/* globals _, Neuron, Axon */

var Skynet = (function (_, Neuron, Axon) {

	'use strict';

	function Skynet() {
		this.axons = [];
	}

	Skynet.prototype.start = function () {
		var self = this,
			i;

		for (i = 0; i < 9; ++i) {
			this.axons.push(new Axon());
		}

		this.neuron = new Neuron();

		_.each(this.axons, function (axon) {
			self.neuron.addInput(axon);
		});

		this.stimulate();
	};

	Skynet.prototype.stimulate = function () {
		this.axons[0].stimulate(1); this.axons[1].stimulate(0); this.axons[2].stimulate(0);
		this.axons[3].stimulate(1); this.axons[4].stimulate(0); this.axons[5].stimulate(0);
		this.axons[6].stimulate(1); this.axons[7].stimulate(1); this.axons[8].stimulate(0);
		this.neuron.feedForward();
	};

	return Skynet;

})(_, Neuron, Axon);