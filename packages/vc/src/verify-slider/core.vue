<template>
	<div class="vca-verify-slider-core">
		<div class="_box">
			<div class="_box-header">
				<span v-show="!isFail" class="_tip">拖动下方滑块完成拼图</span>
				<span v-show="isFail" class="_guide-tip">请控制拼图块对齐缺口</span>
				<span class="_refresh-tip" @click="handleRefresh">刷新</span>
			</div>
			<div v-if="!isLoading" class="_box-img">
				<vm-draggable
					:x.sync="x"
					:handles="[]"
					@drag-end="handleEndDrag"
					@dragging="handleDragging"
				> 	
					<img 
						ref="imgSilde" 
						:src="pic"
						class="slider"
						alt="滑块"
					>
				</vm-draggable>
				<img 
					:src="pic" 
					class="incomplete"
					alt="扣图"
				>
				<div v-show="isSuccess" class="_success">
					<div class="icon">
						<vcm-icon type="p-success" />
					</div>
					<p>只用了{{ drag.time }}s，这速度简直完美</p>
				</div>
			</div>
			<div v-else class="_flex-cc _box-img">
				<vc-spin />
			</div>
			<div class="_box-slider-container">
				<vm-draggable 
					:x.sync="x"
					:y="-7"
					:handles="[]"
					:w="45"
					:h="24"
					:parent="false"
					class="_box-slider _flex-cc"
					@drag-end="handleEndDrag"
					@dragging="handleDragging"
				>
					<span class="line" />
					<span class="line" style="margin: 0 5px" />
					<span class="line" />
				</vm-draggable>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * 来自业务提取，对于后端传图有一定要求
 */
import { Draggable } from '@wya/vm';
import { ajax } from '@wya/http';
import Spin from '@wya/vc/lib/spin';
import { hackImg } from './utils';

export default {
	name: "vca-verify-slider-core",
	components: {
		'vm-draggable': Draggable,
		'vc-spin': Spin,
	},
	props: {
		// 校验图片地址
		src: {
			type: String,
			default: '',
			required: true
		},
		srcParam: {
			type: Object,
			default: () => ({})
		},
		// 校验滑块接口地址
		url: {
			type: String,
			default: '',
			required: true
		},
		// 接收滑块的字段可能存在变动
		urlAjaxOptions: {
			type: Object,
			default: () => ({})
		},
		ajax: Function,
	},
	data() {
		return {
			x: 0, // 拖拽偏移量
			isFail: false, // 是否校验失败,控制上方提示文字切换
			isSuccess: false, // 控制成功后蒙层背景
			timeoutTimer: null, // 定时重置滑块定时器对象
			successTimer: null, // 校验成功定时器对象
			drag: {
				startTime: 0,
				time: 0, // 滑块耗时
				count: 0, // 失败次数
				flag: false, // 是否拖动中，用于判断拖动时长，由于点击开始事件失效
			},
			pic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P48OP/fwAJqgPnYfITggAAAABJRU5ErkJggg==',

			// 加载图片时
			isLoading: false
		};
	},
	watch: {
		src: {
			immediate: true,
			handler(v) {
				this.rebuildPic();
			}
		},
	},
	destroyed() {
		clearTimeout(this.timeoutTimer);
		clearTimeout(this.successTimer);
	},
	methods: {
		async rebuildPic() {
			try {
				this.isLoading = true;
				this.x = 0;
				this.isFail = false;
				this.isSuccess = false;

				this.pic = await hackImg(this.src, { param: this.srcParam });
				this.isLoading = false;
			} catch {
				// TODO 
			}
		},
		handleDragging() {
			if (!this.drag.flag) {
				this.drag.flag = true;
				this.drag.startTime = new Date().getTime(); // 开始计时
			}
			
			// 拖动区域限制
			if (this.x <= 0) {
				this.x = 0;
			} else if (this.x >= 263) {
				this.x = 263;
			}
		},
		handleEndDrag() {
			let endTime = new Date().getTime();
			this.drag.time = ((endTime - this.drag.startTime) / 1000).toFixed(1); // 耗时保留一位小数
			this.drag.count++; // 计数count++
			this.verifyData(this.x);
		},
		// 刷新
		handleRefresh() {
			this.showFullImg = true;
			this.drag.count = 0;
			this.rebuildPic();
		},
		// 重置滑块的位置
		resetSlider() {
			this.x = 0;
	
			// 失败三次，刷新图片，放在这里为了体验更好一点，不会立即刷新掉图片
			if (this.drag.count >= 3) {
				this.handleRefresh();
			}
		},
		// 校验滑块位置
		verifyData(offsetX) {
			const request = this.ajax || ajax;

			const { param, parseParam, ...rest } = this.urlAjaxOptions || {};
			request({
				url: this.url,
				type: 'GET',
				param: {
					tn_r: offsetX,
					...param,
					...(this.parseParam && this.parseParam(offsetX))
				},
				errorTip: false,
				successTip: false,
				localData: process.env.NODE_ENV === 'development' 
					? { status: 1, data: {} }
					: null,
				...rest
			}).then((res) => {
				this.status = 'success';
				this.isFail = false;
				this.isSuccess = true;
				this.successTimer && clearTimeout(this.successTimer);
				this.successTimer = setTimeout(() => {
					this.$emit('success'); // 校验成功
				}, 1000);
			}).catch((err) => {
				// 校验失败，恢复初始状态
				this.isFail = true;
				this.timeoutTimer && clearTimeout(this.timeoutTimer);
				this.timeoutTimer = setTimeout(this.resetSlider, 1000);
			}).finally(() => {
				this.drag.flag = false;
			});
		},
	},
};

</script>

<style lang="scss">
.vca-verify-slider-core {
	width: 360px;
	height: 270px;
	padding: 27px 32px 18px;
	background: #ffffff;
	z-index: 999;
	._box {
		position: relative;
		._flex-cc {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-header {
			line-height: 21px;
			._tip {
				font-size: 14px;
				color: #000;
			}
			._guide-tip {
				color: #e74854;
				font-size: 14px;
			}
			._refresh-tip {
				color: #676767;
				float: right;
				cursor: pointer;
			}
		}
		&-img {
			width: 296px;
			height: 172px;
			margin-bottom: 16px;
			overflow: hidden;
			position: relative;
			.full {
				position: absolute;
				top: -344px;
			}
			.slider {
				position: absolute;
				top: -172px;
				z-index: 9;
				transform: translate3d(0, 0, 0);
			}
			.incomplete {
				position: absolute;
				top: 0;
			}
			._success {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 10;
				background: #ffffff;
				opacity: .9;
				text-align: center;
				.icon {
					font-size: 20px;
					color: #52c41a;
					margin-top: 64px;
					margin-bottom: 5px;
				}
				p {
					font-size: 14px;
					color: #52c41a;
				}
			}
		}
		&-slider-container {
			width: 297px;
			height: 12px;
			background: #d9d9d9;
			border-radius: 6px;
			position: relative;
		}
		&-slider {
			position: absolute;
			top: -7px;
			left: 0px;
			width: 45px;
			height: 24px;
			background: #4a8ced;
			border-radius: 12px;
			&:hover {
				cursor: pointer;
			}
			div {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.line {
				width: 2px;
				height: 11px;
				background: #ffffff;
				border-radius: 1px;
			}
		}
		.fail {
			transition: all 1s;
		}
	}
}
</style>

