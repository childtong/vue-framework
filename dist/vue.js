(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return _typeof(val) === 'object' && val !== null;
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //对对象中的所有属性进行劫持
      //用户很少通过索引数组 arr[98]=100,所以内部想到不对索引进行拦截，因为消耗严重
      //经常使用 push shift pop unshift reverse sort splice 7个变异方法，可能会更改原数组
      if (Array.isArray(data)) ; else {
        this.walk(data); //对象劫持的拦截
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //对象
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }(); //vue2会对对象进行递归遍历，将每个属性用 defineProperty 重新定义 性能差


  function defineReactive(data, key, value) {
    observer(value); //对象尽可能扁平化，不要多层递归

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newV) {
        //如果用户赋值一个新对象，需要将这个对象进行劫持
        observer(newV);
        value = newV;
      }
    });
  }

  function observer(data) {
    console.log(data); //如果是对象才观测

    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    //表示在vue的基础上做一次混合操作
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    } // if (opts.computed) {
    //     initComputed()
    // }
    // if (opts.watch) {
    //     initWatch()
    // }

  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  function initData(vm) {
    //vue的内部变量以$开头，不会进行代理
    var data = vm.$options.data; //vue2 会将data中对所有数据，进行数据劫持 Object.defineProperty
    //这个时候vm和data没有关系，通过_data进行关联

    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      //vm.name =>am._data.name 代理
      proxy(vm, '_data', key);
    }

    observer(data);
  }

  function initMixin(Vue) {
    //表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //对数据进行初始化

      initState(vm); //vm.$options.data...
    };
  }

  function Vue(options) {
    //options 为用户传入的选项
    this._init(options); //初始化操作，组件

  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
