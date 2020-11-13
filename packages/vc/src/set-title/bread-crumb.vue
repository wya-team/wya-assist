<!-- 集成业务的面包屑，暂不考虑抽离 -->
<template>
	<div :style="{ left: `${leftW}px` }" class="vca-bread-crumb">
		<div 
			v-for="(route, index) in routes"
			:key="index"
		>
			<span 
				:class="index === routes.length - 1 ? 'vca-bread-crumb__black' : route.path && 'vca-bread-crumb__link'"
				@click="route.path && $router.push(route.path)"
			>
				{{ route.name }}
			</span>
			<span v-if="index < routes.length - 1" class="vca-bread-crumb__divider">/</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'vca-bread-crumb',
	props: {
		routes: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			leftW: 0
		};
	},
	created() {
		this.$vc.on('layout-left-menu', this.handleResize);
	},
	mounted() {
		// 让left-menu 再次告知它自己当前的宽度
		this.$vc.emit('layout-top-menu', { distance: 55 });
		this.$vc.emit('layout-left-menu-emit-again', { emit: true });
	},
	destroyed() {
		this.$vc.off('layout-left-menu', this.handleResize);
	},
	methods: {
		handleResize({ distance }) {
			this.leftW !== distance && (this.leftW = distance);
		}
	}
};
</script>

<style lang="scss">
.vca-bread-crumb {
	position: fixed;
	top: 0px;
	right: 0;
	z-index: 999;
	background-color: #ffffff;
	padding: 0 15px;
	border-bottom: 1px solid #d9d9d9;
	height: 56px;
	font-size: 14px;
	display: flex;
	align-items: center;
	&__link {
		color: #676767;
		cursor: pointer;
		&:hover {
			color: #5495f6;
		}
	}
	&__divider {
		margin: 0 6px;
	}

	&__black {
		color: #000; 
	}
}
</style>


