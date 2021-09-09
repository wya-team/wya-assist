const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const postcss = require('rollup-plugin-postcss');
const vue = require('rollup-plugin-vue');

// PostCSS plugins
const simplevars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const preset = require('postcss-preset-env');
const cssnano = require('cssnano');

const external = filename => {
	let regex = [
		'^vue$',
		'^lodash$',
		'^@babel/runtime',
		
		'^@wya/ps$',
		'^@wya/utils$',
		'^@wya/http$',
		'^@wya/socket$',
		'^@wya/vc'
	].join('|');

	if (/^@wya\/vc$/.test(filename)) {
		throw new Error('请使用以下公式 import Xxx from "@wya/vc/lib/xxx"');
	}
	return new RegExp(`(${regex})`).test(filename);
};


// 添加前缀和其他处理
const BASIC_POSTCSS_PLUGIN = [
	simplevars(),
	nested(),
	preset({
		warnForDuplicates: false,
	})
];

const builds = {
	js: {
		script: 'babel packages/js/src --out-dir packages/js/dist --copy-files --ignore **.test.js,**.md,examples/**',
		rollup: {
			entry: 'packages/js/src/index.js',
			dest: 'packages/js/dist/assist-js.min.js',
			format: 'cjs',
			external,
		}
	},
	vc: {
		script: 'babel packages/vc/src --out-dir packages/vc/dist --copy-files --ignore **.test.js,**.md,examples/**',
		rollup: {
			entry: 'packages/vc/src/index.js',
			dest: 'packages/vc/dist/assist-vc.min.js',
			format: 'cjs',
			globals: {
				vue: 'Vue'
			},
			plugins: [
				vue({
					css: true, // css in js
					style: {
						postcssPlugins: BASIC_POSTCSS_PLUGIN
					}
				}),
				// 使用postcss
				postcss({
					plugins: [
						...BASIC_POSTCSS_PLUGIN,
						cssnano() // 压缩，不能用于vue, 上面要求是async plugin
					],
					extensions: ['.css', '.scss'],
				})
			],
			external,
		}
	},
	vm: {
		script: 'babel packages/vm/src --out-dir packages/vm/dist --copy-files --ignore **.test.js,**.md,examples/**',
		rollup: {
			entry: 'packages/vm/src/index.js',
			dest: 'packages/vm/dist/assist-vm.min.js',
			format: 'cjs',
			globals: {
				vue: 'Vue'
			},
			plugins: [
				vue({
					css: true, // css in js
					style: {
						postcssPlugins: BASIC_POSTCSS_PLUGIN
					}
				}),
				// 使用postcss
				postcss({
					plugins: [
						...BASIC_POSTCSS_PLUGIN,
						cssnano() // 压缩，不能用于vue, 上面要求是async plugin
					],
					extensions: ['.css', '.scss'],
				})
			],
			external,
		}
	},
	wx: {
		script: 'babel packages/wx/src --out-dir packages/wx/dist --copy-files --ignore **.test.js,**.md,examples/**',
		rollup: {
			entry: 'packages/wx/src/index.js',
			dest: 'packages/wx/dist/assist-wx.min.js',
			format: 'cjs',
			external,
		}
	}
};

class Config {
	static getConfig = (name) => {
		return {
			...builds[name],
			rollup: Config.getRollupConfig(name)
		};
	}

	static getRollupConfig = (name) => {
		let opts = builds[name].rollup;
		if (!opts) return;

		let config = {
			input: opts.entry,
			external: opts.external,
			plugins: [
				// 使用amd模块引入，第三方模块支持	
				nodeResolve({
					mainFields: ['module', 'jsnext:main', 'main'],
					modulesOnly: true,
					browser: true
				}), 
				// 使用cjs模块引入
				commonjs({
					include: "node_modules/**"
				}), 
				replace({
					'__DEV__': 'false',
					'ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
					'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
					preventAssignment: false
				}),
				...(opts.plugins || []),

				/**
				 * 使用babel，结合.babelrc
				 * node_modules/vue-runtime-helpers需要重新编译, 不设置 exclude: 'node_modules/**',
				 *
				 * .vue新增extensions, 否者无法编译
				 */
				babel({
					babelrc: true,
					extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'], 
					babelHelpers: 'runtime'
				}),

				process.env.NODE_ENV === 'production' && terser()
			],
			output: {
				file: opts.dest,
				format: opts.format,
				globals: opts.globals,
				// named: opts.moduleName || name,
				exports: 'named'
			}
		};
		return config;
	}

	static getAllBuilds = () => {
		return Object.keys(builds).map(Config.getConfig);
	}
}

module.exports = Config;
