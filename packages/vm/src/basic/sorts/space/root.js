import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const space = (opts = {}) => {
	const { defaultData, ...restAsOptions } = opts;
	return {
		module: "space",
		type: '基础',
		name: "辅助空白",
		Viewer,
		Editor,
		max: '', // 最多存放元素
		insertion: '', // first/last/none 插入方式
		// 初始数据 data 或者 data 都可以
		data() {
			return {
				closeable: true,
				backgroundColor: '#ffffff',
				height: 22,
				...defaultData
			};
		},
		dataValidity: (res = {}) => {
			return null;
		},
		...restAsOptions
	};
};
