const { expect } = require('chai');
const js = require('..');

describe('index.js', () => {
	it('验证api', () => {
		expect(typeof js).to.equal('object');
	});
});
