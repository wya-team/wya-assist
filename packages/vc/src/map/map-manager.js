import { URL, Load } from '@wya/utils';

let AMAP_SCRIPT_SRC = '//webapi.amap.com/maps?v=1.4.14&key=b400a1891f67168f2a48f0021aaf93e8';
let AMAP_UI_SCRIPT_SRC = '//webapi.amap.com/maps?v=1.4.14&key=b400a1891f67168f2a48f0021aaf93e8';

let location;

let locationManager = null;

export default class MapManager {
	static inject({ mapScript, mapUIScript }) {
		AMAP_SCRIPT_SRC = mapScript;
		AMAP_UI_SCRIPT_SRC = mapUIScript;
	}

	constructor(options = {}) {
		this.defaultOptions = {
			...options
		};

		/**
		 * 当前地图镜像
		 */
		this.target = null;

		/**
		 * loadJS之前暂存的函数
		 */
		this.readyFns = [];

		/**
		 * 初始化
		 */
		this._init();
	}

	async _init() {
		try {
			const { ui } = this.defaultOptions;
			/**
			 * [Load]已针对现有资源做管理，不会重复触发;
			 */
			await Load.js(AMAP_SCRIPT_SRC);
			ui && await Load.js(AMAP_UI_SCRIPT_SRC);
			
			this._createMap();
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * 临时处理,
	 * 1. 有场景不需要创建map， 只是去获取数据
	 * 2. el 不存在，表示当前应用场景不需要插入到dom
	 */
	async _createMap(opts = {}) {
		try {
			const { ui, el, ...rest } = this.defaultOptions;

			el && (this.target = new AMap.Map(el, rest));
			/**
			 * 处理ready
			 */
			this.readyFns.forEach(item => item(this.target));
			this.readyFns = [];
		} catch (e) {
			console.log(e);
		}
		
	}

	ready(fn) {
		this.target
			? fn()
			: this.readyFns.push(fn);
	}

	open(query, opts = {}) {
		window.open(URL.merge({
			path: `https://www.amap.com/search`,
			query
		}));
	}

	/**
	 * 高德定位获取经纬度
	 * @param {Object} opts 
	 */
	static getLocation(opts = {}) {
		const { timestamp = 5 } = opts;
		
		return new Promise((resolve) => {

			const onComplete = (data) => {
				const { lat, lng } = data.position;
				resolve({
					latitude: lat,
					longitude: lng
				});
			};
			const onError = (error) => {
				error.message && console.log(error.message);
				console.log('定位获取失败，请刷新之后再试');
				resolve({});
			};

			try {
				locationManager.target.plugin('AMap.Geolocation', function () {
					let geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						timeout: timestamp * 1000,
						// 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
						GeoLocationFirst: true,
						// 是否禁止使用IP定位，默认值为0，可选值0-3
						// 0: 可以使用IP定位, 1: 手机设备禁止使用IP定位
						// 2: PC上禁止使用IP定位, 3: 所有终端禁止使用IP定位
						noIpLocate: 0
					});
	
					geolocation.getCurrentPosition();
					AMap.event.addListener(geolocation, 'complete', onComplete);
					AMap.event.addListener(geolocation, 'error', onError);
				});
			} catch (error) {
				onError(error);
			}
		});
	}

	/**
	 * 使用高德获取经纬度
	 */
	/**
	 * 重新设置经纬度的Promise
	 * 用户可以重社设置timestamp(force = true), 获取新的Promise
	 * timestamp 单位秒
	 */
	static resetLocation(opts = {}) {
		const { force = false } = opts;

		if (force || !location) {
			// eslint-disable-next-line no-async-promise-executor
			location = new Promise(async (resolve) => {

				if (locationManager && locationManager.target) {
					const res = await MapManager.getLocation(opts);
					resolve(res);
				} else {
					locationManager = new MapManager({ el: 'locationMap' });

					locationManager.ready(async () => {
						const res = await MapManager.getLocation(opts);
						resolve(res);
					});
				}
			});
		}
		
		return location;
	}
}