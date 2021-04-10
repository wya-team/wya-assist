
<template>
	<vc-modal
		v-model="visible"
		:title="title"
		size="large"
		class="vca-select-area"
		@cancel="handleCancel"
		@ok="handleOk"
	>
		<div
			v-for="(area, index) in resetRegion"
			:key="index"
			class="vca-select-area__content"
		>
			<div class="vca-select-area__checkbox vca-select-area__content--area">
				<vc-checkbox
					:indeterminate="area.indeterminate"
					:value="area.checkAll"
					:disabled="area.disabled"
					@click.prevent.native="handleCheckAreaAll(area, true)"
				>
					{{ area.label }}
				</vc-checkbox>
			</div>
			<div
				v-for="(province, provinceIndex) in area.children"
				:key="province.national_code"
				:class="{ 'vca-select-area__empty': provinceIndex && provinceIndex % 3 === 0 }"
				class="vca-select-area__checkbox vca-select-area__content--province"
			>
				<vc-checkbox
					:indeterminate="province.isChina && province.indeterminate"
					:value="province.checkAll"
					:disabled="province.disabled"
					@click.prevent.native="handleChangeCheckAllCity(area, province, 'isClickProvince')"
				>
					<span v-if="!province.isChina" class="vca-select-area__checkbox--oversea">{{ province.region_name }}</span>
				</vc-checkbox>
				<vc-popover
					v-if="province.isChina"
					:transfer="false"
					:arrow="false"
					:portal="false"
					trigger="click"
					placement="bottom"
					content="Bottom"
					class="vca-select-area__popover vca-select-area__pointer"
					@visible-change="handleChangeCityList(province)"
				>
					<span class="vca-select-area__pointer vca-select-area__checkbox--china">{{ province.region_name }}</span>
					<vc-icon
						v-show="!province.show"
						type="p-triangle-down"
					/>
					<vc-icon
						v-show="province.show"
						type="p-triangle-up"
					/>
					<template #content>
						<vc-checkbox-group
							v-model="province.checkCity"
							class="vca-select-area__city"
							@change="handleCheckCity($event, province, area)"
						>
							<vc-checkbox
								v-for="city in province.children"
								:key="city.national_code"
								:label="city.national_code"
								:disabled="city.disabled"
								class="vca-select-area__city--checkbox"
							>
								<span :title="city.region_name">{{ city.region_name }}</span>
							</vc-checkbox>
						</vc-checkbox-group>
					</template>
				</vc-popover>
				<span v-if="province.isChina && province.checkCity.length && !province.disabled" class="vca-select-area__blue">
					（{{ province.checkCity.length }}）
				</span>
			</div>
		</div>
		<div v-if="showOverseas" class="vca-select-area__more vca-select-area__empty">
			<span
				class="vca-select-area__blue vca-select-area__pointer"
				@click="handleExpandOverseas"
			>
				{{ showMoreOverseas ? '收起更多国家' : '展开更多国家' }}
			</span>
		</div>

		<template #footer>
			<vc-checkbox
				v-model="selectAll.checkAll"
				:indeterminate="selectAll.indeterminate"
				class="vca-select-area__footer--checkbox"
				@click.prevent.native="handleCheckAllRegion"
			>
				<span class="vca-select-area__footer--span">全选</span>
			</vc-checkbox>
			<vc-button class="vca-select-area__footer--cancel" @click="handleCancel">
				取消
			</vc-button>
			<vc-button type="primary" @click="handleOk">
				确定
			</vc-button>
		</template>
	</vc-modal>
</template>
<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Popover from '@wya/vc/lib/popover';
import Checkbox from '@wya/vc/lib/checkbox';
import Button from '@wya/vc/lib/button';
import Icon from '@wya/vc/lib/icon';

