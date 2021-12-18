import babel from 'rollup-plugin-babel'
export default {
    input: './src/index.js',
    output: {
        format: 'umd', //支持amd和commonjs 规范 window.Vue（挂载在window上）
        name: 'Vue',
        file: 'dist/vue.js',
        sourcemap: true //es5->es6源代码
    },
    plugins: [
        babel({ //使用babel转化并排除node_modules
            exclude: 'node_modules/**'  //glob语法
        })
    ]
}