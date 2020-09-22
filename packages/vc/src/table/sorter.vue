<template>
	<div
		class="vca-table-sorter"
		@click="handleToggle"
	>
		<div class="vca-table-sorter__label">
			<slot />
		</div>
		<div class="vca-table-sorter__wrapper">
			<span
				:class="{'is-active': statusIndex === 1}"
				class="vca-table-sorter__caret is-ascending"
				@click.stop="handleCaretClick(1)"
			/>
			<span
				:class="{'is-active': statusIndex === 2}"
				class="vca-table-sorter__caret is-descending"
				@click.stop="handleCaretClick(2)"
			/>
		</div>
	</div>
</template>

<script>

const statusList = ['unsort', 'ascending', 'descending'];

export default {
	name: 'vca-table-sorter',
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: String,
			default: 'unsort',
			validator(value) {
				return statusList.includes(value);
			}
		}
	},
	computed: {
		statusIndex: {
			get() {
				return statusList.indexOf(this.value);
			},
			set(value) {
				this.$emit('change', statusList[value]);
			}
		}
	},
	methods: {
		handleToggle() {
			this.statusIndex = this.statusIndex >= 2 ? 0 : this.statusIndex + 1;
		},
		handleCaretClick(index) {
			this.statusIndex = this.statusIndex === index ? 0 : index;
		}
	}
};
</script>

<style lang="scss">
.vca-table-sorter {
	padding: 0 !important;
	display: flex !important;
	align-items: center;
	line-height: 23px !important;
	cursor: pointer;

	.vca-table-sorter__label {
		padding: 0;
		line-height: inherit !important;
	}
	.vca-table-sorter__wrapper {
		position: relative;
		width: 12px;
		height: 20px;
	}
	.vca-table-sorter__caret {
		width: 0;
		height: 0;
		border: 5px solid transparent;
		position: absolute;
		left: 9px;
		&.is-ascending {
			border-bottom-color: #666;
			top: -2px;
			&.is-active {
				border-bottom-color:  #5495f6;
			}
		}
		&.is-descending {
			border-top-color: #666;
			bottom: 0px;
			&.is-active {
				border-top-color:  #5495f6;
			}
		}
	}
	
}
</style>