const config = {
	name: 'vca-select-area',
	components: {
		'vc-modal': Modal,
		'vc-popover': Popover,
		'vc-checkbox': Checkbox,
		'vc-checkbox-group': Checkbox.Group,
		'vc-button': Button,
		'vc-icon': Icon,
	},
	props: {
		region: { // 地区数据
			type: Array,
			default() {
				return [];
			}
		},
		title: {
			type: String,
			default: '选择地2区'
		},
		disabledCodes: { // 禁用的地区code数组
			type: Array,
			default() {
				return [];
			}
		},
		checkedCodes: { // 默认选中的数组
			type: Array,
			default() {
				return [];
			}
		},
		showOverseas: { // 是否显示海外
			type: Boolean,
			default: true
		},
		plugAreaEnglish: { // 是否开启国际化地区插件
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			visible: false,
			resetRegion: [], // 处理过后的分地区数据
			otherOverseas: [], // 未展开的其他海外数据
			showMoreOverseas: false, // 显示更多海外数据
			selectAll: {
				checkAll: false, // 全选数据
				indeterminate: false, // 全选按钮状态
			}
		};
	},
	mounted() {
		this.visible = true;
		this.initRegion();
	},
	methods: {
		// 点击收起、展开更多海外
		handleExpandOverseas() {
			const overseas = this.resetRegion[this.resetRegion.length - 1].children; // 当前海外国家数组
			const delIndex = overseas.length - this.otherOverseas.length;
			this.showMoreOverseas = !this.showMoreOverseas;

			if (this.showMoreOverseas) {
				// 将剩下的国家添加到海外
				overseas.push(...this.otherOverseas);
			} else {
				overseas.splice(delIndex, this.otherOverseas.length);
			}

		},
		// 底部全选
		handleCheckAllRegion() {
			// 设置当前checkbox的状态
			this.setCurrentCheckboxStatus(this.selectAll);

			this.resetRegion.forEach(area => {
				// 选中了全选，全选下面所有大区数据
				if (!area.disabled) {
					if (this.selectAll.checkAll) {
						// 修改地区indeterminate状态，设置地区checkbox的时候直接勾选
						area.indeterminate = false;
						area.checkAll = false;
					} else {
						// 全部取消勾选，修改地区indeterminate状态，设置地区checkbox的时候取消勾选
						area.indeterminate = false;
						area.checkAll = true;
					}
					this.handleCheckAreaAll(area);
				}
			});
		},
		/**
		 * @description: 修改show的状态显示、隐藏下拉城市列表
		 * @param {object} province 省数据
		 */
		handleChangeCityList(province) {
			province.show = !province.show;
		},
		/**
		 * @description: 选中地区数据，勾选下面所有的省及市区
		 * @param {object} area 操作的地区数据
		 * @param {boolean} isChangeCheckAll 是否需要修改底部全选checkbox状态，由底部全选调用该方法时不需要
		 */
		handleCheckAreaAll(area, isChangeCheckAll = false) {
			if (area.disabled) {
				return;
			}

			// 设置当前checkbox的状态
			this.setCurrentCheckboxStatus(area);

			// 切换下面的省份状态
			area.children.forEach(province => {
				// 禁用省判断
				if (!province.disabled) {
					// 地区全选
					if (area.checkAll) {
						this.handleChangeCheckAllCity(area, province, 'areaCheckAll');
					} else {
						// 处理一波数据，假装该省份已经是全选状态，取消勾选地区时同时取消对应省及城市状态
						province.indeterminate = false;
						province.checkAll = true;
						this.handleChangeCheckAllCity(area, province);
					}
				}
			});

			// 海外地区，需要选择其他未添加进来的其他海外地区
			if (area.isOverseas) {
				// 全选了海外地区，展开海外地区
				area.checkAll && !this.showMoreOverseas && this.handleExpandOverseas();

				this.otherOverseas.forEach(item => {
					if (!item.disabled) {
						item.checkAll = area.checkAll;
					}
				});
			}

			if (isChangeCheckAll) {
				// 修改底部全选checkbox状态
				this.setCheckStatus(this.resetRegion, this.selectAll);
			}

		},
		/**
		 * @description: 切换省份选中状态,并切换所属省份的市区选中状态
		 * @param {object} area 地区数据
		 * @param {object} province 省数据
		 * @param {string} type areaCheckAll：选中所有地区; isClickProvince：修改地区checkbox状态
		 */
		handleChangeCheckAllCity(area, province, type) {
			if (province.disabled) {
				return;
			}

			// 设置当前省checkbox的状态
			if (type === 'areaCheckAll') {
				province.checkAll = true;
				province.indeterminate = false;
			} else {
				this.setCurrentCheckboxStatus(province);
			}

			// 全选省份数据,选中对应市
			if (province.checkAll) {
				province.checkCity = province.children.map(city => {
					return !city.disabled && city.national_code;
				}).filter(item => !!item);
			} else {
				province.checkCity = [];
			}

			// 点击的是省份的checkbox，修改地区checkbox状态
			if (type === 'isClickProvince') {
				this.changeAreaStatus(area);
			}
			this.$forceUpdate();
		},
		/**
		 * @description: 切换城市选中状态，修改省checkbox状态及选中的数据
		 * @param {array} checkData 当前checkboxgroup绑定的数据
		 * @param {object} province 当前操作的省对象
		 * @param {object} area 当前操作的地区对象
		 */
		handleCheckCity(checkData, province, area) {
			// 切换省checkbox状态
			this.setParentCheckboxStatus(checkData, province);
			// 切换地区checkbox状态
			this.changeAreaStatus(area);

			province.checkCity = checkData;
			this.$forceUpdate();
		},
		handleCancel() {
			this.$emit('close');
		},
		handleOk() {
			let checkData = [];
			let overseasCheck = []; // 海外选择
			let china = this.plugAreaEnglish ? 'china' : '全国（含港澳台）';
			this.resetRegion.forEach(area => {
				// 非海外
				!area.isOverseas && area.children.forEach(province => {
					if (province.checkAll && province.checkCity.length === province.children.length) {
						// 省份全选
						checkData.push(province);
					} else {
						province.children.forEach(city => {
							// 拿出选中的city
							if (province.checkCity.includes(city.national_code)) {
								checkData.push(city);
							}
						});
					}
				});

				// 海外
				area.isOverseas && area.children.forEach(item => {
					if (item.checkAll) {
						checkData.push(item);
						overseasCheck.push(item); // 单独记录海外选择
					}
				});
			});

			// 判断全国是否全选   parent_id == 1 为中国地区
			const isChina =	checkData.filter(it => {
				if (it.parent_id == '1') {
					return true;
				}
				return false;
			});
			// 判断隐藏的海外地区
			if (!this.showMoreOverseas) {
				const checkOverseas = this.otherOverseas.filter(item => {
					return item.checkAll;
				});
				checkData = [...checkData, ...checkOverseas];
			}

			if (isChina.length == 34 && checkData.length == 34) {
				checkData = [{ national_code: '1', parent_id: '0', region_name: china, level: 1, children: [] }];
			}

			if (isChina.length == 34 && checkData.length > 34) {
				checkData = [{ national_code: '1', parent_id: '0', region_name: china, level: 1, children: [] }];
				checkData = [...checkData, ...overseasCheck];
			}
			this.$emit('sure', { checkData, checkAll: this.selectAll.checkAll });
		},
		/**
		 * @description: 修改地区checkbox的状态，同时触发修改底部全选checkbox状态
		 * @param {object} area 操作的地区对象
		 */
		changeAreaStatus(area) {
			// 修改地区全选状态
			this.setCheckStatus(area.children, area);
			// 修改底部全选checkbox状态
			this.setCheckStatus(this.resetRegion, this.selectAll);
		},
		/**
		 * @description: 根据源数据的checkAll和indeterminate状态判断修改目标数据的checkAll和indeterminate状态
		 * @param {array} data 依据
		 * @param {array} target 需要修改状态的对象
		 */
		setCheckStatus(data, target) {
			const checkAllArr = data.filter(item => item.checkAll);
			const disabledAllArr = data.filter(item => item.disabled);
			const checkHalfArr = data.filter(item => item.indeterminate);

			if (!checkHalfArr.length && !checkAllArr.length) {
				target.indeterminate = false;
				target.checkAll = false;
			} else if ((checkAllArr.length + disabledAllArr.length) === data.length) {
				target.indeterminate = false;
				target.checkAll = true;
			} else if (checkHalfArr.length || checkAllArr.length < data.length) {
				target.indeterminate = true;
				target.checkAll = false;
			}
		},
		/**
		 * @description: 设置当前全选checkbox状态
		 * @param {object} data 数据对象
		 */
		setCurrentCheckboxStatus(data) {
			if (data.indeterminate) {
				data.checkAll = true;
			} else {
				data.checkAll = !data.checkAll;
			}

			data.indeterminate = false;
		},
		/**
		 * @description: 选中子项，切换父级checkbox的状态
		 * @param {object} 切换状态的父级对象
		 */
		setParentCheckboxStatus(checkData, parent) {
			let disabledLength = parent.children.filter(item => item.disabled).length;
			let len = disabledLength + checkData.length;
			if (checkData.length === 0 || len === 0) {
				parent.indeterminate = false;
				parent.checkAll = false;
			} else if (len === parent.children.length) {
				parent.indeterminate = false;
				parent.checkAll = true;
			} else if (len > 0) {
				parent.indeterminate = true;
				parent.checkAll = false;
			}
		},
		/**
		 * @description: 地区数据格式化，统一成
		 */
		initTreeData(obj, value, label, children) {
			if (typeof obj === 'object' || Array.isArray(obj)) {
				return JSON.parse(
					JSON.stringify(obj)
						.replace(new RegExp(value, 'g'), 'national_code')
						.replace(new RegExp(label, 'g'), 'region_name')
						.replace(new RegExp(`children|${children}`, 'g'), 'children')
				);
			}
			console.error('参数错误');
			return [];
		},
		/**
		 * @description: 格式化地区数据，分地区
		 */
		initRegion() {
			const region = this.initTreeData(this.region, 'value', 'label');
			const chinaRegion = region[0].children;
			const overseasRegion = region.slice(1);

			let northeast = { label: '东北', indeterminate: false, checkAll: false, children: [] }; // 东北
			let eastChina = { label: '华东', indeterminate: false, checkAll: false, children: [] }; // 华东
			let centralChina = { label: '华中', indeterminate: false, checkAll: false, children: [] }; // 华中
			let southernChina = { label: '华南', indeterminate: false, checkAll: false, children: [] }; // 华南
			let northChina = { label: '华北', indeterminate: false, checkAll: false, children: [] }; // 华北
			let northwest = { label: '西北', indeterminate: false, checkAll: false, children: [] }; // 西北
			let southwest = { label: '西南', indeterminate: false, checkAll: false, children: [] }; // 西南
			let other = { label: '港澳台', indeterminate: false, checkAll: false, children: [] }; // 港澳台
			let overseas = { label: '海外', indeterminate: false, checkAll: false, isOverseas: true, children: [] }; // 默认展示国家


			const northeastProvince = ['210000', '220000', '230000']; // 东北
			const eastChinaProvince = ['310000', '320000', '330000', '340000', '360000']; // 华东
			const centralChinaProvince = ['410000', '420000', '430000']; // 华中
			const southernChinaProvince = ['350000', '440000', '450000', '460000']; // 华南
			const northChinaProvince = ['110000', '120000', '130000', '140000', '150000', '370000']; // 华北
			const northwestProvince = ['610000', '620000', '630000', '640000', '650000']; // 西北
			const southwestProvince = ['500000', '510000', '520000', '530000', '540000']; // 西南
			const otherProvince = ['710000', '810000', '820000']; // 港澳台
			const overseasCountry = ['217', '125', '19', '93', '219', '134', '83', '164', '193']; // 默认展示国家

			chinaRegion.forEach(province => {
				province.isChina = true; // 显示操作图标
				province.show = false; // 默认显示向下图标
				province.indeterminate = false; // 设置indeterminate 状态
				province.checkAll = false; // 全选城市状态
				province.checkCity = []; // 省份下选中的城市数组
				province.disabled = false; // 默认不禁用省份
				province = this.setDisabledAndCheckStatus(province); // 处理禁用及选中状态

				// 将省份放进对应大区对象的children
				if (northeastProvince.includes(province.national_code)) {
					northeast.children.push(province);
				} else if (eastChinaProvince.includes(province.national_code)) {
					eastChina.children.push(province);
				} else if (centralChinaProvince.includes(province.national_code)) {
					centralChina.children.push(province);
				} else if (southernChinaProvince.includes(province.national_code)) {
					southernChina.children.push(province);
				} else if (northChinaProvince.includes(province.national_code)) {
					northChina.children.push(province);
				} else if (northwestProvince.includes(province.national_code)) {
					northwest.children.push(province);
				} else if (southwestProvince.includes(province.national_code)) {
					southwest.children.push(province);
				} else if (otherProvince.includes(province.national_code)) {
					other.children.push(province);
				}
			});

			this.showOverseas && overseasRegion.forEach(country => {
				country.isChina = false; // 不显示操作图标
				country.indeterminate = false; // 设置indeterminate 状态
				country.disabled = false; // 默认不禁用
				country.checkCity = [];

				// 全选状态
				if (this.checkedCodes.includes(country.national_code)) {
					country.checkAll = true;
				} else {
					country.checkAll = false;
				}

				// 禁用状态
				if (this.disabledCodes.includes(country.national_code)) {
					country.disabled = true;
				}

				// 默认需要显示的
				if (overseasCountry.includes(country.national_code)) {
					overseas.children.push(country);
				} else {
					this.otherOverseas.push(country);
				}
			});

			this.resetRegion = [northeast, eastChina, centralChina, southernChina, northChina, northwest, southwest, other];

			this.showOverseas && this.resetRegion.push(overseas);


			// 大区禁用及选中
			this.resetRegion.forEach(area => {
				const disabled = area.children.filter(province => province.disabled);
				area.disabled = disabled.length === area.children.length;

				const checkAll = area.children.filter(province => province.checkAll);
				area.checkAll = checkAll.length === area.children.length;

				this.changeAreaStatus(area); // 修改底部全选状态
			});
		},
		/**
		 * @description: 通过传来的禁用及选中code数组给省份及市区添加是否禁用状态
		 * @param {object} province 省对象
		 * @return: 省对象，添加了禁用及选中状态
		 */
		setDisabledAndCheckStatus(province) {
			province.children.forEach(city => {
				if (this.disabledCodes.includes(province.national_code)) {
					// 禁用省及下面所有的市
					province.disabled = true;
					city.disabled = true;
				} else if (this.disabledCodes.includes(city.national_code)) {
					// 禁用对应的市
					city.disabled = true;
				} else {
					// 未找到不禁用
					city.disabled = false;
				}
				if (this.checkedCodes.includes(province.national_code)) {
					// 选中省及下面所有的市
					province.checkAll = true;
					province.checkCity.push(city.national_code);
				} else if (this.checkedCodes.includes(city.national_code)) {
					// 选中对应的市
					province.checkCity.push(city.national_code);
				} else {
					city.checked = false;
				}
				// 修改省的选中状态
				this.setParentCheckboxStatus(province.checkCity, province);
			});

			// 判断省下面的市是否全被禁用，如果是则禁用省
			if (province.children.filter(city => city.disabled).length === province.children.length) {
				province.disabled = true;
				province.checkAll = false;
			}

			return province;
		},
	}
};

