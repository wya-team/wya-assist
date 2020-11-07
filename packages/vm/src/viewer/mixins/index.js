import { pick, values } from 'lodash';
import layoutStyle from './layout-style';
import qIndex from './q-index';

let mixins = {
	'layout-style': layoutStyle,
	'q-index': qIndex
};

export default (needs) => values(pick(mixins, needs || Object.keys(mixins)));