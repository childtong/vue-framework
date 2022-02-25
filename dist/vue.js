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

  //push shift pop unshift reverse sort splice,7个方法是变异方法，会更改原数组
  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype); //拷贝原有的原型方法
  //arrayMethods.__proto__ = Array.prototype 继承

  var methods = ['push', 'shift', 'pop', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //console.log('数组发生变化,重写这7个方法')
      (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } //如果有新增的内容要继续进行劫持，我需要观测的数组里的每一项，而不是数组（已新增为例）


      if (inserted) ob.observeArray(inserted);
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //对对象中的所有属性进行劫持
      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false
      }); //data.__ob__ = this  //会不停递归，爆栈💥
      //用户很少通过索引数组 arr[98]=100,所以内部想到不对索引进行拦截，因为消耗严重
      //经常使用 push shift pop unshift reverse sort splice 7个变异方法，可能会更改原数组
      //数组没有监控索引的变化，但是索引对应的内容是对象类型，需要被监控 Object.freeze

      if (Array.isArray(data)) {
        //数组劫持的拦截
        //对数组原来的方法进行改写,切片编程 高阶函数（包装一层）
        data.__proto__ = arrayMethods; //如果数组中的数据是对象类型，需要监控对象的变化

        this.observeArray(data);
      } else {
        this.walk(data); //对象劫持的拦截
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        //对数组中的数组和对象进行再次劫持，递归
        data.forEach(function (item) {
          observer(item);
        });
      }
    }, {
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
    //如果是对象才观测
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__) {
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

  var ncname = '[a-zA-Z_][\\w\\-\\.]*'; // 标签名 <div></div>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 用来获取标签名：match后索引为1的

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配开始标签

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的key=value{"xx"| 'xx'| xx }

  var startTagClose = /^\s*(\/?)>/; // /> </div>
  //const doctype = /^<!DOCTYPE [^>]+>/i
  //const comment = /^<!\--/
  //const conditionalComment = /^<!\[/

  function start(tagName, attributes) {}


  function parserHTML(html) {
    function advance(len) {
      html = html.substring(len);
    }

    function parserStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          //标签名
          attrs: []
        };
        advance(start[0].length);

        var _end; //如果没有遇到标签结尾就会不停的解析


        var attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end.length);
        }
      }

      return false; //不是开始标签
    }

    while (html) {
      //要解析的内容是否存在
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parserStartTag(); //解析开始标签

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        break; // const endTagMatch = parserEndTag() //解析开始标签
        // if (endTagMatch) {
        // }
      }

      var text = void 0; //  {{name}}</div>

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
      }
    }
  }

  var compileToFunction = function compileToFunction(template) {
    //库 htmlparser2
    parserHTML(template);
  };

  function initMixin(Vue) {
    //表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //对数据进行初始化

      initState(vm); //vm.$options.data... 数据劫持

      if (vm.$options.el) {
        //将数据挂载到这个模版上
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //把模版转化成，对应的渲染函数=》虚拟dom概念 vnode =》diff算法 更新虚拟dom =》产生真实节点，更新

      if (!options.render) {
        //没有render函数，用template
        var template = options.template;

        if (!template && el) {
          //用户也没有传递template，就获取el的内容作为模版
          template = el.outerHTML;
          var render = compileToFunction(template); //把模版变成函数

          options.render = render;
        }
      }
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
