//函数防抖就是让某个函数在上一次执行后，
//满足等待某个时间内不再触发此函数后再执行，
//而在这个等待时间内再次触发此函数，等待时间会重新计算。

//我们网站经常会有这样的需求，就是滚动浏览器滚动条的时候，
//更新页面上的某些布局内容或者去调用后台的某接口查询内容。同样的，
//如果不对函数调用的频率加以限制的话，那么可能我们滚动一次滚动条就会产生N次的调用了。
//但是这次的情况跟上面的有所不同，我们不是要在每完成等待某个时间后去执行某函数，
//而是要每间隔某个时间去执行某函数，避免函数的过多执行，这个方式就叫函数节流。
function throttle(func,time) {
    let first = true;
    let timer = null;
    return function() {
        let me = this,
            args = arguments;
        if(first) {
            func.apply(me,args);
            return first = false;
        }
        if(timer) {
            //延时期间再触发就中断
            clearTimeout(timer)
            return false;
        }
        timer = setTimeout(function() {
            clearTimeout(timer);
            timer = null;
            func.apply(me,args);
        },time)
    } 
}
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {
    
      // Baseline setup
      // --------------
    
      // Establish the root object, `window` (`self`) in the browser, `global`
      // on the server, or `this` in some virtual machines. We use `self`
      // instead of `window` for `WebWorker` support.
      var root = typeof self == 'object' && self.self === self && self ||
                typeof global == 'object' && global.global === global && global ||
                this ||
                {};
    
      // Save the previous value of the `_` variable.
      var previousUnderscore = root._;
    
      // Save bytes in the minified (but not gzipped) version:
      var ArrayProto = Array.prototype, ObjProto = Object.prototype;
      var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
    
      // Create quick reference variables for speed access to core prototypes.
      var push = ArrayProto.push,
          slice = ArrayProto.slice,
          toString = ObjProto.toString,
          hasOwnProperty = ObjProto.hasOwnProperty;
    
      // All **ECMAScript 5** native function implementations that we hope to use
      // are declared here.
      var nativeIsArray = Array.isArray,
          nativeKeys = Object.keys,
          nativeCreate = Object.create;
    
      // Naked function reference for surrogate-prototype-swapping.
      //用来构造Object.create的polyfill
      var Ctor = function(){};
    
      // Create a safe reference to the Underscore object for use below.
      var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
      };
    
      // Export the Underscore object for **Node.js**, with
      // backwards-compatibility for their old module API. If we're in
      // the browser, add `_` as a global object.
      // (`nodeType` is checked to ensure that `module`
      // and `exports` are not HTML elements.)
      if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
          exports = module.exports = _;
        }
        exports._ = _;
      } else {
        root._ = _;
      }
    
      // Current version.
      _.VERSION = '1.8.3';
    
      // Internal function that returns an efficient (for current engines) version
      // of the passed-in callback, to be repeatedly applied in other Underscore
      // functions.
      var optimizeCb = function(func, context, argCount) {
        //void 0与void(0)等价，永远返回undefined,用来防止undefined被用户重写导致判断错误
        if (context === void 0) return func;
        switch (argCount) {
          case 1: return function(value) {
            return func.call(context, value);
          };
          // The 2-parameter case has been omitted only because no current consumers
          // made use of it.
          //因为没人用去掉了???
          case null:
          //好像是数组方法的参数回调方法
          case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
          };
          case 4: return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
        }
        return function() {
          return func.apply(context, arguments);
        };
      };
    
      var builtinIteratee;
      //迭代器?
      // An internal function to generate callbacks that can be applied to each
      // element in a collection, returning the desired result — either `identity`,
      // an arbitrary callback, a property matcher, or a property accessor.
      var cb = function(value, context, argCount) {
        //判断类型再调用optinizeCb
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
        return _.property(value);
        //这一句return的是一个接受一个对象为参数，返回这个对象的value属性的函数
      };
    
      // External wrapper for our callback generator. Users may customize
      // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
      // This abstraction hides the internal-only argCount argument.
      //开放的回调函数生成函数封装
      _.iteratee = builtinIteratee = function(value, context) {
        return cb(value, context, Infinity);
      };
    
      // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
      // This accumulates the arguments passed into an array, after a given index.
