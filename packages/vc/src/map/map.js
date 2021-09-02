import MapManager from './map-manager';

export default {
	name: "vca-map",
	props: {
		id: {
			type: String,
			required: true
		},
		tag: {
			type: [String, Object, Function],
			default: 'div'
		},
		mapOpts: {
			type: Object
		},
		ui: {
			type: Boolean,
			default: false
		}
	},
	mounted() {
		this.mapManager = new MapManager({
			el: this.id,
			ui: this.ui,
			...this.mapOpts
		});
		
		this.mapManager.ready(() => {
			this.$emit('ready', this.mapManager);
		});
		
	},
	render(h) {
		return h(this.tag, {
			attrs: {
				id: this.id
			},
			ref: 'map'
		}, this.$slots.default);
	}
};


