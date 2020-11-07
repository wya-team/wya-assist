import { pick } from 'lodash';

const basic = {
	// TODO
};
basic.getComponents = (list) => {
	return pick(basic, list || Object.keys(basic));
};

export default basic;
