import { pick, values } from 'lodash';
import mixins from './mixins';

export default {
	// filters: (needs) => pick(filters, needs || Object.keys(filters)),
	// directives: (needs) => pick(directives, needs || Object.keys(directives)),
	mixins: (needs) => values(pick(mixins, needs || Object.keys(mixins))),
};