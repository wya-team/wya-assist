export { default as SectionTitle } from './section-title';
export { default as Footer } from './footer';
export { default as Table } from './table';

export default {
	install(Vue, opts) {
		Vue.component(SectionTitle.name, SectionTitle);
		Vue.component(Footer.name, Footer);
		Vue.component(Table.Filter.name, Table.Filter);
		Vue.component(Table.Sorter.name, Table.Sorter);
	}
};