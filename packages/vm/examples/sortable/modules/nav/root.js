import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const nav = {
	module: "nav",
	type: '基础',
	name: "阶段导航",
	Viewer,
	Editor,
	max: '', // 最多存放元素
	insertion: '', // first/last/none 插入方式
	// 初始数据 data 或者 data 都可以
	data: {
		closeable: true,

		backgroundColor: '#fff',
		backgroundType: 1,
		backgroundImage: [],
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		icon: [],
		title: '阶段1：未命名导航',
		subhead: '共xx题'
	},
	dataValidity: (res = {}) => {
		if (!res.title) {
			return '阶段导航标题不能为空';
		}
	}
};
