<template>
	<div class="vm-basic-page-viewer" />
</template>

<script>
export default {
	name: 'vm-basic-page-viewer',
	inheritAttrs: false,
	props: {
		id: String,
		title: Object,
		backgroundColor: String,
		backgroundType: Number,
		backgroundImage: {
			type: Array,
			default: () => []
		},
		vm: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			page: null
		};
	},
	watch: {
		backgroundType: {
			handler(val) {
				this.getPage().then(() => {
					if (val == 1) {
						this.page && (this.page.style.backgroundImage = 'none');
						this.page && (this.page.style.backgroundColor = this.backgroundColor);
					} else {
						this.page && (this.page.style.backgroundColor = 'transparent');
						this.page && (this.page.style.backgroundImage = `url('${this.backgroundImage[0]}')`);
						this.page && (this.page.style.backgroundRepeat = `no-repeat`);
						this.page && (this.page.style.backgroundSize = `cover`);
					}
				});
			},
			immediate: true
		},
		backgroundColor: {
			handler(val, oldVal) {
				this.getPage().then(() => {
					this.page && (this.page.style.backgroundColor = val);
				});
			},
			immediate: true
		},
		backgroundImage: {
			handler(val) {
				this.getPage().then((res) => {
					this.page && (this.page.style.backgroundImage = `url('${val[0]}')`);
				});
			},
			immediate: true
		},
	},
	created() {
	},
	mounted() {
		this.getPage();
	},
	methods: {
		getPage() {
			return new Promise((resolve, reject) => {
				if (!this.page) {
					if (this.vm.type === 'frame') { // 所有页面编辑状态
						this.page = document.querySelector('.vm-frame-sortable__wrapper');
					} else { // 覆盖页展示及预览状态
						this.page = document.querySelector('.vm-assist-preview');
					}
				}
				resolve();
			});

		}
	},
};
</script>

<style lang="scss">
@import "../../../style/index.scss";
$block: vm-basic-page-viewer;

@include block($block) {
	width: 100%;
	height: 100%;
}

</style>
