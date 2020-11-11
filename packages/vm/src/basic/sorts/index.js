import { generatePicker } from '../../utils';

import { rtf } from './rtf/root';
import { page } from './page/root';

const originModules = {
	page,
	rtf,
};

export default {
	keys: Object.keys(originModules),
	origins: originModules, 
	modules: Object.keys(originModules).reduce((pre, cur) => {
		const item = originModules[cur];
		pre[cur] = typeof item === 'function' ? item() : item;
		return pre;
	}, {}),
	
	/**
	 * 可配置id
	 * ['page', { name: '', options: {}, ...restAsOptions }]
	 */
	getModules: (needs) => {
		return generatePicker(originModules)(needs).reduce((pre, cur) => {
			pre[cur.module] = cur;
			return pre;
		}, {});
	} 
};