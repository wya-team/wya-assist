## Playgroud

```
npm install @wya/vue-cli -g
```

- 自动寻址 `wya-vue sfc --pattern '**/examples'` 或者 `npm run dev`
- 单文件 `wya-vue sfc ./xxxx.vue`
- 目录 `wya-vue src /xxx`



## 注意

- 目前 Portal 只能单独用 js 包裹一层
- `@wya/sass` 编译上 rollup 和 webpack 存在差异， 暂时不使用
- vc的包只能这么引入: `import Portal from '@wya/vc/lib/portal';`
