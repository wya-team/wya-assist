<template>
	<div v-if="dataSource.length > 0" class="vca-table-operate">
		<template v-for="(item, index) in beforeItems">
			<vca-table-operate-item 
				:key="item.label"
				:info="item"
				@ok="handleOk(item)"
				@cancel="handleCancel(item)"
			/>
			<vc-divider
				v-if="index < beforeItems.length - 1 || dataSource.length > outgoingCount"
				:key="index"
				vertical
			/>
		</template>
			
		<vc-dropdown
			v-if="dataSource.length > outgoingCount"
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
			<template #list>
				<vc-dropdown-menu>
					<template v-for="(item, i) of dataSource.slice(outgoingCount)">
						<!-- 带操作确认的操作项 -->
						<vc-popconfirm
							v-if="item.message && !item.disabled"
							:key="i"
							:portal="false"
							:title="item.message"
							tag="li" 
							class="vc-dropdown-item"
							placement="right"
							@ok="handleOk(item)"
							@cancel="handleCancel(item)"
						>
							<!-- 带悬浮提示的 -->
							<vc-popover
								v-if="item.tip"
								:content="item.tip"
								:portal="false"
								placement="top"
								theme="dark"
								tag="div"
							>
								<span>{{ item.label }}</span>
							</vc-popover>
							<!-- 无悬浮提示的 -->
							<div v-else v-text="item.label" />
						</vc-popconfirm>

						<!-- 带悬浮提示的操作项 -->
						<vc-popover
							v-else-if="item.tip"
							:key="i"
							:content="item.tip"
							:portal="false"
							class="vca-table-operate__item is-tip"
							placement="top"
							theme="dark"
							tag="li"
						>
							<div 
								class="vc-dropdown-item"
								:class="{ 'is-disabled': item.disabled }"
								@click="handleOk(item)"
								v-text="item.label"
							/>
						</vc-popover>

						<!-- 常规操作项 -->
						<vc-dropdown-item
							v-else
							:key="i"
							:disabled="item.disabled"
							align="left"
							@click="handleOk(item)"
							v-text="item.label"
						/>
					</template>
				</vc-dropdown-menu>
			</template>
		</vc-dropdown>
	</div>
</template>
<script>
import Dropdown from '@wya/vc/lib/dropdown';
import Popconfirm from '@wya/vc/lib/popconfirm';
import Popover from '@wya/vc/lib/popover';
import Icon from '@wya/vc/lib/icon';
import Divider from '@wya/vc/lib/divider';
import Item from './item.vue';

export default {
	name: 'vca-table-operate',
	components: {
		'vc-dropdown': Dropdown,
		'vc-dropdown-menu': Dropdown.Menu,
		'vc-dropdown-item': Dropdown.Item,
		'vc-icon': Icon,
		'vc-divider': Divider,
		'vc-popconfirm': Popconfirm,
		'vc-popover': Popover,
		'vca-table-operate-item': Item
	},
	props: {
		/**
		 * 外部展示的个数，其余的放在“更多”里面；
		 * outgoing 外向的（外向的在外面，内向的躲在“更多”里面）
		 */
		outgoingCount: {
			type: Number,
			default: 1
		},
		dataSource: Array
	},
	computed: {
		beforeItems() {
			return this.dataSource.slice(0, this.outgoingCount);
		}
	},
	methods: {
		handleOk(item) {
			if (item.disabled) return;
			const { label } = this;
			this.$emit('click', item.label, item);
			this.$emit('ok', item.label, item);
		},
		handleCancel(item) {
			const { label } = this;
			this.$emit('cancel', item.label, item);
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

.vca-table-operate__text {
	color: #5495f6;
	cursor: pointer;
}
.vca-table-operate__item {
	&.is-tip {
		list-style: none;
	}
}
</style>
