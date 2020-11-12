## Playgroud

```
npm install @wya/vue-cli -g
```
- `npm run dev`

## 注意

- 目前 Portal 只能单独用 js 包裹一层
- `@wya/sass` 编译上 rollup 和 webpack 存在差异， 暂时不使用
- vc的包只能这么引入: `import Portal from '@wya/vc/lib/portal';`

## `Sortable`模块

#### 用法

```js
import { createVMDrags } from '@wya/vm';
import { Sorts } from '@wya/assist-vm';

const Modules = {
	...Sorts.modules, 
	// custom
};
let { Combo, Preview } = createVMDrags(Modules, { mode: 'sortable' });
```

#### Sorts 参数说明

名称 | 说明 | 开发 | 计划
---|---|---|---
`keys` | 所有模块的key | 1 | -
`origins` | 原始模块 | 1 | -
`modules` | 默认模块 | 1 | -
`getModules` | 可配置的Modules | 1 | -

#### 默认模块
- `Sorts.keys`

名称 | 说明 | 开发 | 计划
---|---|---|---
`page` | 页面设置 | 1 | -
`rtf` | 富文本 | 1 | -
`space` | 辅助空白 | 1 | -
`cutoff` | 分割线 | 1 | -

## `Draggable`模块

> 暂无

## 公共模块

### `Viewer`

#### components

- 用法

```js
import { Viewer } from '@wya/assist-vm';

export default {
	components: {
		'vm-viewer-layout': Viewer.Layout
	}
};
```

- Layout

名称 | 说明 | 默认值 | 其他
---|---|---|---
`reverse` | 改变填充方式 | false | -

#### mixins

- 用法

```js
import { Viewer } from '@wya/assist-vm';

export default {
	// 前者无参数的写法，后者带参数的写法
	mixins: [Viewer.mixins(['layout-style', { name: 'rebuild-index', prefix: 'q-' }])],
	components: {
		'vm-viewer-layout': Viewer.Layout
	}
};
```

- layout-style

在不使用`View.Layout`时，使用此项可快捷自定义, 参数： `layoutStyle.wrapper`、`layoutStyle.content`

- rebuild-index

用于处理同一分类下index重新排序，默认值 `prefix: 'q-'`, 参数： `rebuildIndex`

### `Editor`

#### components

- 用法

```js
import { Editor } from '@wya/assist-vm';

export default {
	components: {
		'vm-editor-layout': Editor.Layout,
		'vm-editor-slider': Editor.Slider,
		'vm-editor-add': Editor.Add,
		'vm-editor-cell': Editor.Cell,
		// ...
	}
};
```

- Layout

名称 | 说明 | 默认值 | 其他
---|---|---|---
`title` | 标题 | '' | -

- Add
- Cell
- Checkbox
- Color
- Header
- ImgsPicker
- InputNumber
- LabelTitle
- Radio
- Slider
- SortList
- Tip
- Title





