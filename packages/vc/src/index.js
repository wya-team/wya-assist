import SectionTitle from './section-title';
import Footer from './footer';
import Table from './table';
import Timeline from './timeline';

export {
	SectionTitle,
	Footer,
	Table,
	Timeline
};

export default {
	install(Vue, opts) {
		Vue.component(SectionTitle.name, SectionTitle);
		Vue.component(Footer.name, Footer);
		Vue.component(Table.Filter.name, Table.Filter);
		Vue.component(Table.Sorter.name, Table.Sorter);

		Vue.component(Timeline.name, Timeline);
		Vue.component(Timeline.Item.name, Timeline.Item);
	}
};