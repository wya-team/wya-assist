export default {
	inject: ['getData'],
	props: {
		index: Number
	},
	computed: {
		qIndex() {
			const data = this.getData();
			if (typeof this.index === 'undefined') return '';
			return Array.from({ length: this.index }).reduce((pre, cur, index) => {
				if (!/^q-/.test(data[index].module)) {
					pre--;
				}
				return pre;
			}, this.index) + 1 + '. ';
		}
	}
};
