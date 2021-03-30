# 可编辑文本

## 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
value | 当前展示值 | `String`、`Number` | - | -
inputType | 编辑时的输入类型 | `string` | `string`, `number` | `string`
inputOptions | vc-input或vc-input-number的绑定属性 | `Object` | - | -
complete | 触发完成的时机 | `String` | `onBlur`：输入框失焦触发, `onConfirm`：点击‘确定’触发 | -

## 事件
事件名 | 说明 | 回调参数 | 参数说明
---|---|---|---|---
complete | 触发完成的事件回调，可返回Promise | editValue | 编辑后的值