/**
 * 实现扩展运算符的作用，看起来很屌的一个函数
 */
      var restArgs = function(func, startIndex) {
        //
        //null是不可重写的，可以起到startIndex === undefined的作用
        //+startIndex转换为Number类型
        //把从startIndex开始往后的参数放到一个数组？？
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
          //如果没有传入startIndex，length是参数个数-定义的函数参数个数+1
          var length = Math.max(arguments.length - startIndex, 0),
              rest = Array(length),
              index = 0;
          for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
          }
          switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this, arguments[0], rest);
            case 2: return func.call(this, arguments[0], arguments[1], rest);
          }
          var args = Array(startIndex + 1);
          for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
          }
          args[startIndex] = rest;
          return func.apply(this, args);
        };
      };
    
      // An internal function for creating a new object that inherits from another.
      //Object.create的polyfill
      var baseCreate = function(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        //可以用 var result = {}; Object.setPrototypeOf(result,prototype);
        //不过根据mdn警告这个方法是一个很慢的操作，而且存在兼容性问题，推荐使用Object.create
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
      };
      //获取对象属性
      var shallowProperty = function(key) {
        return function(obj) {
          return obj == null ? void 0 : obj[key];
        };
      };
      //深层对象属性？？？
      var deepGet = function(obj, path) {
        var length = path.length;
        for (var i = 0; i < length; i++) {
          if (obj == null) return void 0;
          obj = obj[path[i]];
        }
        return length ? obj : void 0;
      };
    
      // Helper for collection methods to determine whether a collection
      // should be iterated as an array or as an object.
      // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
      // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
      var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
      var getLength = shallowProperty('length');
      //判断是否类数组
      var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
      };
    
      // Collection Functions
      // --------------------
    //基石
      // The cornerstone, an `each` implementation, aka `forEach`.
      // Handles raw objects in addition to array-likes. Treats all
      // sparse array-likes as if they were dense.
      //Array.prototype.forEach
      _.each = _.forEach = function(obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
          for (i = 0, length = obj.length; i < length; i++) {
            iteratee(obj[i], i, obj);
          }
        } else {
          var keys = _.keys(obj);
          for (i = 0, length = keys.length; i < length; i++) {
            iteratee(obj[keys[i]], keys[i], obj);
          }
        }
        return obj;
      };
    
      // Return the results of applying the iteratee to each element.
      _.map = _.collect = function(obj, iteratee, context) {
        //map方法iteratee可以是对象,如果是对象的话，下句生成的iteratee就是判断是否包含iteratee对象所有键值对的函数
        //返回true or false
        //此时map方法返回的是obj中每个属性是否包含iteratee的boolean数组
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
      };
      // Create a reducing function iterating left or right.
      var createReduce = function(dir) {
        // Wrap code that reassigns argument variables in a separate function than
        // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
        //dir取+1或-1，分别表示从前往后和从后往前的顺序
        var reducer = function(obj, iteratee, memo, initial) {
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length,
              index = dir > 0 ? 0 : length - 1;
          if (!initial) {
            memo = obj[keys ? keys[index] : index];
            index += dir;
          }
          for (; index >= 0 && index < length; index += dir) {
            var currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
          }
          return memo;
        };
    
        return function(obj, iteratee, memo, context) {
          var initial = arguments.length >= 3;
          return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
        };
      };
    
      // **Reduce** builds up a single result from a list of values, aka `inject`,
      // or `foldl`.
      _.reduce = _.foldl = _.inject = createReduce(1);
    
      // The right-associative version of reduce, also known as `foldr`.
      _.reduceRight = _.foldr = createReduce(-1);
    
      // Return the first value which passes a truth test. Aliased as `detect`.
      // function keyFinder(obj,func,context) {
      //   func = cb(func.context);
      //   for(i in obj) {
      //     if(func(obj[i],i)) {
      //       return i;
      //     }
      //   }
      //   return -1;
      // }
      //在数组，类数组或对象中找到满足条件的值或属性值
      _.find = _.detect = function(obj, predicate, context) {
        var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
        var key = keyFinder(obj, predicate, context);
        if (key !== void 0 && key !== -1) return obj[key];
      };
    
      // Return all the elements that pass a truth test.
      // Aliased as `select`.
      //过滤数组
      //predicate函数接受三个参数（值，索引，一个数组）与原生的Array.prototype.filter相同
      _.filter = _.select = function(obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function(value, index, list) {
          if (predicate(value, index, list)) results.push(value);
        });
        return results;
      };
    
      // Return all the elements for which a truth test fails.
      //反filter函数，返回不满足指定条件的元素数组
      _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
      };
    
      // Determine whether all of the elements match a truth test.
      // Aliased as `all`.
      _.every = _.all = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
      };
    
      // Determine if at least one element in the object matches a truth test.
      // Aliased as `any`.
      //至少一个满足条件就返回true
      _.some = _.any = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
      };
    
      // Determine if the array or object contains a given item (using `===`).
      // Aliased as `includes` and `include`.
      //这个guard参数作用？？
      //guard为true时即使指定了fromIndex也是从头开始遍历
      _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
      };
    
      // Invoke a method (with arguments) on every item in a collection.
      //args和多出的参数经过restArgs的封装会转换成一个数组，直接在后面的method.apply中使用
      _.invoke = restArgs(function(obj, path, args) {
        var contextPath, func;
        if (_.isFunction(path)) {
          func = path;
        } else if (_.isArray(path)) {
          contextPath = path.slice(0, -1);
          path = path[path.length - 1];
        }
        return _.map(obj, function(context) {
          var method = func;
          if (!method) {
            if (contextPath && contextPath.length) {
              context = deepGet(context, contextPath);
            }
            if (context == null) return void 0;
            method = context[path];
          }
          return method == null ? method : method.apply(context, args);
        });
      });
    
      // Convenience version of a common use case of `map`: fetching a property.
      //获取obj的属性值,key可以是字符串（浅层）或字符串数组（深层）
      _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
      };
    
      // Convenience version of a common use case of `filter`: selecting only objects
      // containing specific `key:value` pairs.
      _.where = function(obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
      };
    
      // Convenience version of a common use case of `find`: getting the first object
      // containing specific `key:value` pairs.
      _.findWhere = function(obj, attrs) {
        return _.find(obj, _.matcher(attrs));
      };
    
      // Return the maximum element (or element-based computation).
      //获取最大值或计算值的最大值
      _.max = function(obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
          obj = isArrayLike(obj) ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value != null && value > result) {
              result = value;
            }
          }
        } else {
          iteratee = cb(iteratee, context);
          _.each(obj, function(v, index, list) {
            computed = iteratee(v, index, list);
            if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
              result = v;
              lastComputed = computed;
            }
          });
        }
        return result;
      };
    
      // Return the minimum element (or element-based computation).
      _.min = function(obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
          obj = isArrayLike(obj) ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value != null && value < result) {
              result = value;
            }
          }
        } else {
          iteratee = cb(iteratee, context);
          _.each(obj, function(v, index, list) {
            computed = iteratee(v, index, list);
            if (computed < lastComputed || computed === Infinity && result === Infinity) {
              result = v;
              lastComputed = computed;
            }
          });
        }
        return result;
      };
    
      // Shuffle a collection.
      _.shuffle = function(obj) {
        return _.sample(obj, Infinity);
      };
    
      // Sample **n** random values from a collection using the modern version of the
      // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
      // If **n** is not specified, returns a single random element.
      // The internal `guard` argument allows it to work with `map`.
      //未指定n时返回一个随机位置的值
      //返回打乱顺序之后的obj前n项
      _.sample = function(obj, n, guard) {
        if (n == null || guard) {
          if (!isArrayLike(obj)) obj = _.values(obj);
          return obj[_.random(obj.length - 1)];
        }
        var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
        var length = getLength(sample);
        n = Math.max(Math.min(n, length), 0);
        var last = length - 1;
        for (var index = 0; index < n; index++) {
          var rand = _.random(index, last);
          var temp = sample[index];
          sample[index] = sample[rand];
          sample[rand] = temp;
        }
        return sample.slice(0, n);
      };
    
      // Sort the object's values by a criterion produced by an iteratee.
      //返回根据iteratee对元素的计算结果大小排序的原数组或对象值组成的数组
      _.sortBy = function(obj, iteratee, context) {
        var index = 0;
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function(value, key, list) {
          return {
            value: value,
            index: index++,
            criteria: iteratee(value, key, list)
          };
        }).sort(function(left, right) {
          var a = left.criteria;
          var b = right.criteria;
          if (a !== b) {
            if (a > b || a === void 0) return 1;
            if (a < b || b === void 0) return -1;
          }
          return left.index - right.index;
        }), 'value');
      };
    
      // An internal function used for aggregate(聚合) "group by" operations.
      var group = function(behavior, partition) {
        return function(obj, iteratee, context) {
          var result = partition ? [[], []] : {};
          iteratee = cb(iteratee, context);
          _.each(obj, function(value, index) {
            var key = iteratee(value, index, obj);
            behavior(result, value, key);
          });
          return result;
        };
      };
    
      // Groups the object's values by a criterion. Pass either a string attribute
      // to group by, or a function that returns the criterion.
      //根据给定iteratee对collection进行聚合分类操作返回一个对象，格式为
      //{A:[],B:[],etc}
      //传入的iteratee对元素进行计算之后应该返回的是想要的到的类别名
      _.groupBy = group(function(result, value, key) {
        if (_.has(result, key)) result[key].push(value); else result[key] = [value];
      });
    
      // Indexes the object's values by a criterion, similar to `groupBy`, but for
      // when you know that your index values will be unique.
      //对collection作唯一性聚合分类，即传入的计算方法应该对每一个元素返回唯一index值
      _.indexBy = group(function(result, value, key) {
        result[key] = value;
      });
    
      // Counts instances of an object that group by a certain criterion. Pass
      // either a string attribute to count by, or a function that returns the
      // criterion.
      //返回的是分类各项数目
      _.countBy = group(function(result, value, key) {
        if (_.has(result, key)) result[key]++; else result[key] = 1;
      });
      //UTF-16 编码：该编码法在 UCS-2 第0位面字符集的基础上利用 D800-DFFF 区段的
      //码位通过一定转换方式将超出2字节的字符编码为一对16比特长的码元(即32bit,4Bytes)，
      //称作代理码对 (surrogate pair)。
      // unicode 字符集。unicode 字符集使用使用多个字节来为字符编码，
      //按使用的字节数不同制订了不同方案，所有 unicode 编码方案前 1 个字节（256个码位）
      //的编码对应的字符都是 ASCII 字符集中的字符。
      //实际中通用的是UCS-2通用字符集，UCS-2字符集编码法有17个位面(16进制0到10表示17个位面)，每个位面都用2个字节来标记字符，
      //17个位面可以映射 1,112,064个字符，其中最常用最重要的是编号为 0 的位面，
      //里面包含了最常用的字符编码，称为基本多国语言平面BMP
      //Unicode 第 0 平面（BMP）中的编码被划分为不同区段，
      //各国文字符号、控制符、制表符、图形字符等 都有连续的分布，其中中文简繁体区段是 4E00-9FBF。
      //从第1位面开始，字符的unicode编码已经超出16位二进制数的范围，因此UCS-2无法使用2个字节直接编码BMP位面之外的字符。
      //但是，在 UCS-2 编码中，区段 UD800 到 UDFFF 的码位是闲置的保留位，因此，
      //可以使用这个区段中的码位通过一定的转换方式映射到其他位面的 unicode 编码。
      //在实际的字符传输和存储行为中，为了节省字节数，可能不会直接传输 unicode 编码，
      //而是使用 Unicode转换格式（Unicode Transformation Format，简称为UTF），
      //目前常见的 UTF格式有UTF-7, UTF-7.5, UTF-8, UTF-16, 以及 UTF-32，
      //他们是由 ITTF（Internet Engineering Task Force，互联网工程任务组）组织进行标准化的，
      //UTF-8 和 UTF-16 编码使用比较广泛。
      //第0位面可以舍去编号0直接用4位16进制数编码
      var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
      //三个正则分支分别是普通bmp字符，成对的代理项对（有的字符需要两个字节表示），未成对的代理项对
      // Safely create a real, live array from anything iterable.
      _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (_.isString(obj)) {
          // Keep surrogate pair characters together
          return obj.match(reStrSymbol);
        }
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
      };
    
      // Return the number of elements in an object.
      //数组长度或对象中键值个数
      _.size = function(obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
      };
    
      // Split a collection into two arrays: one whose elements all satisfy the given
      // predicate, and one whose elements all do not satisfy the predicate.
      //把collection分成两类，返回[[],[]]形式的数组，传入的iteratee应该返回true or false
      _.partition = group(function(result, value, pass) {
        result[pass ? 0 : 1].push(value);
      }, true);
    
      // Array Functions
      // ---------------
    
      // Get the first element of an array. Passing **n** will return the first N
      // values in the array. Aliased as `head` and `take`. The **guard** check
      // allows it to work with `_.map`.
      //返回第一个或前n个元素
      _.first = _.head = _.take = function(array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
      };
    
      // Returns everything but the last entry of the array. Especially useful on
      // the arguments object. Passing **n** will return all the values in
      // the array, excluding the last N.
      //返回除了最后一个或n个元素以外的所有
      _.initial = function(array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
      };
    
      // Get the last element of an array. Passing **n** will return the last N
      // values in the array.
      //返回最后一个或最后n个元素
      _.last = function(array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
      };
    
      // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
      // Especially useful on the arguments object. Passing an **n** will return
      // the rest N values in the array.
      //返回第一个或第n个元素以后的元素
      _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
      };
    
      // Trim out all falsy values from an array.
      //返回可以用Boolean转换为true的元素
      _.compact = function(array) {
        return _.filter(array, Boolean);
      };
    
      // Internal implementation of a recursive `flatten` function.
      //递归
      var flatten = function(input, shallow, strict, output) {
        output = output || [];
        var idx = output.length;
        for (var i = 0, length = getLength(input); i < length; i++) {
          var value = input[i];
          if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
            // Flatten current level of array or arguments object.
            if (shallow) {
              var j = 0, len = value.length;
              while (j < len) output[idx++] = value[j++];
            } else {
              flatten(value, shallow, strict, output);
              idx = output.length;
            }
          } else if (!strict) {
            output[idx++] = value;
          }
        }
        return output;
      };
      _.interflatten = flatten;

      //shallow为true表示要对数组作递归将数组中所有元素拆开输出一个数组，为false时只做一层分解
      // Flatten out an array, either recursively (by default), or just one level.
      _.flatten = function(array, shallow) {
        return flatten(array, shallow, false);
      };
    
      // Return a version of the array that does not contain the specified value(s).
      //与diffrence的区别：
      //_.diffrence返回array和otherArrays的不同的元素数组，即otherArrays是与array有重合的数组
      //这里的restArgs包装之后把传入的值包装成数组再与array传入_.diffrence方法得到的是不包含他们的数组
      //所以without方法第一个参数之后的参数应该是第一个数组参数中的值
      _.without = restArgs(function(array, otherArrays) {
        return _.difference(array, otherArrays);
      });
    
      // Produce a duplicate-free version of the array. If the array has already
      // been sorted, you have the option of using a faster algorithm.
      // Aliased as `unique`.
      //返回数组元素或元素计算值唯一的数组
      _.uniq = _.unique = function(array, isSorted, iteratee, context) {
        //如果没有传入isSorted,就默认为false,参数要移位，扩展成4个参数
        if (!_.isBoolean(isSorted)) {
          context = iteratee;
          iteratee = isSorted;
          isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
          var value = array[i],
              computed = iteratee ? iteratee(value, i, array) : value;
          if (isSorted) {
            //如果数组是经过排序的，用下面的这种方式更快
            //第一个（索引为0）直接push进result，后面的再比较是否相同
            if (!i || seen !== computed) result.push(value);
            seen = computed;
          } else if (iteratee) {
            //没经过排序的
            //需要用_.contains来做判断，比较慢
            if (!_.contains(seen, computed)) {
              seen.push(computed);
              result.push(value);
            }
          } else if (!_.contains(result, value)) {
            result.push(value);
          }
        }
        return result;
      };
    
      // Produce an array that contains the union: each distinct element from all of
      // the passed-in arrays.
      //返回多个数组的并集
      _.union = restArgs(function(arrays) {
        return _.uniq(flatten(arrays, true, true));
      });
    
      // Produce an array that contains every item shared between all the
      // passed-in arrays.
      //返回交集
      _.intersection = function(array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
          var item = array[i];
          if (_.contains(result, item)) continue;
          var j;
          for (j = 1; j < argsLength; j++) {
            if (!_.contains(arguments[j], item)) break;
          }
          if (j === argsLength) result.push(item);
        }
        return result;
      };
    
      // Take the difference between one array and a number of other arrays.
      // Only the elements present in just the first array will remain.
      _.difference = restArgs(function(array, rest) {
        //把rest数组做一层分解：[1,2,3,[1,3,[1,2]]] => [1,3,[1,2]]
        rest = flatten(rest, true, true);
        //返回array中不被rest包含的元素
        return _.filter(array, function(value){
          return !_.contains(rest, value);
        });
      });
    
      // Complement of _.zip. Unzip accepts an array of arrays and groups
      // each array's elements on shared indices.
      //一组数组合并成一个数组，每个索引上的值合并为一个数组
      _.unzip = function(array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);
    
        for (var index = 0; index < length; index++) {
          //result每个索引上的值是array中每个数组对应索引上的值组成的数组
          result[index] = _.pluck(array, index);
        }
        return result;
      };
    
      // Zip together multiple lists into a single array -- elements that share
      // an index go together.
      //与—_.unzip作用相同，但接受的参数不是一个包含多个数组的数组而是多个数组
      //相当于参数用了扩展运算符
      _.zip = restArgs(_.unzip);
    
      // Converts lists into objects. Pass either a single array of `[key, value]`
      // pairs, or two parallel arrays of the same length -- one of keys, and one of
      // the corresponding values. Passing by pairs is the reverse of _.pairs.
      //传入键值对数组或一个key数组一个value数组，生成一个包含这些键值的对象
      _.object = function(list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
          if (values) {
            result[list[i]] = values[i];
          } else {
            result[list[i][0]] = list[i][1];
          }
        }
        return result;
      };
    
      // Generator function to create the findIndex and findLastIndex functions.
      var createPredicateIndexFinder = function(dir) {
        return function(array, predicate, context) {
          predicate = cb(predicate, context);
          var length = getLength(array);
          var index = dir > 0 ? 0 : length - 1;
          for (; index >= 0 && index < length; index += dir) {
            if (predicate(array[index], index, array)) return index;
          }
          return -1;
        };
      };
      //从前往后和从后往前寻找第一个符合条件的值的index
      // Returns the first index on an array-like that passes a predicate test.
      _.findIndex = createPredicateIndexFinder(1);
      _.findLastIndex = createPredicateIndexFinder(-1);
    
      // Use a comparator(比较器) function to figure out the smallest index at which
      // an object should be inserted so as to maintain order. Uses binary search.
      //返回一个index，使得obj插入到这个index时维持itratee计算值小到大的顺序
      _.sortedIndex = function(array, obj, iteratee, context) {
        //只一个参数有效
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
          var mid = Math.floor((low + high) / 2);
          if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
        }
        return low;
      };
    
      // Generator function to create the indexOf and lastIndexOf functions.
      var createIndexFinder = function(dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
          var i = 0, length = getLength(array);
          if (typeof idx == 'number') {
            if (dir > 0) {
              i = idx >= 0 ? idx : Math.max(idx + length, i);
            } else {
              length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            }
          } else if (sortedIndex && idx && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
          }
          if (item !== item) {
            idx = predicateFind(slice.call(array, i, length), _.isNaN);
            return idx >= 0 ? idx + i : -1;
          }
          for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx;
          }
          return -1;
        };
      };
    
      // Return the position of the first occurrence of an item in an array,
      // or -1 if the item is not included in the array.
      // If the array is large and already in sort order, pass `true`
      // for **isSorted** to use binary search.
      //根据值找index值，如果时经过排序的数组，第三个参数传入true可以用到sortedIndex方法中的
      //二分查找，加快速度
      _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
      _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
    
      // Generate an integer Array containing an arithmetic progression. A port of
      // the native Python `range()` function. See
      // [the Python documentation](http://docs.python.org/library/functions.html#range).
      //只有一个参数时范围就是0到这个数
      //得到一个从start到stop等差为step的数列数组
      _.range = function(start, stop, step) {
        if (stop == null) {
          stop = start || 0;
          start = 0;
        }
        if (!step) {
          step = stop < start ? -1 : 1;
        }
        
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);
    
        for (var idx = 0; idx < length; idx++, start += step) {
          range[idx] = start;
        }
    
        return range;
      };
    
      // Split an **array** into several arrays containing **count** or less elements
      // of initial array.
      //count是必须的。返回分割为长度为包含多个长度为count数组的数组
      _.chunk = function(array, count) {
        if (count == null || count < 1) return [];
    
        var result = [];
        var i = 0, length = array.length;
        while (i < length) {
          result.push(slice.call(array, i, i += count));
        }
        return result;
      };
    
      // Function (ahem) Functions
      // ------------------
    
      // Determines whether to execute a function as a constructor
      // or a normal function with the provided arguments.
      var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
      };
    
      // Create a function bound to a given object (assigning `this`, and arguments,
      // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
      // available.
      //function.prototype.bind
      _.bind = restArgs(function(func, context, args) {
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var bound = restArgs(function(callArgs) {
          return executeBound(func, bound, context, this, args.concat(callArgs));
        });
        return bound;
      });
    
      // Partially apply a function by creating a version that has had some of its
      // arguments pre-filled, without changing its dynamic `this` context. _ acts
      // as a placeholder by default, allowing any combination of arguments to be
      // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
      //绑定参数
      //通过设置placeholder使boundArgs与placeholder全等的不被绑定
      _.partial = restArgs(function(func, boundArgs) {
        var placeholder = _.partial.placeholder;
        var bound = function() {
          var position = 0, length = boundArgs.length;
          var args = Array(length);
          for (var i = 0; i < length; i++) {
            args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
          }
          while (position < arguments.length) args.push(arguments[position++]);
          return executeBound(func, bound, this, this, args);
        };
        return bound;
      });
    
      _.partial.placeholder = _;
    
      // Bind a number of an object's methods to that object. Remaining arguments
      // are the method names to be bound. Useful for ensuring that all callbacks
      // defined on an object belong to it.
      //绑定一个对象上多个方法的this,keys必须是数组
      _.bindAll = restArgs(function(obj, keys) {
        keys = flatten(keys, false, false);
        var index = keys.length;
        if (index < 1) throw new Error('bindAll must be passed function names');
        while (index--) {
          var key = keys[index];
          obj[key] = _.bind(obj[key], obj);
        }
      });
    
      // Memoize an expensive function by storing its results.
      //包装需要多次执行并且花销较大的函数，缓存结果，使之后对相同参数的执行更高效
      _.memoize = function(func, hasher) {
        var memoize = function(key) {
          //memorize.cache的定义再闭包外面，也就是说生成的函数是带结果缓存的，
          //适合多次调用的函数
          var cache = memoize.cache;
          var address = '' + (hasher ? hasher.apply(this, arguments) : key);
          //如果已经有对key参数的操作结果，则直接返回缓存中的结果
          //缓存的键值是参数列表中的第一个
          //也就是说memoFunc(a,b)之后执行memoFunc(a)返回相同的结果
          if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
          return cache[address];
        };
        memoize.cache = {};
        return memoize;
      };
    
      // Delays a function for the given number of milliseconds, and then calls
      // it with the arguments supplied.
      //给定参数，延迟执行
      _.delay = restArgs(function(func, wait, args) {
        return setTimeout(function() {
          return func.apply(null, args);
        }, wait);
      });
    
      // Defers a function, scheduling it to run after the current call stack has
      // cleared.
      //通过把
      //异步执行(放到下一个事件队列中)效果等同于setTimeout(func)
      //用_.partial把_.delay的第二个参数（延迟时间）绑定为1，其他参数不绑定
      _.defer = _.partial(_.delay, _, 1);
    
      // Returns a function, that, when invoked, will only be triggered at most once
      // during a given window of time. Normally, the throttled function will run
      // as much as it can, without ever going more than once per `wait` duration;
      // but if you'd like to disable the execution on the leading edge, pass
      // `{leading: false}`. To disable execution on the trailing edge, ditto.
      //节流函数
      _.throttle = function(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};
    
        var later = function() {
          previous = options.leading === false ? 0 : _.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };
        //wiat时间内无论触发几次只能执行一次，也就是触发期间，总是以wait为周期执行
        var throttled = function() {
          var now = _.now();
          //阻止首次触发的执行
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
            //禁止最后一次延迟的调用
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
    
        throttled.cancel = function() {
          clearTimeout(timeout);
          previous = 0;
          timeout = context = args = null;
        };
    
        return throttled;
      };
    
      // Returns a function, that, as long as it continues to be invoked, will not
      // be triggered. The function will be called after it stops being called for
      // N milliseconds. If `immediate` is passed, trigger the function on the
      // leading edge, instead of the trailing.
      //防抖函数，持续触发的函数，在其最后一次触发之后wait时间后才执行
      //immediate为true时不在等待时间内首次触发就直接执行，而不是延时执行，在之后进行计时，计时内触发则重新计时，
      //到时之后触发则直接执行
      _.debounce = function(func, wait, immediate) {
        var timeout, result;
    
        var later = function(context, args) {
          timeout = null;
          if (args) result = func.apply(context, args);
        };
    
        var debounced = restArgs(function(args) {
          if (timeout) clearTimeout(timeout);
          if (immediate) {
            //是否直接执行取决于immediate和是否处于防抖动时间内
            var callNow = !timeout;
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(this, args);
          } else {
            timeout = _.delay(later, wait, this, args);
          }
    
          return result;
        });
    
        debounced.cancel = function() {
          clearTimeout(timeout);
          timeout = null;
        };
    
        return debounced;
      };
    
      // Returns the first function passed as an argument to the second,
      // allowing you to adjust arguments, run code before and after, and
      // conditionally execute the original function.
      //把func包装到wrapper中做参数
      _.wrap = function(func, wrapper) {
        return _.partial(wrapper, func);
      };
    
      // Returns a negated version of the passed-in predicate.
      //predicate结果取反版本的函数
      _.negate = function(predicate) {
        return function() {
          return !predicate.apply(this, arguments);
        };
      };
    
      // Returns a function that is the composition of a list of functions, each
      // consuming the return value of the function that follows.
      //把一组函数组成函数链，参数列表中前一个函数接受后一个函数返回的结果为参数
      _.compose = function() {
        var args = arguments;
        var start = args.length - 1;
        return function() {
          var i = start;
          var result = args[start].apply(this, arguments);
          while (i--) result = args[i].call(this, result);
          return result;
        };
      };
    
      // Returns a function that will only be executed on and after the Nth call.
      //封装成第n次调用开始才执行的版本，前n-1次调用不执行
      _.after = function(times, func) {
        return function() {
          if (--times < 1) {
            return func.apply(this, arguments);
          }
        };
      };
    
      // Returns a function that will only be executed up to (but not including) the Nth call.
      //封装成只有前n-1次执行的函数，times必须大于等于1
      _.before = function(times, func) {
        var memo;
        return function() {
          if (--times > 0) {
            memo = func.apply(this, arguments);
          }
          if (times <= 1) func = null;
          return memo;
        };
      };
    
      // Returns a function that will be executed at most one time, no matter how
      // often you call it. Useful for lazy initialization.
      //封装成只有第一次调用才执行的函数
      _.once = _.partial(_.before, 2);
    
      _.restArgs = restArgs;
    
      // Object Functions
      // ----------------
    
      // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
      //ie < 9的bug: 对象上被重写的Object原型对象方法不能枚举 

      //判断是否有此bug
      var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
      var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                          'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
    
      var collectNonEnumProps = function(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
    
        // Constructor is a special case.
        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
    
        while (nonEnumIdx--) {
          prop = nonEnumerableProps[nonEnumIdx];
          //不是不能枚举吗？？ 这里的prop in obj还能返回true？  [疑点]
          if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
            keys.push(prop);
          }
        }
      };
    
      // Retrieve the names of an object's own properties.
      // Delegates to **ECMAScript 5**'s native `Object.keys`.
      _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };
    
      // Retrieve all the property names of an object.
      _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };
    
      // Retrieve the values of an object's properties.
      //同Object.values(obj)
      _.values = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
          values[i] = obj[keys[i]];
        }
        return values;
      };
    
      // Returns the results of applying the iteratee to each element of the object.
      // In contrast to _.map it returns an object.
      //_.map的返回对象版
      _.mapObject = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {};
        for (var index = 0; index < length; index++) {
          var currentKey = keys[index];
          results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
      };
    
      // Convert an object into a list of `[key, value]` pairs.
      // The opposite of _.object.
      //与Object.entries相同
      _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
          pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
      };
    
      // Invert the keys and values of an object. The values must be serializable.
      //键值反转
      _.invert = function(obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          result[obj[keys[i]]] = keys[i];
        }
        return result;
      };
    
      // Return a sorted list of the function names available on the object.
      // Aliased as `methods`.
      //返回一个对象上所有方法名排序后的数组
      _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
          if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
      };
    
      // An internal function for creating assigner functions.
      var createAssigner = function(keysFunc, defaults) {
        return function(obj) {
          var length = arguments.length;
          if (defaults) obj = Object(obj);
          if (length < 2 || obj == null) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              //defaults为真则保留原来的对象上的属性不会被覆盖
              if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
          }
          return obj;
        };
      };
    
      // Extend a given object with all the properties in passed-in object(s).
      //复制所有属性包括原型上的到第一个对象上
      _.extend = createAssigner(_.allKeys);
    
      // Assigns a given object with all the own properties in the passed-in object(s).
      // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
      //复制对象自有的属性
      _.extendOwn = _.assign = createAssigner(_.keys);
    
      // Returns the first key on an object that passes a predicate test.
      //找到对象上满足条件的键值，predicate中传入的参数是属性值，键值，对象
      _.findKey = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          if (predicate(obj[key], key, obj)) return key;
        }
      };
    
      // Internal pick helper function to determine if `obj` has key `key`.
      var keyInObj = function(value, key, obj) {
        return key in obj;
      };
    
      // Return a copy of the object only containing the whitelisted properties.
      //从对象中挑出指定的属性组成一个对象返回，第一个参数之后的参数可以是一个键值list，
      //或者接受三个参数obj，iteratee函数和context
      _.pick = restArgs(function(obj, keys) {
        var result = {}, iteratee = keys[0];
        if (obj == null) return result;
        if (_.isFunction(iteratee)) {
          if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
          keys = _.allKeys(obj);
        } else {
          iteratee = keyInObj;
          keys = flatten(keys, false, false);
          obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var value = obj[key];
          if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
      });
    
      // Return a copy of the object without the blacklisted properties.
      //返回不满足条件的属性(或者剔除掉指定的)组成的对象
      _.omit = restArgs(function(obj, keys) {
        var iteratee = keys[0], context;
        if (_.isFunction(iteratee)) {
          iteratee = _.negate(iteratee);
          if (keys.length > 1) context = keys[1];
        } else {
          keys = _.map(flatten(keys, false, false), String);
          iteratee = function(value, key) {
            //遍历obj的key值，key不包含在指定的keys中则返回true（包含到结果对象中）
            return !_.contains(keys, key);
          };
        }
        return _.pick(obj, iteratee, context);
      });
    
      // Fill in a given object with default properties.
      //_.extend的不覆盖原属性版本
      _.defaults = createAssigner(_.allKeys, true);
    
      // Creates an object that inherits from the given prototype object.
      // If additional properties are provided then they will be added to the
      // created object.
      _.create = function(prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
      };
    
      // Create a (shallow-cloned) duplicate of an object.
      //浅复制一个对象或数组，因为内部用的是_.extend，会把obj原型上的属性复制到对象上
      _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
      };
    
      // Invokes interceptor with the obj, and then returns obj.
      // The primary purpose of this method is to "tap into" a method chain, in
      // order to perform operations on intermediate results within the chain.
      //对对象做拦截操作再返回，好像没什么卵用 [疑点]
      _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
      };
    
      // Returns whether an object has a given set of `key:value` pairs.
      //返回object中是否包含attrs的键值对
      _.isMatch = function(object, attrs) {
        //attrs必须是对象
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
      };
    
    
      // Internal recursive comparison function for `isEqual`.
      var eq, deepEq; 
      eq = function(a, b, aStack, bStack) {    // [重点]
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        //1/0 == Infinity 1 / -0 === -Infinity 
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
      };
    
      // Internal recursive comparison function for `isEqual`.
      deepEq = function(a, b, aStack, bStack) { //[疑点]
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
          // Strings, numbers, regular expressions, dates, and booleans are compared by value.
          case '[object RegExp]':
          // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
          case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
          case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
          case '[object Date]':
          case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
          case '[object Symbol]':
            return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }
    
        var areArrays = className === '[object Array]';
        if (!areArrays) {
          if (typeof a != 'object' || typeof b != 'object') return false;
    
          // Objects with different constructors are not equivalent, but `Object`s or `Array`s
          // from different frames are.
          var aCtor = a.constructor, bCtor = b.constructor;
          if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                                   _.isFunction(bCtor) && bCtor instanceof bCtor)
                              && ('constructor' in a && 'constructor' in b)) {
            return false;
          }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
          // Linear search. Performance is inversely proportional to the number of
          // unique nested structures.
          if (aStack[length] === a) return bStack[length] === b;
        }
    
        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);
    
        // Recursively compare objects and arrays.
        if (areArrays) {
          // Compare array lengths to determine if a deep comparison is necessary.
          length = a.length;
          if (length !== b.length) return false;
          // Deep compare the contents, ignoring non-numeric properties.
          while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) return false;
          }
        } else {
          // Deep compare objects.
          var keys = _.keys(a), key;
          length = keys.length;
          // Ensure that both objects contain the same number of properties before comparing deep equality.
          if (_.keys(b).length !== length) return false;
          while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
          }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
      };
    
      // Perform a deep comparison to check if two objects are equal.
      _.isEqual = function(a, b) {
        return eq(a, b);
      };
    
      // Is a given array, string, or object empty?
      // An "empty" object has no enumerable own-properties.
      _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
      };
    
      // Is a given value a DOM element?
      _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
      };
    
      // Is a given value an array?
      // Delegates to ECMA5's native Array.isArray
      _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
      };
    
      // Is a given variable an object?
      //函数也是对象
      _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      };
    
      // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
      _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
        _['is' + name] = function(obj) {
          return toString.call(obj) === '[object ' + name + ']';
        };
      });
    
      // Define a fallback version of the method in browsers (ahem, IE < 9), where
      // there isn't any inspectable "Arguments" type.
      if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
          return _.has(obj, 'callee');
        };
      }
    
      // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
      // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
      var nodelist = root.document && root.document.childNodes;
      if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
        _.isFunction = function(obj) {
          return typeof obj == 'function' || false;
        };
      }
    
      // Is a given object a finite number?
      _.isFinite = function(obj) {
        //原生的isFinite参数可以是数组，对象，字符串，数字，布尔，null,undefined但是不能是symbol
        return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
      };
    
      // Is the given value `NaN`?
      _.isNaN = function(obj) {
        return _.isNumber(obj) && isNaN(obj);
      };
    
      // Is a given value a boolean?
      _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
      };
    
      // Is a given value equal to null?
      _.isNull = function(obj) {
        return obj === null;
      };
    
      // Is a given variable undefined?
      _.isUndefined = function(obj) {
        return obj === void 0;
      };
    
      // Shortcut function for checking if an object has a given property directly
      // on itself (in other words, not on a prototype).
      //path可以是一个包含层级递进的键值的数组
      _.has = function(obj, path) {
        if (!_.isArray(path)) {
          return obj != null && hasOwnProperty.call(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
          var key = path[i];
          if (obj == null || !hasOwnProperty.call(obj, key)) {
            return false;
          }
          obj = obj[key];
        }
        return !!length;
      };
    
      // Utility Functions
      // -----------------
    
      // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
      // previous owner. Returns a reference to the Underscore object.
      //释放underscore对变量_的控制权，const variable = _.noconfict() 自定义underscore名称
      _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
      };
    
      // Keep the identity function around for default iteratees.
      //默认的iteratee函数，不做任何操作直接返回
      _.identity = function(value) {
        return value;
      };
    
      // Predicate-generating functions. Often useful outside of Underscore.
      //未使用
      _.constant = function(value) {
        return function() {
          return value;
        };
      };
      
      _.noop = function(){};
      //返回获取参数对象特定属性的函数
      _.property = function(path) {
        if (!_.isArray(path)) {
          return shallowProperty(path);
        }
        return function(obj) {
          return deepGet(obj, path);
        };
      };
      
      // Generates a function for a given object that returns a given property.
      //与_.property相反，获取特定对象的参数属性的函数
      _.propertyOf = function(obj) {
        if (obj == null) {
          return function(){};
        }
        return function(path) {
          return !_.isArray(path) ? obj[path] : deepGet(obj, path);
        };
      };
    
      // Returns a predicate for checking whether an object has a given set of
      // `key:value` pairs.
      //返回检查参数对象是否包含指定键值对的函数
      _.matcher = _.matches = function(attrs) {
        attrs = _.extendOwn({}, attrs);
        return function(obj) {
          return _.isMatch(obj, attrs);
        };
      };
    
      // Run a function **n** times.
      //执行一个iteratee函数n次，但iteratee只依次接受从0到n-1为参数，返回结果组成的数组
      _.times = function(n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
      };
    
      // Return a random integer between min and max (inclusive).
      _.random = function(min, max) {
        if (max == null) {
          max = min;
          min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
      };
    
      // A (possibly faster) way to get the current timestamp as an integer.
      //时间戳函数
      _.now = Date.now || function() {
        return new Date().getTime();
      };
    
      // List of HTML entities for escaping.
      //对html预留字符和字符实体对照
      var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
      };//解码
      var unescapeMap = _.invert(escapeMap);
    
      // Functions for escaping and unescaping strings to/from HTML interpolation.
      var createEscaper = function(map) {
        var escaper = function(match) {
          return map[match];
        };
        // Regexes for identifying a key that needs to be escaped.
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
          string = string == null ? '' : '' + string;
          return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
      };
      //转义字符串中的html预留字符
      _.escape = createEscaper(escapeMap);
      //反转
      _.unescape = createEscaper(unescapeMap);
    
      // Traverses the children of `obj` along `path`. If a child is a function, it
      // is invoked with its parent as context. Returns the value of the final
      // child, or `fallback` if any child is undefined.
      //根据path数组中的顺序处理obj中的属性，如果是方法，就执行，返回最后一个返回值，遇到undefined则返回fallback
      _.result = function(obj, path, fallback) {
        if (!_.isArray(path)) path = [path];
        var length = path.length;
        if (!length) {
          return _.isFunction(fallback) ? fallback.call(obj) : fallback;
        }
        for (var i = 0; i < length; i++) {
          var prop = obj == null ? void 0 : obj[path[i]];
          if (prop === void 0) {
            prop = fallback;
            i = length; // Ensure we don't continue iterating.
          }
          obj = _.isFunction(prop) ? prop.call(obj) : prop;
        }
        return obj;
      };
    
      // Generate a unique integer id (unique within the entire client session).
      // Useful for temporary DOM ids.
      //生成全局唯一id，可以加前缀
      var idCounter = 0;
      _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
      };
    
      // By default, Underscore uses ERB-style template delimiters, change the
      // following template settings to use alternative delimiters.
      //模板
      _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
    
      // When customizing `templateSettings`, if you don't want to define an
      // interpolation, evaluation or escaping regex, we need one that is
      // guaranteed not to match.
      var noMatch = /(.)^/;
    
      // Certain characters need to be escaped so that they can be put into a
      // string literal.
      var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',//行分隔符
        '\u2029': 'u2029'//段落分隔符
      };
    
      var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
    
      var escapeChar = function(match) {
        return '\\' + escapes[match];
      };
    
      // JavaScript micro-templating, similar to John Resig's implementation.
      // Underscore templating handles arbitrary delimiters, preserves whitespace,
      // and correctly escapes quotes within interpolated code.
      // NB: `oldSettings` only exists for backwards compatibility.
      _.template = function(text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);
    
        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');
    
        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
          source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
          index = offset + match.length;
    
          if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
          } else if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
          } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
          }
    
          // Adobe VMs need the match returned to produce the correct offset.
          return match;
        });
        source += "';\n";
    
        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
    
        source = "var __t,__p='',__j=Array.prototype.join," +
          "print=function(){__p+=__j.call(arguments,'');};\n" +
          source + 'return __p;\n';
    
        var render;
        try {
          render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
          e.source = source;
          throw e;
        }
    
        var template = function(data) {
          return render.call(this, data, _);
        };
    
        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';
    
        return template;
      };
    
      // Add a "chain" function. Start chaining a wrapped Underscore object.
      _.chain = function(obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
      };
    
      // OOP
      // ---------------
      // If Underscore is called as a function, it returns a wrapped object that
      // can be used OO-style. This wrapper holds altered versions of all the
      // underscore functions. Wrapped objects may be chained.
    
      // Helper function to continue chaining intermediate results.
      var chainResult = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
      };
    
      // Add your own custom functions to the Underscore object.
      _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
          var func = _[name] = obj[name];
          _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
          };
        });
        return _;
      };
    
      // Add all of the Underscore functions to the wrapper object.
      _.mixin(_);
    
      // Add all mutator Array functions to the wrapper.
      _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          var obj = this._wrapped;
          method.apply(obj, arguments);
          if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
          return chainResult(this, obj);
        };
      });
    
      // Add all accessor Array functions to the wrapper.
      _.each(['concat', 'join', 'slice'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          return chainResult(this, method.apply(this._wrapped, arguments));
        };
      });
    
      // Extracts the result from a wrapped and chained object.
      _.prototype.value = function() {
        return this._wrapped;
      };
    
      // Provide unwrapping proxy for some methods used in engine operations
      // such as arithmetic and JSON stringification.
      _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
    
      _.prototype.toString = function() {
        return String(this._wrapped);
      };
    
      // AMD registration happens at the end for compatibility with AMD loaders
      // that may not enforce next-turn semantics on modules. Even though general
      // practice for AMD registration is to be anonymous, underscore registers
      // as a named module because, like jQuery, it is a base library that is
      // popular enough to be bundled in a third party lib, but not be part of
      // an AMD load request. Those cases could generate an error when an
      // anonymous define() is called outside of a loader request.
      if (typeof define == 'function' && define.amd) {
        define('underscore', [], function() {
          return _;
        });
      }
    }());