// let wx = new WxManager({
// 	system: 'xxx',
// 	signature: {
// 		url: '',
// 		onBefore({ options }) {
// 			return {
// 				...options,
// 				headers: {
// 					token: ''
// 				}
// 			};
// 		}
// 	},
// 	location: {
// 		key: ['lat', 'lng']
// 	}
// });
import { merge, pick, cloneDeep, debounce, noop } from 'lodash';
import MToast from '@wya/vc/lib/toast/index.m';
import { Storage, URL, Device } from '@wya/utils';
import { ajax } from '@wya/http';

typeof wx !== 'object' && console.error('wx未注入完成');

let landingPage = window.location.href;
const encodeURL = () => encodeURIComponent(
	Device.ios && parseInt(Device.osVersion, 10) < 11
		? landingPage
		: window.location.href
);

const jsApiList = [
	/**
	 * 所有要调用的 API 都要加到这个列表中
	 */
	'onMenuShareAppMessage',
	'onMenuShareTimeline',
	'updateAppMessageShareData',
	'updateTimelineShareData',
	'previewImage',
	'onMenuShareQQ',
	'onMenuShareWeibo',
	'onMenuShareQZone',
	'openAddress',
	'scanQRCode',
	'hideMenuItems',
	'showMenuItems',
	'chooseImage',
	'uploadImage',
	'getLocalImgData',
	'getLocation',
	'openLocation',
	'hideAllNonBaseMenuItem',
	// 音频有关
	'startRecord',
	'stopRecord',
	'playVoice',
	'pauseVoice',
	'stopVoice',
	'onVoicePlayEnd',
	'uploadVoice',
	'downloadVoice',
	'onVoiceRecordEnd',
	'onVoicePlayEnd',
	// 支付
	'chooseWXPay'
];

const menuList = [
	'menuItem:copyUrl',
	// 'menuItem:favorite', 产品要求开放
	'menuItem:share:appMessage',
	'menuItem:share:timeline',
	'menuItem:share:qq',
	'menuItem:share:weiboApp',
	'menuItem:share:facebook',
	'menuItem:share:QZone',
	'menuItem:delete',
	'menuItem:editTag',
	'menuItem:originPage',
	'menuItem:readMode',
	'menuItem:openWithQQBrowser',
	'menuItem:openWithSafari',
	'menuItem:share:email',
	'menuItem:share:brand'
];
export default class WXManager {
	constructor(options = {}) {
		this.defaultOptions = {
			system: '',
			signature: {
				url: ''
			},
			onBeforeShare: noop,
			jsApiList,
			menuList,
			...options,
		};

		this.tempFn = [];

		// wxConfig
		this.wxConfig = null; // Promise
		this.location = null; // Promise

		/**
		 * iOS 10 下诡异的Promise, 会连续触发两次_getConfig(概率性)
		 */
		this.hackSignCount = 0;
		this.cancelXHR = null;

		/**
		 * 清理其他系统缓存
		 */
		let baseKey = `@wya/assist/js/wechat`;
		this.sessionKey = baseKey + this.defaultOptions.system;

		Object.keys(window.localStorage).forEach((item) => {
			if (item.includes(baseKey) && !item.includes(this.defaultOptions.system)) {
				Storage.remove(item, { session: true });
			}
		});

		this.reset = debounce(this.reset);

		this._init();
		this._replaceState();
	}

	/**
	 * 路由变化指：有程序调用了replaceState 或者 pushState（路由系统通常都会调用），包括query
	 * 如果产生了签名失败，下面三个过程需要重视
	 * 1. 页面进入 -> 从后端取签名过程前; 路由变化会造成签名失败【这是概率性的，即使后面验证时路由不变化】
	 * 2. 后端获取签名 -> wx.config之间; 路由变化【100%失败】
	 * 3. wx.config -> 原生验证成功; 这个时间是无法感知的（wx.ready签名失败了也执行 - -）;这个阶段路由变化，也会造成签名失败
	 *
	 * 注：iOS第一次加载时，路由变化也会引起微信内长按二维码失效; 打开程序前阻止路由变化就可以解决; 
	 * 在测试阶段有一个现象，上面第2个场景，iOS端如果不使用_signAgain方法, 内部再次调用后端获取签名（概率性成功，所以改用了_signAgain方法）
	 * 如果此时签名成功了，也一样造成二维码失败，所以最终改用了_signAgain方法
	 *
	 * 注iOS：
	 * 解决思路就是阻止改变路由(下面都要实现1; 2是避免方式; 3是彻底解决方式1; 4是彻底解决方式2)
	 * 1. 程序在800ms前禁止调用路由变化，或者每次800ms后再重定向
	 * 	【这个设计存在js执行后，还在加载chunk时间影响，所有索性每次800ms后执行，开发时候要注意一下，如createSession】
	 * 2. beforeEach不要重定向next('/**'), 除非授权（这个是重载了，问题不大）; 
	 * 3. iOS就是在next前或者createApp前，把签名先调用了，确保签名成功后再开始执行程序
	 * 4. 重置replaceState, 要求第一次replace在签名成功之后执行
	 */
	_replaceState() {
		if (!Device.wechat) return;
		let original = window.history.replaceState;

		if (Device.ios) {
			// 同时兼容长按二维码有效
			window.history.replaceState = (...args) => {
				// 签名过程中不允许修改路径
				this._replaceSchedule && this._replaceSchedule('cancel');
				Promise.race([
					new Promise(r => this.ready(r)),
					new Promise((_, reject) => this._replaceSchedule = reject), 
					new Promise(r => setTimeout(r, 3000))
				])
					.then(() => {
						original.apply(window.history, args);
						window.history.replaceState = original;
					}).catch((e) => {
						console.log(e);
					});
			};
		} else if (Device.android) {
			window.history.replaceState = (...args) => {
				original.apply(window.history, args);
				this.reset && this.reset();
			};
		}
	}

