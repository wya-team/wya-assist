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

export const getImagesSize = (imgs) => {
	!(imgs instanceof Array) && (imgs = [imgs]);
	imgs = imgs.filter(i => !!i && typeof i === 'string');

	return imgs.reduce((pre, src) => {
		return pre.then((result) => {
			return new Promise((resolve) => {
				let img = new Image();
				let done = () => {
					result[src] = {
						width: img.naturalWidth || 0,
						height: img.naturalHeight || 0
					};
					resolve(result);
					img = null;
				};
				
				img.src = src;
				img.onload = done;
				img.onerror = done;
			});
		});
	}, Promise.resolve({}));
};