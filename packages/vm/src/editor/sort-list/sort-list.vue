<template>
	<div v-if="dataSource.length > 0" class="vm-editor-sort-list">
		<div
			v-for="(item,i) in dataSource"
			:key="i"
			class="vm-editor-sort-list__content"
		>
			<p>{{ item.label }}</p>
			<div class="vm-editor-sort-list__select">
				<vm-editor-radio
					v-model="item.show"
					:data-source="showList"
				/>
			</div>
			<div class="vm-editor-sort-list__form">
				<vc-input
					v-model="item.name"
					:maxlength="maxLength"
					:indicator="indicator"
					:bytes="item.bytes"
					placeholder="为空展示默认文案"
					class="vm-editor-sort-list__item"
				/>
				<div class="vm-editor-sort-list__sort-icon">
					<vcm-icon
						v-if="i !== 0"
						type="triangle-up"
						@click="handleSort(i,true)"
					/>
					<vcm-icon
						v-if="i !== dataSource.length -1"
						type="triangle-down"
						@click="handleSort(i)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Input from '@wya/vc/lib/input/index.m';
import Icon from '@wya/vc/lib/icon';

import Radio from '../radio';

export default {
	name: 'vm-editor-sort-list',
	components: {
		'vc-input': Input,
		'vcm-icon': Icon,
		'vm-editor-radio': Radio
	},
	props: {
		dataSource: {
			type: Array,
			default: () => []
		},
		maxLength: {
			type: Number,
			default: 6
		}
	},
	data() {
		return {
			indicator: {
				inline: true,
			},
			showList: [
				{
					label: '显示',
					value: 1
				},
				{
					label: '隐藏',
					value: 0
				}
			]
		};
	},
	computed: {

	},
	watch: {
		dataSource: {
			handler(val) {
				this.$emit('change', val);
			},
			deep: true
		}
	},
	methods: {
		handleSort(i, isUp) {
			let changeIndex = isUp ? i - 1 : i + 1;
			this.dataSource.splice(i, 1, ...this.dataSource.splice(changeIndex, 1, this.dataSource[i]));
		}
	},

};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-sort-list;
$c51: #515151;
@include block($block) {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	@include element(content) {
		margin-bottom: 12px;
		>p {
			font-size: 12px;
			color: $c51;
			line-height: 22px;
		}
		@include element(select) {
			margin-top: 6px;
		}
		@include element(form) {
			margin-top: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			@include element(item) {
				width: 240px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 4px;
				padding: 2px;
				font-size: 12px;
				color: #333;
			}
			@include element(sort-icon) {
				padding: 0 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
			}
		}

	}

}
</style>
