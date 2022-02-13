import { isObject } from '../util'
import { arrayMethods } from './array'

//检测数据变化，类有类型，对象无类型
class Observer {
    constructor(data) { //对对象中的所有属性进行劫持
        Object.defineProperty(data, "__ob__", {
            value: this,
            enumerable: false
        })
        //data.__ob__ = this  //会不停递归，爆栈💥
        //用户很少通过索引数组 arr[98]=100,所以内部想到不对索引进行拦截，因为消耗严重
        //经常使用 push shift pop unshift reverse sort splice 7个变异方法，可能会更改原数组
        //数组没有监控索引的变化，但是索引对应的内容是对象类型，需要被监控 Object.freeze
        if (Array.isArray(data)) { //数组劫持的拦截
            //对数组原来的方法进行改写,切片编程 高阶函数（包装一层）
            data.__proto__ = arrayMethods;
            //如果数组中的数据是对象类型，需要监控对象的变化
            this.observeArray(data)
        } else {
            this.walk(data) //对象劫持的拦截
        }
    }
    observeArray(data) { //对数组中的数组和对象进行再次劫持，递归
        data.forEach(item => {
            observer(item)
        })
    }
    walk(data) { //对象
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}
//vue2会对对象进行递归遍历，将每个属性用 defineProperty 重新定义 性能差
function defineReactive(data, key, value) {
    observer(value) //对象尽可能扁平化，不要多层递归
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newV) { //如果用户赋值一个新对象，需要将这个对象进行劫持
            observer(newV)
            value = newV
        }
    })
}
export function observer(data) {
    //如果是对象才观测
    if (!isObject(data)) {
        return;
    }
    if (data.__ob__) {
        return;
    }
    return new Observer(data)
}