import { isFunction } from './util'
import { observer } from './observer/index'
export function initState(vm) { //表示在vue的基础上做一次混合操作
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    // if (opts.computed) {
    //     initComputed()
    // }
    // if (opts.watch) {
    //     initWatch()
    // }
}
function initData(vm) {
    let data = vm.$options.data
    //vue2 会将data中对所有数据，进行数据劫持 Object.defineProperty
    //这个时候vm和data没有关系，通过_data进行关联
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    console.log(vm)
    observer(data)
}