	/**
	 * 初始化， 将微信的sdk而二次封装
	 */
	_init() {
		try {
			for (let key in wx) {
				/* eslint-disable no-loop-func */
				if ((/^(error|ready|config)$/.test(key))) {
					this[key] = (...rest) => wx[key](...rest);
				} else {
					this[key] = this._invoke(wx[key]);
				}

			}
			/**
			 * 捕获异常
			 */
			this.error((err) => {
				this._signAgain(`wx-error-init: `, err);
			});
		} catch (e) {
			throw new Error('wx未注入完成');
		}
	}

	/**
	 * 有两次重置的机会，避免无限重载
	 */
	_signAgain(session, res) {
		Storage.set(session, res, { session: true });

		let count = Storage.get(this.sessionKey, { session: true }) || 0;

		if (count <= 1) {
			if (Device.ios) {
				Storage.set(this.sessionKey, ++count, { session: true });
				// 最后一次保障，同时也避免无限重载
				this._replace();
			}
			// android签名失败时候重新设置签名
			if (Device.android) {
				Storage.set(this.sessionKey, ++count, { session: true });
				this.reset();
			}
		} else {
			console.log('微信配置错误：无效URL，请刷新后重试或联系系统管理员');
		}
	}

	_replace() {
		let iosSignHack = 'iosSignHack=' + new Date().getTime(); // 新增随机参数
		let url = window.location.origin + window.location.pathname + window.location.search; // 重组url 注意项目路径
		if (url.indexOf('?') > 0) {
			url = url + '&' + iosSignHack;
		} else {
			url = url + '?' + iosSignHack;
		}
		window.location.replace(url);
	}

	/**
	 * 避免微信sdk调用不成功时直接获取方法
	 * 请求签名成功后即使`params.url === location.href`成立; 
	 * 但是wx.config调用存在原生层面，在原生交互成功前的过程中location.href（replaceState等调用）变更，仍然会导致签名失败;
	 * 借由此方法修复该签名问题
	 */
	_invoke(fn) {
		if (!Device.wechat) return () => process.env.NODE_ENV !== 'development' && console.error(`wx-error: ${fn.name}功能只能在微信端使用`);

		return (opts = {}) => {
			const { force, ...rest } = opts;
			return this._setConfig({ force })
				.then((defaults) => {
					this.ready(() => {
						let result = merge(cloneDeep(defaults), rest);
						fn(result);
					});
				}).catch((res) => {
					console.error('wx-error-invoke:', res);
				});
		};
	}


	/**
	 * iOS 10 概率性同时出发两次，使用hackSignCount
	 */
	_setConfig(opts = {}) {
		return new Promise((resolve, reject) => {
			const { force, ...rest } = opts;
			let fn = () => {
				resolve(this.wxConfig);
			};

			if (!this.hackSignCount) {
				this.hackSignCount++;
				this.wxConfig = force || !this.wxConfig ? this._getConfig(rest) : this.wxConfig;
				fn();
			} else {
				setTimeout(fn, 10);
			}
		});
	}

