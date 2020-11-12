import Manager from './manager';


/**
 * 组件内部调用
 */
export const VcaInstance = new Manager();


/**
 * 注册使用
 */
export default {
	install(Vue, opts = {}) {
		Vue.prototype.$vca = VcaInstance.init(opts);
	},
	instance: VcaInstance
};
