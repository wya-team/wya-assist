<template>
	<div class="vca-table-operate">
		<div v-if="dataSource.length > 0" class="vca-table-operate__wrapper">
			<vc-popconfirm
				v-if="dataSource[0][message]"
				:title="dataSource[0][message]"
				@ok="handleOk(dataSource[0])"
				@cancel="handleCancel(dataSource[0])"
			>
				<span class="vca-table-operate__text">
					{{ dataSource[0][label] }}
				</span>
			</vc-popconfirm>
			<span
				v-else
				class="vca-table-operate__text"
				@click="handleOk(dataSource[0])"
				v-text="dataSource[0][label]"
			/>
			<vc-divider
				v-if="dataSource.length > 1"
				vertical
			/>
			<template v-if="dataSource.length === 2">
				<vc-popconfirm
					v-if="dataSource[1][message]"
					:title="dataSource[1][message]"
					@ok="handleOk(dataSource[1])"
					@cancel="handleCancel(dataSource[1])"
				>
					<span class="vca-table-operate__text">
						{{ dataSource[1][label] }}
					</span>
				</vc-popconfirm>
				<span
					v-else
					class="vca-table-operate__text is-inline"
					@click="handleOk(dataSource[1])"
					v-text="dataSource[1][label]"
				/>
			</template>
			<vc-dropdown
				v-else-if="dataSource.length > 2"
				class=""
				portal-class-name="vca-drop-down"
				placement="bottom-right"
			>
				<div class="vca-table-operate__text">
					<span>更多</span>
					<vc-icon 
						type="down" 
						style="margin-bottom: 2px; transform: scale(0.8)" 
					/>
				</div>
				<vc-dropdown-menu slot="list">
					<template v-for="(item, i) of dataSource.slice(1)">
						<vc-popconfirm
							v-if="item[message]"
							:key="i"
							:portal="false"
							:title="item[message]"
							tag="li" 
							class="vc-dropdown-item"
							placement="right"
							@ok="handleOk(dataSource[1])"
							@cancel="handleCancel(dataSource[1])"
						>
							<span>{{ item[label] }}</span>
						</vc-popconfirm>
						<vc-dropdown-item
							v-else
							:key="i"
							align="left"
							@click="handleOk(item)"
							v-text="item[label]"
						/>
					</template>
				</vc-dropdown-menu>
			</vc-dropdown>
		</div>
	</div>
</template>
<script>
import Dropdown from '@wya/vc/lib/dropdown';
import Popconfirm from '@wya/vc/lib/popconfirm';
import Icon from '@wya/vc/lib/icon';
import Divider from '@wya/vc/lib/divider';

export default {
	name: 'vca-table-operate',
	components: {
		'vc-dropdown': Dropdown,
		'vc-dropdown-menu': Dropdown.Menu,
		'vc-dropdown-item': Dropdown.Item,
		'vc-icon': Icon,
		'vc-divider': Divider,
		'vc-popconfirm': Popconfirm,
	},
	props: {
		dataSource: Array,
		dataSourceKey: {
			type: Object,
			default: () => {
				return {
					message: 'message',
					label: 'label',
					children: 'children'
				};
			}
		},
	},
	computed: {
		message() {
			return this.dataSourceKey.message;
		},
		label() {
			return this.dataSourceKey.label;
		}
	},
	methods: {
		handleOk(item) {
			const { label } = this;
			this.$emit('click', item[label], item);
			this.$emit('ok', item[label], item);
		},
		handleCancel(item) {
			const { label } = this;
			this.$emit('cancel', item[label], item);
		}
	},
};
</script>
<style lang="scss">
.vca-table-operate {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.vca-table-operate__wrapper {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.vca-table-operate__text {
	color: #5495f6;
	cursor: pointer;
	&.is-inline {
		display: inline-block;
		text-align: right;
	}
}
</style>
