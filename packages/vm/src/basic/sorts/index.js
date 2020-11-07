import { pick } from 'lodash';
import { rtf } from './rtf/root';
import { page } from './page/root';

const basic = {
	page,
	rtf,
};

export default {
	getComponents: (list) => {
		return pick(basic, list || Object.keys(basic));
	}
};
