import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const QImgsSelect = {
	module: "q-imgs-select",
	type: '基础',
	name: "图片选择题",
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
		
		layout: 1, // 1单列，2多列
		title: '未命名的图片选择题',
		subhead: '',
		multiple: 0,
		required: 1,

		// 题目选项
		options: [],

		// 答案, 避免以后扩展
		answer: []
	},
	dataValidity: (res = {}) => {
		if (!res.title) {
			return '图片选择题标题不能为空';
		}

		if (res.options.length === 0) {
			return '图片选择题缺少选项';
		}

		for (let i; i <= res.options.length; i++) {
			if (!res.options[i].image || !res.options[i].image[0]) {
				return '图片选择题选项图片不能为空';
			}
		}
	}
};