export default config;
export const SelectArea = new Portal(config, {
});
</script>
<style lang="scss">
.vca-select-area {
	.vc-modal__container {
		height: 662px;
	}
	.vca-select-area__content {
		display: flex;
		flex-wrap: wrap;
		margin: 8px 0;
		.vca-select-area__checkbox {
			margin-bottom: 20px;
            .vca-select-area__checkbox--oversea {
                margin-left: 8px;
            }
            .vca-select-area__checkbox--china {
                margin-right: 5px;
            }
			.vc-icon {
				font-size: 14px;
				position: relative;
				top: -1px;
			} 
		}
		.vca-select-area__content--area {
			width: 126px;
		}
		.vca-select-area__content--province {
			width: 220px;
			padding-right: 10px;
		}
		.vca-select-area__popover {
			.vc-popover-core__container {
				padding: 0;
			}
			.vca-select-area__city {
				position: absolute;
				top: 0;
				left: -50px;
				width: 144px;
				height: 240px;
				background: #ffffff;
				box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
				border-radius:4px;
				margin-top: 4px;
				padding: 16px;
				overflow-x: hidden;
				overflow-y: auto;
				z-index: 999;
				.vca-select-area__city--checkbox {
					display: block;
					list-style-type: none;
					margin-bottom: 10px;
				}
				&::-webkit-scrollbar {
					width: 5px;
				}
				/*滑块的样式*/
				&::-webkit-scrollbar-thumb {
					width: 100%;
					height: 40px;
					background: #cdcdcd;
					border-radius: 2px;
				}
				/*主干部分*/
				&::-webkit-scrollbar-track {
					background-color: #ffffff
				}
			}
		}
		.vc-icon svg {
			width: .7em;
			height: .7em;
		}
	}
	.vca-select-area__empty {
		margin-left: 126px;
	}
	.vca-select-area__more {
		margin-top: -20px !important;
	}
    .vca-select-area__pointer {
        cursor: pointer;
    }
    .vca-select-area__blue {
        color: #5495f6;
    }
	.vc-modal__footer {
		.vca-select-area__footer--checkbox {
			float: left;
		}
        .vca-select-area__footer--span {
            margin-left: 4px;
        }
        .vca-select-area__footer--cancel {
            margin-right: 12px;
        }
	}
}
</style>
