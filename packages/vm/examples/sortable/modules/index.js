import { pick } from 'lodash';

import { Sorts } from '../../../src/index';

import { nav } from './nav/root';
import { steps } from './steps/root';

// 以q-开头，可以用rebuildIndex重新计算当前的index值类型排序
import { QImgsPicker } from './q-imgs-picker/root';
import { QImgsSelect } from './q-imgs-select/root';
import { QTextInput } from './q-text-input/root';
import { QTextSelect } from './q-text-select/root';

// 实例代码
import { area } from './area/root';
import { array } from './array/root';
import { tpl } from './tpl/root';

export const defaultModules = {
	...Sorts.getModules([
		'page',
		'space', 
		'cutoff',
		'notice',
		{ 
			name: 'rtf',
			// 初始化data中的值
			defaultData: {
				paddingVertical: 6,
				paddingHorizontal: 12,
				borderRadius: 8,
			},
		}
	]),
	steps,
	nav,
	[QTextSelect.module]: QTextSelect,
	[QImgsSelect.module]: QImgsSelect,
	[QTextInput.module]: QTextInput,
	[QImgsPicker.module]: QImgsPicker,

	area,
	array,
	tpl
};

