class Manager {
	constructor() {
		this.hasInit = false;
		this.config = {};
	}

	/**
	 * 初始化配置全局
	 */
	init(opts = {}) {
		if (!this.hasInit) {
			this.config = opts;
		} else {
			throw new Error('@wya/assist-vc: instance 只能初始化一次');
		}
		return this;
	}
}

export default Manager;