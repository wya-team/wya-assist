## API

// 校验图片地址
		src: {
			type: String,
			default: '',
			required: true
		},
		ajax: Function,
		// 校验滑块接口地址
		url: {
			type: String,
			default: '',
			required: true
		},
		visible: {
			type: Boolean,
			default: false
		}
### 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
src | 校验图片地址 | `String` | - | -
url | 校验接口地址 | `String` | - | `#f9f9f9`
visible | 显示\隐藏 | `Boolean` | `true`、`false` | `false`
ajax | 请求方法 | `Function` | - | `@wya/http`的`ajax`

### Slot
属性 | 说明
---|---
default | -