	_getConfig(opts = {}, repeat = true) {
		const { request = ajax } = this.defaultOptions;
		const url = encodeURL();
		return new Promise((resolve, reject) => {
			let param = {
				url,
				system: this.defaultOptions.system,
				/**
				 * 为true时，使用前端的url,
				 * 为false时，使用后端的url,
				 */
				force: true,
				...opts
			};

			this.cancelXHR && this.cancelXHR();

			request({
				type: 'POST',
				param,
				useXHR: true,
				getInstance: ({ cancel }) => this.cancelXHR = cancel,
				...this.defaultOptions.signature,
			}).then((res) => {
				/**
				 * URL获取签名时产生了变更
				 * 此时如果url发生变更，肯定会导致签名失败; 
				 * 此方法执行也偶现签名失败场景（交由error管理）
				 * 另外此方法的成功后的一个弊端：有二维码的图片导致无法长按识别
				 *
				 * 其它：
				 * 验证场景还包含 `async: false`：概率性 + 无法长按识别
				 *
				 * 结论：
				 * iOS: _replace, 不过这边使用_signAgain（避免无线重载）
				 * Android: reset(这个会由重写replaceState管理)
				 *
				 * 以下为测试代码
				 * if (repeat && url !== encodeURL()) {
				 * 	this.cancelXHR = null;
				 * 	this._getConfig(opts, false)
				 * 		.then(resolve)
				 * 		.catch(reject);
				 * 		return;
				 * 	}
				 */
				if (Device.ios && url !== encodeURL()) {
					this._signAgain(`wx-error-replace: `, '签名过程中路由变化');
					return;
				}
				
				const { appId, timestamp, nonceStr, signature } = res.data;

				try {
					this.config({
						debug: false,
						appId,
						timestamp,
						nonceStr,
						signature,
						jsApiList: this.defaultOptions.jsApiList
					});
				} catch (e) {
					console.log(e, /error/);
				}

				resolve(pick(res.data, [
					'title',
					'desc',
					'link',
					'imgUrl',
					'force'
				]));

			}).catch((res) => {
				console.error(res);
				// 可能存在退出登录的情况
				res && res.status !== -1 && MToast.info({
					content: res.msg,
					duration: 0,
					maskClosable: false
				});
				reject(res);
			}).finally(() => {
				this.cancelXHR = null;
			});
		});
	}

	/**
	 * 1.5.0
	 * 苹果只需要配置一次
	 * 安卓需要每次设置
	 */
	reset = (opts = {}) => {
		this.hackSignCount = 0;
		let force = Device.android;
		
		(this.defaultOptions.reset || this.hideAllNonBaseMenuItem).call(this, {
			force
		});
	}

	/**
	 * title: 分享标题,
	 * desc: 分享页面描述,
	 * link: 分享链接,
	 * imgUrl: 图片链接
	 */
	share = async (opts = {}) => {
		let { title = '~', desc = '~', link, imgUrl, force } = opts;

		let { path, query } = URL.parse(link);

		query = {
			...query
		};

		query = this.defaultOptions.onBeforeShare(query) || query;

		delete query.token;
		delete query.setting;

		link = URL.merge({ path, query });
		link = /[a-zA-z]+:\/\/[^\s]*/.test(link)
			? link
			: `${location.origin}${link}`;

		/**
		 * update 安卓测试无效
		 * https://developers.weixin.qq.com/community/develop/doc/0004a43e368e58f69408f882f5a400
		 * https://developers.weixin.qq.com/community/develop/doc/0004449a2902d0fe1867fa73056c00
		 * https://developers.weixin.qq.com/community/develop/doc/000688d114c130e8cd67977485b800
		 */
		// let fns = ['updateAppMessageShareData', 'updateTimelineShareData'];
		let fns = [
			'onMenuShareAppMessage',
			'onMenuShareTimeline',
			'updateAppMessageShareData',
			'updateTimelineShareData'
		];

		fns.forEach((item) => {
			this[item]({
				title,
				desc,
				link,
				imgUrl,
				force,
				success: () => console.log(`设置成功${link}`),
				// fail: (msg) => console.log(msg, /失败的原因/),
				// cancel: () => MToast.info('您取消了操作'),
			});
		});

		this.show({
			force,
			menuList: [
				'menuItem:share:appMessage',
				'menuItem:share:timeline'
			]
		});
	}

	hide = (opts = {}) => {
		this.hideMenuItems({
			menuList: opts.menuList || this.defaultOptions.hideMenuList || this.defaultOptions.menuList,
			force: opts.force
		});
		return this;
	}

	show = (opts = {}) => {
		this.showMenuItems({
			menuList: opts.menuList || this.defaultOptions.showMenuList || this.defaultOptions.menuList,
			force: opts.force
		});
		return this;
	}

	/**
	 * 重新设置经纬度的Promise
	 * 用户可以重社设置timestamp(force = true), 获取新的Promise
	 * timestamp 单位秒
	 */
	resetLocation = (opts = {}) => {
		const { timestamp = 5, force = false } = opts;
		const { key = ['latitude', 'longitude'] } = this.defaultOptions.location || {};

		if (force || !this.location) {
			this.location = new Promise((resolve) => {
				let timer;

				const success = (res = {}) => {
					const { latitude, longitude } = res;

					timer && clearTimeout(timer);
					resolve({
						[key[0]]: latitude,
						[key[1]]: longitude
					});
				};

				const fail = () => {
					let errorMsg = `定位获取失败，请刷新之后再试`;
					// 如果错误了，扔需要使用resolve
					// MToast.error(errorMsg); // 产品要求不提示
					console.log(errorMsg);
					success();
				};

				timer = setTimeout(fail, timestamp * 1000);

				this.getLocation({ success, fail });
			});
		}

		return this.location;
	}
}
