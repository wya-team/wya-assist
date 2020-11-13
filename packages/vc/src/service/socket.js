import { Socket } from '@wya/socket';
import Message from '@wya/vc/lib/message';
import Base from './base';

class SocketService extends Base {
	constructor() {
		super();
		this.create = this.create.bind(this);
	}

	create(defaultOptions = {}) {
		const {
			key,
			url,
			bindUrl,
			param = {},
			getParam = (instance) => ({}),
			getConnect = (v, instance) => v,
			isNeedDestroy = true,
			parser
		} = defaultOptions;

		let socket;
		// clear
		this._add(() => {
			socket && socket.close();
			socket = undefined;
		});

		return {
			[key]: (userOptions = {}) => {
				return {
					data() {
						return {};
					},
					created() {
						this[key] = socket || this.initWebSocket();
					},
					methods: {
						initWebSocket() {
							socket = new Socket({ parser });
							socket.connect(
								getConnect(url, this),
								{ 
									onError: (err) => { 
										if (err.msg) {
											Message.error(err.msg);
										}
									} 
								}
							);
							// 链接成功后获取client_id
							bindUrl && socket.on('connect', (res) => {
								const { data = {} } = res.data || {};
								this.$request({
									url: bindUrl,
									type: 'GET',
									param: {
										...data,
										...param,
										...getParam(this)
									},
								}).then((res) => { // eslint-disable-line
									// todo
								}).catch((error) => {
									// Message.error(error.msg);
								});
								// 绑定id，后端要求
							});

							// 存储
							return socket;
						},
					},
					beforeDestroy() {
						isNeedDestroy && socket && socket.close();
						isNeedDestroy && (socket = undefined);
					}
				};
			}
		};
	}
}

export default new SocketService();