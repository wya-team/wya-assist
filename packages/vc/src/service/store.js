import { isEqualWith, cloneDeep } from 'lodash';
import { Storage } from '@wya/utils';

const resetStore = () => {
	return cloneDeep({
		param: {},
		response: undefined
	});
};

const defaultCompare = (newParam, localObj) => {
	isEqualWith(newParam, localObj.param)
		? localObj.response
		: undefined;
};

class StoreService extends Base {
	constructor() {
		super();
		this.create = this.create.bind(this);
	}
	
	create(defaultOptions = {}) {
		const {
			key,
			url,
			compare = defaultCompare,
			parser = null,
			cache = false,
			vuex = false,
			param: defaultParam = {},
			getParam = (instance) => ({}),
		} = defaultOptions;
		let store;
		cache && (store = Storage.get(`${key}`));
		store = store || resetStore();

		// clear
		!cache && this._add(() => {
			store = resetStore();
		});
		return {
			[key]: (userOptions = {}) => {
				const { param: userParam = {} } = userOptions;
				const options = { ...defaultOptions, ...userOptions };
				const { autoLoad = true, autoClear = false } = options;
				// 方法首字母大写
				const strFn = key.charAt(0).toUpperCase() + key.slice(1);

				const loadKey = `load${strFn}`;
				const clearKey = `clear${strFn}`;
				const loadingKey = `loading${strFn}`;

				return {
					data() {
						return {
							[key]: (store.response || {}).data || [],
							[loadingKey]: false
						};
					},
					created() {
						autoLoad && (this[loadKey])({
							...defaultParam,
							...userParam,
							...getParam(this)
						});
					},
					beforeDestroy() {
						autoClear && this[clearKey]();
					},
					methods: {
						[loadKey](param, opts = {}) { // eslint-disable-line
							this[loadingKey] = true;
							let ajax = vuex ? this.request : this.$request;
							return ajax({
								url, // 必须是mutationType
								type: 'GET',
								localData: compare(param, store),
								loading: false,
								param,
								...opts
							}).then((response) => {
								store = {
									param,
									response
								};
								this[key] = parser ? parser(store.response.data) : store.response.data;
								typeof cache === 'function' 
									? cache(key, store) 
									: (cache && Storage.set(`${key}`, store));
								return response;
							}).catch((response) => {
								return Promise.reject(response);
							}).finally(() => {
								this[loadingKey] = false;
							});
						},
						[clearKey]() {
							store = resetStore();
						}
					}
				};
			}
		};
	}
}

export default new StoreService();