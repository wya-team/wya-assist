export default (opts = {}) => {
	const { prefix = 'q-', key = 'rebuildIndex' } = opts;
	const regex = new RegExp(`^${prefix}`);
	return {
		inject: ['getData'],
		props: {
			index: Number
		},
		computed: {
			[key]() {
				const data = this.getData();
				if (typeof this.index === 'undefined') return '';
				return Array.from({ length: this.index }).reduce((pre, cur, index) => {
					if (!regex.test(data[index].module)) {
						pre--;
					}
					return pre;
				}, this.index) + 1;
			}
		}
	};
};
