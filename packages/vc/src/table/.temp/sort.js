
import Vue from 'vue';

import '@wya/vc/lib/vc.min.css';

import App from '../sort';

Vue.config.devtools = true;

const app = new Vue({
	el: "#pages",
	components: { App },
	template: '<App />'
});

window.app = app;