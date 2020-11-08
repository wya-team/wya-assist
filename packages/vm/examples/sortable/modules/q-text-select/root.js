import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const QTextSelect = {
	module: "q-text-select",
	type: '基础',
	name: "文本选择题",
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
		
		title: '未命名的文本选择题',
		subhead: '',
		multiple: 0,
		required: 1,

		// 选项
		options: [],

		// 答案, 避免以后扩展
		answer: []
	},
	dataValidity: (res = {}) => {
		if (!res.title) {
			return '文本选择题标题不能为空';
		}

		if (res.options.length === 0) {
			return '文本选择题缺少选项';
		}

		for (let i; i <= res.options.length; i++) {
			if (!res.options[i].label) {
				return '文本选择题选项不能为空';
			}
		}
	}
};
