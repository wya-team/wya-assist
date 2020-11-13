import { URL } from '@wya/utils';

/**
 * 列表搜索项重置
 * @param {Array} whiteList 不需要重置掉的参数数组
 */

export default (whiteList = []) => {
	return {
		methods: {
			handleReset() {
				const { path } = this.$route;
				const { query } = URL.parse();
				const mutation = path
					.replace(/^\//, '')
					.replace(/(-\d+)/, '')
					.replace(/-|\//g, '_')
					.replace(/_list$/, '') // 兼容路由最后是’list‘的情况（如：/licence/list)
					.toUpperCase() + '_LIST_INIT';

				[this.keywords, query].forEach(item => {
					Object.keys(item).forEach(key => {
						if (!whiteList.includes(key)) {
							item[key] = '';
						}
					});
				});

				const newQuery = {
					...this.keywords, 
					...query
				};

				this.$router.replace(
					URL.merge({ path, query: newQuery })
				);
				
				this.$store.commit(mutation);
			},
		}
	};
};
