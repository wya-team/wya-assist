const { expect } = require('chai');
const vc = require('..');

describe('index.js', () => {
	it('验证api', () => {
		expect(typeof vc).to.equal('object');
	});
});
