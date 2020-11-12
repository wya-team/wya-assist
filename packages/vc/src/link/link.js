import { VcaInstance } from '../vca/index';

const ENV_IS_DEV = process.env.NODE_ENV === 'development';

export default {
	name: 'vca-link',
	inheritAttrs: false,
	props: {
		to: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		enhancer: {
			type: [Function, Boolean],
			default: false
		},
	},
	data() {
		return {
			regex: new RegExp(`^${this.$router.options.base}`)
		};
	},
	computed: {
		rebuildTo() {
			let url = this.to || '';
			let path = ENV_IS_DEV
				? `/${url.split('/').slice(2).join('/')}`
				: url.replace(this.regex, '/');

			return path;
		},
		isCross() {
			return !this.regex.test(this.to);
		}
	},
	beforeCreate() {
		this.regex = new RegExp(`^${this.$router.options.base}`);
	},
	methods: {
		handleClick(e) {
			const { $listeners: { click } } = this;

			// 增强
			if (this.enhancer === true || typeof this.enhancer === 'function') {
				let { enhancer } = VcaInstance.config.Link || {};

				enhancer = typeof this.enhancer === 'function'
					? this.enhancer
					: enhancer;

				if (enhancer) {
					enhancer(e, this);
					return;
				}
			}

			if (this.disabled && this.$Message) {
				this.$Message.info('当前模式不支持跳转');
				return;
			}

			let callback = () => {
				// 额外处理
				if (this.isCross && this.to) {
					window.location.href = this.to;
				} else {
					this.$router.push(this.rebuildTo);
				}
			};

			let fn = click && click(e, callback);

			if (fn && fn.then) {
				return fn.then((res) => {
					callback();
					return res;
				}).catch((res) => {
					return Promise.reject(res);
				});
			} else if (!fn) {
				callback();
			}
		}
	},
	render(h) {
		let tag = 'a';

		let params = {
			attrs: this.$attrs,
			props: {
				to: this.rebuildTo,
				...this.$attrs
			},
			on: {
				...this.$listeners,
				click: this.handleClick
			}
		};
		return h(tag, params, this.$slots.default);
	}
};
