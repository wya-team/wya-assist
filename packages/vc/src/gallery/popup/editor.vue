
<template>
	<vc-modal
		v-model="isVisible"
		:closable="true"
		:mask-closable="false"
		size="small"
		class="vca-gallery-editor"
	>
		<template #header>
			<div class="vca-gallery-editor__header">
				<div>{{ title }}</div>
				<div @click="handleClose">
					<vc-icon type="close" />
				</div>
			</div>
		</template>
		<vc-input
			ref="input"
			v-model="name"
			:placeholder="placeholder"
			:maxlength="maxlength"
			clearable
			autofocus
			class="vca-gallery-editor__input"
			@enter="handleConfirm"
		/>
		<template #footer>
			<vc-button
				class="vca-gallery-editor__reset-btn"
				@click="handleReset"
			>
				{{ cancelText }}
			</vc-button>
			<vc-button 
				type="primary" 
				class="vca-gallery-editor__confirm-btn"
				@click="handleConfirm"
			>
				{{ okText }}
			</vc-button>
		</template>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Input from '@wya/vc/lib/input';
import Icon from '@wya/vc/lib/icon';
import Button from '@wya/vc/lib/button';


const wrapperComponent = {
	name: 'vca-gallery-editor',
	components: {
		'vc-modal': Modal,
		'vc-input': Input,
		'vc-button': Button,
		'vc-icon': Icon
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		originalText: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: '请填写'
		},
		cancelText: {
			type: String,
			default: '恢复默认'
		},
		okText: {
			type: String,
			default: '保存'
		},
		maxlength: {
			type: Number,
			default: Number.MAX_SAFE_INTEGER
		}
	},
	data() {
		return {
			isVisible: false,
			name: this.originalText
		};
	},
	mounted() {
		this.isVisible = true;
		
		this.$refs.input && this.$refs.input.focus();
	},
	methods: {
		handleClose() {
			this.isVisible = false;
			this.$emit('close');
		},
		handleConfirm() {
			this.isVisible = false;
			this.$emit('sure', { inputValue: this.name });
		},
		handleReset() {
			this.name = this.originalText;
			this.$refs.input.focus();
		}
	}
};

export default wrapperComponent;
export const Editor = new Portal(wrapperComponent, {});
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/index.scss";

$block: vca-gallery-editor;

@include block($block) {
	@include element(header) {
		width: 100%;
		display: flex;;
		justify-content: space-between;
	}

	@include element(reset-btn) {
		margin-right: 12px;
	}

	@include element(input) {
		margin-top: 60px;
	}

	.vc-modal__mask {
		z-index: 1002;
	}

	.vc-modal__content {
		padding: 14px 24px;
	}
}
</style>
