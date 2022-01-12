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
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}
function initData(vm) { //vue的内部变量以$开头，不会进行代理
    let data = vm.$options.data
    //vue2 会将data中对所有数据，进行数据劫持 Object.defineProperty
    //这个时候vm和data没有关系，通过_data进行关联
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    for (let key in data) { //vm.name =>am._data.name 代理
        proxy(vm, '_data', key)
    }
    observer(data)
}