import { generatePicker } from '../../utils';

import layoutStyle from './layout-style';
import rebuildIndex from './rebuild-index';

const mixins = {
	'layout-style': layoutStyle,
	'rebuild-index': rebuildIndex
};

export default generatePicker(mixins);