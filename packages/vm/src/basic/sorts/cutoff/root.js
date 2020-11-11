import Viewer from './viewer.vue';
import Editor from './editor.vue';

const itemData = [
	{
		"image": '',
		"name": "实线"
	},
	{
		"image": '',
		"name": "虚线"
	}
];
export const cutoff = {
	module: "cutoff",
	type: '基础',
	name: "分割线",
	Viewer,
	Editor,
	max: '', // 最多存放元素
	insertion: '', // first/last/none 插入方式
	// 初始数据 data 或者 data 都可以
	data(index) {
		return {
			closeable: true,
			layout: index + 1,
			color: '#E8E8E8',
			backgroundColor: '#fff',
			paddingVertical: 0,
			paddingHorizontal: 0,
			borderRadius: 0,
		};
	},
	widgets: itemData,
	dataValidity: (res = {}) => {

		return null;
	}
};
