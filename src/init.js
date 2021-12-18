import { initState } from './state'
export function initMixin(Vue) { //表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        //对数据进行初始化
        initState(vm) //vm.$options.data...
    }
}