## API

- `Table.Filter`

### 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
value | 选中的value值数组	 | `Array` | - | -
dataSource | 所有过滤项		 | `Array` | - | -
required | 是否至少选择一个	 | `Boolean` | - | `false`
protalClassName | 用于vc-dropdown（可参考vc-dropdown)	 | `String` | - | `false`

### Slot
属性 | 说明
---|---
default | -

### Events
属性 | 说明 | 回调参数 | 参数说明
---|--- |--- | ---
change | 状态改变时触发	| - | -
select-all | 全选中	| - | -
select-none | 都不选中	| - | -

- `Table.Sorter`

### 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
value | 排序状态	 | `String` | `unsort`, `ascending`, `descending` | `unsort`

### Slot
属性 | 说明
---|---
default | -

### Events
属性 | 说明 | 回调参数 | 参数说明
---|--- |--- | ---
change | 点击时排序状态改变触发	| - | -

- `Table.Operate`

### 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
dataSource | 按钮数据 | `Array` | - | `[ { title: '', name: '' }]`
dataSourceKey | 参数key | `Object` | - | `{ title: 'title', name: 'name' }`

### Slot
属性 | 说明
---|---
default | -

### Events
属性 | 说明 | 回调参数 | 参数说明
---|--- |--- | ---
change | 点击时排序状态改变触发	| - | -
