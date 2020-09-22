import SectionTitle from './section-title';
import Footer from './footer';
import Table from './table';

export {
	SectionTitle,
	Footer,
	Table
};

export default {
	install(Vue, opts) {
		Vue.component(SectionTitle.name, SectionTitle);
		Vue.component(Footer.name, Footer);
		
		Vue.component(Table.Filter.name, Table.Filter);
		Vue.component(Table.Sorter.name, Table.Sorter);
		Vue.component(Table.Operate.name, Table.Operate);
	}
};