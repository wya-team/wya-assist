const requestAction = (defaultOptions = {}) => {
	const { apis, request } = defaultOptions;
	return (store, opts = {}) => {
		const {
			url: mutation,
			redirect, // 重定向Mutation
			param = {},
			pending,
			fail,
			refresh,
			loading = true,
			...rest
		} = opts;

		if (!apis[mutation]) {
			console.error('[rootActions/request], mutation需要对应的url');
			return !1;
		}
		
		// pending 为 false，则必须要写_PENDING的mutation
		pending && store.commit(redirect || `${mutation}_PENDING`, { param });
		return request({
			url: apis[mutation],
			param,
			loading: param.page === undefined ? loading : false,
			...rest
		}).then((res) => {
			const { data } = res;
			store.commit(redirect || `${mutation}_${refresh ? 'REFRESH' : 'SUCCESS'}`, {
				data,
				param,
				// ...rest
			});
			return res;
		}).catch((error) => {
			fail && store.commit(redirect || `${mutation}_FAIL`, { param });
			return Promise.reject(error);
		});
	};
};

export default requestAction;