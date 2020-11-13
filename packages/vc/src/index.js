import SectionTitle from './section-title';
import Footer from './footer';
import Table from './table';
import Gallery from './gallery';
import Link from './link';
import VcaInstance from './vca';
import Store from './store';
import Extends from './extends';

export {
	Store,
	Extends,

	// 组件
	SectionTitle,
	Footer,
	Table,
	Gallery,
	Link
};

export default {
	install(Vue, opts) {
		Vue.prototype.$vca = VcaInstance.init(opts);

		// - 全局components, mixins开发者自行注入
		Vue.component(SectionTitle.name, SectionTitle);
		Vue.component(Footer.name, Footer);
		Vue.component(Link.name, Link);
		
		Vue.component(Table.Filter.name, Table.Filter);
		Vue.component(Table.Sorter.name, Table.Sorter);
		Vue.component(Table.Operate.name, Table.Operate);
	}
};