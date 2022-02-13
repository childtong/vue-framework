//push shift pop unshift reverse sort splice,7个方法是变异方法，会更改原数组
let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype) //拷贝原有的原型方法
//arrayMethods.__proto__ = Array.prototype 继承
let methods = [
    'push', 'shift', 'pop', 'unshift', 'reverse', 'sort', 'splice'
]
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        //console.log('数组发生变化,重写这7个方法')
        oldArrayPrototype[method].call(this, ...args)
        let inserted;
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        //如果有新增的内容要继续进行劫持，我需要观测的数组里的每一项，而不是数组（已新增为例）
        if (inserted) ob.observeArray(inserted)
    }
})