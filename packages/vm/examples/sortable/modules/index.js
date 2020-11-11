import { pick } from 'lodash';

import { basicSorts } from '../../../src/index';

import { nav } from './nav/root';
import { steps } from './steps/root';

// 确保题目以q-开头，方便计算
import { QImgsPicker } from './q-imgs-picker/root';
import { QImgsSelect } from './q-imgs-select/root';
import { QTextInput } from './q-text-input/root';
import { QTextSelect } from './q-text-select/root';

export const defaultModules = {
	...basicSorts.getModules([
		'page', 
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
	[QImgsPicker.module]: QImgsPicker
};

