import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const QImgsPicker = {
	module: "q-imgs-picker",
	type: '基础',
	name: "图片题",
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

		title: '未命名的图片题',
		subhead: '',
		required: 1,

		// 答案, 避免以后扩展
		answer: []
	},
	dataValidity: (res = {}) => {
		if (!res.title) {
			return '图片题标题必填';
		}
	}
};
