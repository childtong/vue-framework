import { initState } from './state'
import { compileToFunction } from './compile/index'
export function initMixin(Vue) { //表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        //对数据进行初始化
        initState(vm) //vm.$options.data... 数据劫持


        if (vm.$options.el) {
            //将数据挂载到这个模版上
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        //把模版转化成，对应的渲染函数=》虚拟dom概念 vnode =》diff算法 更新虚拟dom =》产生真实节点，更新
        if (!options.render) { //没有render函数，用template
            let template = options.template
            if (!template && el) { //用户也没有传递template，就获取el的内容作为模版
                template = el.outerHTML
                let render = compileToFunction(template) //把模版变成函数
                options.render = render
            }
        }
    }
}