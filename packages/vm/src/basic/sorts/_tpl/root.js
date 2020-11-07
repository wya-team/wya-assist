import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const TPL = {
	module: "TPL",
	type: '基础',
	name: "TPL",
	Viewer,
	Editor,
	max: '', // 最多存放元素
	insertion: '', // first/last/none 插入方式
	// 初始数据 data 或者 data 都可以
	data: {
		closeable: true,

		backgroundColor: '#fff',
		paddingVertical: 8,
		content: ''
	},
	dataValidity: (res = {}) => {
		return null;
	}
};
