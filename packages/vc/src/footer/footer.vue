<template>
	<div
		:style="{
			'left': `${leftMenuWidth ? leftMenuWidth + 12 : 0}px`,
			'width': `calc(100% - ${(leftMenuWidth ? leftMenuWidth + 24 : 0) + assistWidth}px)`
		}"
		class="vca-footer"
	>
		<slot>
			<vc-button
				v-if="cancelText"
				class="vca-footer__cancel"
				type="default"
				@click="handleCancel"
			>
				{{ cancelText }}
			</vc-button>
			<vc-button
				v-if="okText"
				:disabled="okDisabled"
				type="primary"
				@click="handleOk"
			>
				{{ okText }}
			</vc-button>
		</slot>
	</div>
</template>
<script>
import Button from '@wya/vc/lib/button';

export default {
	name: 'vca-footer',
	components: {
		'vc-button': Button
	},
	props: {
		cancelText: {
			type: String,
			default: '取消',
		},
		okText: {
			type: String,
			default: '保存',
		},
		okDisabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			leftMenuWidth: 0,
			assistWidth: 0
		};
	},
	created() {
		if (!this.$vc) return;
		this.$vc.on('layout-left-menu', this.handleSetLeftDistance);
		this.$vc.on('layout-assist-change', this.handleSetAssistWidth);
	},
	mounted() {
		if (!this.$vc) return;
		// 让left-menu 再次告知它自己当前的宽度
		this.$vc.emit('layout-left-menu-emit-again', { emit: true });
	},
	destroyed() {
		if (!this.$vc) return;
		this.$vc.off('layout-left-menu', this.handleSetLeftDistance);
		this.$vc.off('layout-assist-change', this.handleSetAssistWidth);
	},
	methods: {
		handleSetLeftDistance({ distance }) {
			this.leftMenuWidth !== distance && (this.leftMenuWidth = distance);
		},
		handleSetAssistWidth({ width }) {
			this.assistWidth !== width && (this.assistWidth = width);
		},
		handleCancel(...rest) {
			let { cancel } = this.$listeners;
			
			return cancel ? cancel(...rest) : this.$emit('cancel', ...rest);			
			
		},
		handleOk(...rest) {
			let { ok } = this.$listeners;
			
			return ok ? ok(...rest) : this.$emit('ok', ...rest);	
		}
	}

};
</script>
<style lang="scss">
.vca-footer {
	position: fixed;
	bottom: 0;
	height: 56px;
	background-color: #FFF;
	z-index: 50;

	display: flex;
	justify-content: center;
	align-items: center;

	box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.08) !important;

	&__cancel {
		margin-right: 12px;
	}
}
</style>
