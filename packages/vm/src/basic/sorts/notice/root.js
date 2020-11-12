import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const notice = (opts = {}) => {
	const { defaultData, ...restAsOptions } = opts;
	return {
		module: "notice",
		type: '基础',
		name: "公告",
		Viewer,
		Editor,
		max: '', // 最多存放元素
		insertion: '', // first/last/none 插入方式
		// 初始数据 data 或者 data 都可以
		data: {
			closeable: true,
			color: '#333',
			backgroundColor: '#fff',
			paddingVertical: 0,
			paddingHorizontal: 0,
			content: '', // 公告内容
			...defaultData
		},
		dataValidity: (res = {}) => {
			if (!res.content.length) {
				return {
					error: "公告内容必填"
				};
			}
			return null;
		},
		...restAsOptions
	};
};
