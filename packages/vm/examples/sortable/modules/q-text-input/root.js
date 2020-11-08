import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const QTextInput = {
	module: "q-text-input",
	type: '基础',
	name: "文本题",
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
		
		title: '未命名的文字题',
		subhead: '',
		multiple: 1, // 多行 / 单行
		required: 1,

		// 答案, 避免以后扩展
		answer: []
	},
	dataValidity: (res = {}) => {
		if (!res.title) {
			return '文字题标题不能为空';
		}
	}
};
