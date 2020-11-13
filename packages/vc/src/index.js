import Store from './store';
import Extends from './extends';

import SetTitle from './set-title';
import SectionTitle from './section-title';
import Footer from './footer';
import Table from './table';
import Gallery from './gallery';
import Link from './link';
import VcaInstance from './vca';

export {
	Store,
	Extends,

	// 组件
	SetTitle,
	SectionTitle,
	Footer,
	Table,
	Gallery,
	Link
};

export default {
	install(Vue, opts = {}) {
		const { ignoreComponents = [], ...rest } = opts;
		Vue.prototype.$vca = VcaInstance.init(rest);

		// Store, Extends不考虑全局注册
		[
			SetTitle,
			SectionTitle,
			Footer,
			Link,
			Table.Filter,
			Table.Sorter,
			Table.Operate
		].forEach(comp => {
			const { name } = comp;

			if (
				ignoreComponents.includes(name)
				|| ignoreComponents.includes(name.replace(/^vca-/g, ''))
				|| ignoreComponents.includes(comp)
			) {
				return;
			}

			Vue.component(name, comp);
		});
	}
};