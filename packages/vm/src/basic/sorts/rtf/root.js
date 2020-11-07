import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const rtf = {
	module: "rtf",
	type: '基础',
	name: "富文本",
	Viewer,
	Editor,
	max: '', // 最多存放元素
	insertion: '', // first/last/none 插入方式
	// 初始数据 data 或者 data 都可以
	data: {
		closeable: true,

		backgroundColor: '#fff',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		
		content: ''
	},
	dataValidity: (res = {}) => {
		if (!res.content) {
			return '富文本内容不能为空';
		}
	}
};
