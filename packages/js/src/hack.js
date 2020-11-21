/**
 * 专门处理微信端相关兼容问题
 */
import { Device, Load } from '@wya/utils';

/**
 * 暂时先有公共的管理，后期考虑每个项目中单独拥有
 */
export default class Hack {
	constructor(options = {}) {
		this.defaultOptions = options;

		this.inputTextType = /^(text|password|number|tel|url|email|search)$/; // 可输入的input类型
		this._initHackScroll();
		this._appendSpaceEl();

		this._removeImgDefaultEvent();
	}
	
	/**
	 * 弹窗输入框后无法操作页面
	 * 键盘高度的影响
	 * 苹果设备，安卓设备（部分）
	 */
	_initHackScroll() {
		if (!Device.wechat || !Device.wechatVersion >= '6.7.4') return;
		document.addEventListener('click', async (e) => {
			let element = await this._getActiveElement();
			if (!element) return;
			element.addEventListener('blur', this.handleFn);
		}, true);
	}

	_appendSpaceEl() {
		if (Device.ios && Device.osVersion >= '13') {
			this.hackView = document.querySelector('#ios-hack-view');
			if (!this.hackView) {
				this.hackView = document.createElement('div');
				this.hackView.id = 'ios-hack-view';
				document.body.appendChild(this.hackView);
			}
		}
	}

	/**
	 * 去除3D touch
	 */
	_removeImgDefaultEvent() {
		if (Device.wechat && Device.ios) {
			Load.cssCode('img { -webkit-touch-callout: none;}', { id: '#ios-hack-img' });
		}
	}

	handleFn = (e) => {
		setTimeout(async () => {
			document.body.scrollTop = document.body.scrollTop + 0; // eslint-disable-line
			this.hackView && this.hackView.scrollIntoView(); // hack ios13
			// hack等待焦点已被获取后，在拿activeElement
			let element = await this._getActiveElement();
			element && element.click();
			e.target.removeEventListener('blur', this.handleFn);
		}, 0);
	}

	_getActiveElement = (e) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let element = document.activeElement;
				let canEditor = Boolean(element.getAttribute('contenteditable'));
				if (canEditor || (/^INPUT$/.test(element.nodeName) && this.inputTextType.test(element.type)) 
				|| /^TEXTAREA$/.test(element.nodeName)) {
					resolve(element);
				} else {
					resolve();
				}
			}, 100);
		});
	}
}
