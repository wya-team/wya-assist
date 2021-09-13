## API

### 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
src | 校验图片地址 | `String` | - | -
srcParam | 校验图片地址的请求参数 | `Object` | - | -
url | 校验接口地址 | `String` | - | -
urlAjaxOptions | 解析校验接口请求配置 | `Function` | - | -
visible | 显示\隐藏 | `Boolean` | `true`、`false` | `false`
ajax | 请求方法 | `Function` | - | `@wya/http`的`ajax`

### Slot
属性 | 说明
---|---
success | 滑块检验成功的回调
visible-change | popover显示隐藏回调
