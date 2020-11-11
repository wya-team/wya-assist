/**
 * needs: ['layout-style', { name: '', options: {}, ...restAsOptions }]
 */
export const generatePicker = (target) => {
	const defaultNeeds = Object.keys(target);

	return (needs = defaultNeeds) => needs.map((key) => {
		let item;
		if (typeof key === 'string') {
			item = target[key];
			if (typeof item === 'function') {
				return item();
			}
		} else if (key && typeof key === 'object') {
			item = target[key.name];
			if (typeof item === 'function') {
				const { name, options = {}, ...restAsOptions } = key;
				return item({
					...restAsOptions,
					...options
				});
			}
		} 
		
		return item;
	});
};