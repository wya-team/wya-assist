import Store from './store';
import Extends from './extends';

import SetTitle from './set-title';
import SectionTitle from './section-title';
import Footer from './footer';
import Table from './table';
import Gallery from './gallery';
import Link from './link';
import VcaInstance from './vca';
import RelationChain from './relation-chain';
import EditableText from './editable-text';
import SelectArea from './select-area';
import Map from './map';
import VerifySlider from './verify-slider';

export {
	Store,
	Extends,

	// 组件
	SetTitle,
	SectionTitle,
	Footer,
	Table,
	Gallery,
	Link,
	RelationChain,
	EditableText,
	SelectArea,
	Map,
	VerifySlider
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
			EditableText,
			Table.Filter,
			Table.Sorter,
			Table.Operate,
			Table.Select,
			RelationChain,
			RelationChain.Item,
			Map,
			VerifySlider
		].forEach(comp => {
			const { name, aliasName } = comp;

			if (
				ignoreComponents.includes(name)
				|| ignoreComponents.includes(name.replace(/^vca-/g, ''))
				|| ignoreComponents.includes(comp)
			) {
				return;
			}

			Vue.component(name, comp);
			aliasName && Vue.component(aliasName, comp);
		});
	}
};