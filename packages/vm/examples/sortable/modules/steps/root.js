import { Message } from '@wya/vc';
import Viewer from './viewer.vue';
import Editor from './editor.vue';

export const steps = {
	module: "steps",
	type: '基础',
	name: "分页",
	Viewer,
	Editor,
	max: '', // 最多存放元素
	insertion: (rowIndex, data) => {
		if (rowIndex <= 1) {
			Message.info('首个位置不能为分页');
			return false;
		}

		if ((data[rowIndex] && data[rowIndex].module === 'steps')
			|| (data[rowIndex - 1] && data[rowIndex - 1].module === 'steps')
		) {
			Message.info('不能存在连续的分页，请先添加其他内容');
			return false;
		}
		return true;
	},
	// 初始数据 data 或者 data 都可以
	data: {
		closeable: true,

		buttonBackgroundColor: '#87A3F7',
		paddingVertical: 40,
		paddingHorizontal: 0,
		borderRadius: 6,
		
		content: ''
	},
	dataValidity: (res = {}) => {
		return null;
	}
};
