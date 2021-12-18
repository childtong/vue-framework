import { isObject } from '../util'

//检测数据变化，类有类型，对象无类型
class Observer {
    constructor(data) { //对对象中的所有属性进行劫持
        this.walk(data)
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