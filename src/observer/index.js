import { isObject } from '../util'

//检测数据变化，类有类型，对象无类型
class Observer {
    constructor(data) { //对对象中的所有属性进行劫持
        //用户很少通过索引数组 arr[98]=100,所以内部想到不对索引进行拦截，因为消耗严重
        //经常使用 push shift pop unshift reverse sort splice 7个变异方法，可能会更改原数组
        if (Array.isArray(data)) { //数组劫持的拦截
            //对数组原来的方法进行改写,切片编程 高阶函数（包装一层）
            data.__proto__ =
        } else {
            this.walk(data) //对象劫持的拦截
        }
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
    console.log(data)
    //如果是对象才观测
    if (!isObject(data)) {
        return;
    }
    return new Observer(data)
}