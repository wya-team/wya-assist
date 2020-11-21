/**
 * Debug
 */
import { URL, Load, Cookie } from '@wya/utils';

const SCRIPT_URL = '//cdn.bootcss.com/eruda/1.5.2/eruda.min.js';
const LOCAL_DEBUG_KEY = '__WYA__DEBUG__';
/**
 * 暂时先有公共的管理，后期考虑每个项目中单独拥有
 */
export default class Debug {
	constructor(options = {}) {
		let { force, validate, site = /(wyapre|wyawds.com$|^wyaxls\.)/ } = options;

		this.validate = validate;
		this.isInject = false;
		/**
		 * 1. 特定域名
		 * 2. 正在开启debug模式，有效期1小时（可修改）
		 * @type {RegExp}
		 */

		let isInSite = site.test(window.location.hostname);
		let isEffectiveTime = Cookie.get(LOCAL_DEBUG_KEY);
		let isDev = process.env.NODE_ENV === 'development';
		this.debug = force || isInSite || isEffectiveTime || isDev || false;

		this._init();
	}

	_init() {
		const debug = URL.get('debug');
		const secret = URL.get('secret');

		if (debug === false) {
			Cookie.remove(LOCAL_DEBUG_KEY);
			return;
		}

		if (this.debug) {
			this._inject();
		} else if (this.validate && debug && secret) {
			this.validate().then(() => {
				Cookie.set(LOCAL_DEBUG_KEY, true);
				this._inject();
			}).catch((res = {}) => {
				console.log(res);
			});
		}
	}

	_inject() {
		if (this.isInject) return;

		// (key, ...args)
		let ready = [];
		let original = {};

		let resetLogger = (() => {
			Object.keys(console).forEach((key) => {
				original[key] = console[key];
				console[key] = (...args) => {
					ready.push({ key, args });
				};
			});

			return () => {
				Object.keys(original).forEach((key) => {
					console[key] = original[key];
				});
			};
		})();

		let runReady = () => {
			ready.forEach(({ key, args }) => {
				console[key].call(null, ...args);
			});

			console.log('DEBUG_DELAY_END');
			ready = [];
		};

		console.log('DEBUG_DELAY_START');
		Load.js(SCRIPT_URL).then(() => {
			resetLogger();

			if (!eruda._isInit) {
				eruda.init();
				runReady();
			}

			this.isInject = true;
		}).catch(err => {
			resetLogger();
			runReady();
			console.log(err);
		});
	}
}
