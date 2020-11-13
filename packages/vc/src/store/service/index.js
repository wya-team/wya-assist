import Base from './base';
import Socket from './socket';
import Store from './store';

export default {
	createStore: Store.create,
	createSocket: Socket.create,
	clear: (new Base()).clear
};