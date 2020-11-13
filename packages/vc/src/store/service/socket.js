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
			onConnect,
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
							// 链接成功后回调，用于绑定信息
							socket.on('connect', (res) => {
								const { data = {} } = res.data || {};
								onConnect && onConnect(data, this);
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