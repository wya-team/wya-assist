<template>
	<div class="vca-relation-chain-item">
		<div class="vca-relation-chain-item__top">
			<slot name="top" />
		</div>
		<div class="vca-relation-chain-item__content">
			<div class="vca-relation-chain-item__avatar--wrapper">
				<slot name="avatar">
					<div :style="avatarImage" class="vca-relation-chain-item__avatar" />
				</slot>
			</div>
			<div class="vca-relation-chain-item__line--wrapper">
				<slot name="onLine" />
				<div class="vca-relation-chain-item__line" />
				<div class="vca-relation-chain-item__underline">
					<slot name="underLine" />
				</div>
			</div>
		</div>
		<div class="vca-relation-chain-item__description">
			<slot name="description" />
		</div>
	</div>
</template>
<script>
export default {
	name: 'relation-chain',
	components: {
	},
	props: {
		avatar: String,
	},
	data() {
		return {
		
		};
	},
	computed: {
		defaultAvatar() {
			return this.$parent.defaultAvatar;
		},
		avatarImage() {
			return {
				backgroundImage: `url('${this.defaultAvatar}')`
			};
		}
	},
	mounted() {
	},
	methods: {

	}
};
</script>
<style lang="scss">

.vca-relation-chain-item{
	&:last-child {
		.vca-relation-chain-item__line {
			display: none;
		}
	}
	.vca-relation-chain-item__top, .vca-relation-chain-item__description {
		width: 100px;
		text-align: center;
		margin-left: -22px;
	}
	.vca-relation-chain-item__content {
		display: flex;
		align-items: center;
		.vca-relation-chain-item__avatar--wrapper {
			width: 56px;
			height: 56px;
			border-radius: 50%;
			overflow: hidden;
			.vca-relation-chain-item__avatar {
				width: 100%;
				height: 100%;
				background-size: cover;
				background-position: center;
			}
		}
	}
	.vca-relation-chain-item__line--wrapper {
		text-align: center;
		margin: 0px 9px 0 9px;
		position: relative;
		.vca-relation-chain-item__line {
			width: 153px;
			border-bottom: 1px solid #e8e8e8;
		}
		.vca-relation-chain-item__underline {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}
</style>
