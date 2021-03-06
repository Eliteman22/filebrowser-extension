(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory(global.vega = {});
}(typeof self !== 'undefined' ? self : this, function (exports) { 'use strict';

  function accessor(fn, fields, name) {
    fn.fields = fields || [];
    fn.fname = name;
    return fn;
  }

  function accessorName(fn) {
    return fn == null ? null : fn.fname;
  }

  function accessorFields(fn) {
    return fn == null ? null : fn.fields;
  }

  function error(message) {
    throw Error(message);
  }

  function splitAccessPath(p) {
    var path = [],
        q = null,
        b = 0,
        n = p.length,
        s = '',
        i, j, c;

    p = p + '';

    function push() {
      path.push(s + p.substring(i, j));
      s = '';
      i = j + 1;
    }

    for (i=j=0; j<n; ++j) {
      c = p[j];
      if (c === '\\') {
        s += p.substring(i, j);
        i = ++j;
      } else if (c === q) {
        push();
        q = null;
        b = -1;
      } else if (q) {
        continue;
      } else if (i === b && c === '"') {
        i = j + 1;
        q = c;
      } else if (i === b && c === "'") {
        i = j + 1;
        q = c;
      } else if (c === '.' && !b) {
        if (j > i) {
          push();
        } else {
          i = j + 1;
        }
      } else if (c === '[') {
        if (j > i) push();
        b = i = j + 1;
      } else if (c === ']') {
        if (!b) error('Access path missing open bracket: ' + p);
        if (b > 0) push();
        b = 0;
        i = j + 1;
      }
    }

    if (b) error('Access path missing closing bracket: ' + p);
    if (q) error('Access path missing closing quote: ' + p);

    if (j > i) {
      j++;
      push();
    }

    return path;
  }

  var isArray = Array.isArray;

  function isObject(_) {
    return _ === Object(_);
  }

  function isString(_) {
    return typeof _ === 'string';
  }

  function $(x) {
    return isArray(x) ? '[' + x.map($) + ']'
      : isObject(x) || isString(x) ?
        // Output valid JSON and JS source strings.
        // See http://timelessrepo.com/json-isnt-a-javascript-subset
        JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
      : x;
  }

  function field(field, name) {
    var path = splitAccessPath(field),
        code = 'return _[' + path.map($).join('][') + '];';

    return accessor(
      Function('_', code),
      [(field = path.length===1 ? path[0] : field)],
      name || field
    );
  }

  var empty = [];

  var id = field('id');

  var identity = accessor(function(_) { return _; }, empty, 'identity');

  var zero = accessor(function() { return 0; }, empty, 'zero');

  var one = accessor(function() { return 1; }, empty, 'one');

  var truthy = accessor(function() { return true; }, empty, 'true');

  var falsy = accessor(function() { return false; }, empty, 'false');

  function log(method, level, input) {
    var args = [level].concat([].slice.call(input));
    console[method].apply(console, args); // eslint-disable-line no-console
  }

  var None  = 0;
  var Error$1 = 1;
  var Warn  = 2;
  var Info  = 3;
  var Debug = 4;

  function logger(_) {
    var level = _ || None;
    return {
      level: function(_) {
        if (arguments.length) {
          level = +_;
          return this;
        } else {
          return level;
        }
      },
      error: function() {
        if (level >= Error$1) log('error', 'ERROR', arguments);
        return this;
      },
      warn: function() {
        if (level >= Warn) log('warn', 'WARN', arguments);
        return this;
      },
      info: function() {
        if (level >= Info) log('log', 'INFO', arguments);
        return this;
      },
      debug: function() {
        if (level >= Debug) log('log', 'DEBUG', arguments);
        return this;
      }
    }
  }

  function peek(array) {
    return array[array.length - 1];
  }

  function toNumber(_) {
    return _ == null || _ === '' ? null : +_;
  }

  function exp(sign) {
    return function(x) { return sign * Math.exp(x); };
  }

  function log$1(sign) {
    return function(x) { return Math.log(sign * x); };
  }

  function pow(exponent) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    };
  }

  function pan(domain, delta, lift, ground) {
    var d0 = lift(domain[0]),
        d1 = lift(peek(domain)),
        dd = (d1 - d0) * delta;

    return [
      ground(d0 - dd),
      ground(d1 - dd)
    ];
  }

  function panLinear(domain, delta) {
    return pan(domain, delta, toNumber, identity);
  }

  function panLog(domain, delta) {
    var sign = Math.sign(domain[0]);
    return pan(domain, delta, log$1(sign), exp(sign));
  }

  function panPow(domain, delta, exponent) {
    return pan(domain, delta, pow(exponent), pow(1/exponent));
  }

  function zoom(domain, anchor, scale, lift, ground) {
    var d0 = lift(domain[0]),
        d1 = lift(peek(domain)),
        da = anchor != null ? lift(anchor) : (d0 + d1) / 2;

    return [
      ground(da + (d0 - da) * scale),
      ground(da + (d1 - da) * scale)
    ];
  }

  function zoomLinear(domain, anchor, scale) {
    return zoom(domain, anchor, scale, toNumber, identity);
  }

  function zoomLog(domain, anchor, scale) {
    var sign = Math.sign(domain[0]);
    return zoom(domain, anchor, scale, log$1(sign), exp(sign));
  }

  function zoomPow(domain, anchor, scale, exponent) {
    return zoom(domain, anchor, scale, pow(exponent), pow(1/exponent));
  }

  function array(_) {
    return _ != null ? (isArray(_) ? _ : [_]) : [];
  }

  function isFunction(_) {
    return typeof _ === 'function';
  }

  function compare(fields, orders) {
    var idx = [],
        cmp = (fields = array(fields)).map(function(f, i) {
          if (f == null) {
            return null;
          } else {
            idx.push(i);
            return isFunction(f) ? f
              : splitAccessPath(f).map($).join('][');
          }
        }),
        n = idx.length - 1,
        ord = array(orders),
        code = 'var u,v;return ',
        i, j, f, u, v, d, t, lt, gt;

    if (n < 0) return null;

    for (j=0; j<=n; ++j) {
      i = idx[j];
      f = cmp[i];

      if (isFunction(f)) {
        d = 'f' + i;
        u = '(u=this.' + d + '(a))';
        v = '(v=this.' + d + '(b))';
        (t = t || {})[d] = f;
      } else {
        u = '(u=a['+f+'])';
        v = '(v=b['+f+'])';
      }

      d = '((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))';

      if (ord[i] !== 'descending') {
        gt = 1;
        lt = -1;
      } else {
        gt = -1;
        lt = 1;
      }

      code += '(' + u+'<'+v+'||u==null)&&v!=null?' + lt
        + ':(u>v||v==null)&&u!=null?' + gt
        + ':'+d+'!==u&&v===v?' + lt
        + ':v!==v&&u===u?' + gt
        + (i < n ? ':' : ':0');
    }

    f = Function('a', 'b', code + ';');
    if (t) f = f.bind(t);

    fields = fields.reduce(function(map, field) {
      if (isFunction(field)) {
        (accessorFields(field) || []).forEach(function(_) { map[_] = 1; });
      } else if (field != null) {
        map[field + ''] = 1;
      }
      return map;
    }, {});

    return accessor(f, Object.keys(fields));
  }

  function constant(_) {
    return isFunction(_) ? _ : function() { return _; };
  }

  function debounce(delay, handler) {
    var tid, evt;

    function callback() {
      handler(evt);
      tid = evt = null;
    }

    return function(e) {
      evt = e;
      if (tid) clearTimeout(tid);
      tid = setTimeout(callback, delay);
    };
  }

  function extend(_) {
    for (var x, k, i=1, len=arguments.length; i<len; ++i) {
      x = arguments[i];
      for (k in x) { _[k] = x[k]; }
    }
    return _;
  }

  function extentIndex(array, f) {
    var i = -1,
        n = array.length,
        a, b, c, u, v;

    if (f == null) {
      while (++i < n) {
        b = array[i];
        if (b != null && b >= b) {
          a = c = b;
          break;
        }
      }
      u = v = i;
      while (++i < n) {
        b = array[i];
        if (b != null) {
          if (a > b) {
            a = b;
            u = i;
          }
          if (c < b) {
            c = b;
            v = i;
          }
        }
      }
    } else {
      while (++i < n) {
        b = f(array[i], i, array);
        if (b != null && b >= b) {
          a = c = b;
          break;
        }
      }
      u = v = i;
      while (++i < n) {
        b = f(array[i], i, array);
        if (b != null) {
          if (a > b) {
            a = b;
            u = i;
          }
          if (c < b) {
            c = b;
            v = i;
          }
        }
      }
    }

    return [u, v];
  }

  var NULL = {};

  function fastmap(input) {
    var obj = {},
        map,
        test;

    function has(key) {
      return obj.hasOwnProperty(key) && obj[key] !== NULL;
    }

    map = {
      size: 0,
      empty: 0,
      object: obj,
      has: has,
      get: function(key) {
        return has(key) ? obj[key] : undefined;
      },
      set: function(key, value) {
        if (!has(key)) {
          ++map.size;
          if (obj[key] === NULL) --map.empty;
        }
        obj[key] = value;
        return this;
      },
      delete: function(key) {
        if (has(key)) {
          --map.size;
          ++map.empty;
          obj[key] = NULL;
        }
        return this;
      },
      clear: function() {
        map.size = map.empty = 0;
        map.object = obj = {};
      },
      test: function(_) {
        if (arguments.length) {
          test = _;
          return map;
        } else {
          return test;
        }
      },
      clean: function() {
        var next = {},
            size = 0,
            key, value;
        for (key in obj) {
          value = obj[key];
          if (value !== NULL && (!test || !test(value))) {
            next[key] = value;
            ++size;
          }
        }
        map.size = size;
        map.empty = 0;
        map.object = (obj = next);
      }
    };

    if (input) Object.keys(input).forEach(function(key) {
      map.set(key, input[key]);
    });

    return map;
  }

  function inherits(child, parent) {
    var proto = (child.prototype = Object.create(parent.prototype));
    proto.constructor = child;
    return proto;
  }

  function isBoolean(_) {
    return typeof _ === 'boolean';
  }

  function isDate(_) {
    return Object.prototype.toString.call(_) === '[object Date]';
  }

  function isNumber(_) {
    return typeof _ === 'number';
  }

  function isRegExp(_) {
    return Object.prototype.toString.call(_) === '[object RegExp]';
  }

  function key(fields, flat) {
    if (fields) {
      fields = flat
        ? array(fields).map(function(f) { return f.replace(/\\(.)/g, '$1'); })
        : array(fields);
    }

    var fn = !(fields && fields.length)
      ? function() { return ''; }
      : Function('_', 'return \'\'+' +
          fields.map(function(f) {
            return '_[' + (flat
                ? $(f)
                : splitAccessPath(f).map($).join('][')
              ) + ']';
          }).join('+\'|\'+') + ';');

    return accessor(fn, fields, 'key');
  }

  function merge(compare, array0, array1, output) {
    var n0 = array0.length,
        n1 = array1.length;

    if (!n1) return array0;
    if (!n0) return array1;

    var merged = output || new array0.constructor(n0 + n1),
        i0 = 0, i1 = 0, i = 0;

    for (; i0<n0 && i1<n1; ++i) {
      merged[i] = compare(array0[i0], array1[i1]) > 0
         ? array1[i1++]
         : array0[i0++];
    }

    for (; i0<n0; ++i0, ++i) {
      merged[i] = array0[i0];
    }

    for (; i1<n1; ++i1, ++i) {
      merged[i] = array1[i1];
    }

    return merged;
  }

  function repeat(str, reps) {
    var s = '';
    while (--reps >= 0) s += str;
    return s;
  }

  function pad(str, length, padchar, align) {
    var c = padchar || ' ',
        s = str + '',
        n = length - s.length;

    return n <= 0 ? s
      : align === 'left' ? repeat(c, n) + s
      : align === 'center' ? repeat(c, ~~(n/2)) + s + repeat(c, Math.ceil(n/2))
      : s + repeat(c, n);
  }

  function toBoolean(_) {
    return _ == null || _ === '' ? null : !_ || _ === 'false' || _ === '0' ? false : !!_;
  }

  function defaultParser(_) {
    return isNumber(_) ? _ : isDate(_) ? _ : Date.parse(_);
  }

  function toDate(_, parser) {
    parser = parser || defaultParser;
    return _ == null || _ === '' ? null : parser(_);
  }

  function toString(_) {
    return _ == null || _ === '' ? null : _ + '';
  }

  function toSet(_) {
    for (var s={}, i=0, n=_.length; i<n; ++i) s[_[i]] = true;
    return s;
  }

  function truncate(str, length, align, ellipsis) {
    var e = ellipsis != null ? ellipsis : '\u2026',
        s = str + '',
        n = s.length,
        l = Math.max(0, length - e.length);

    return n <= length ? s
      : align === 'left' ? e + s.slice(n - l)
      : align === 'center' ? s.slice(0, Math.ceil(l/2)) + e + s.slice(n - ~~(l/2))
      : s.slice(0, l) + e;
  }

  function visitArray(array, filter, visitor) {
    if (array) {
      var i = 0, n = array.length, t;
      if (filter) {
        for (; i<n; ++i) {
          if (t = filter(array[i])) visitor(t, i, array);
        }
      } else {
        array.forEach(visitor);
      }
    }
  }

  exports.accessor = accessor;
  exports.accessorName = accessorName;
  exports.accessorFields = accessorFields;
  exports.id = id;
  exports.identity = identity;
  exports.zero = zero;
  exports.one = one;
  exports.truthy = truthy;
  exports.falsy = falsy;
  exports.logger = logger;
  exports.None = None;
  exports.Error = Error$1;
  exports.Warn = Warn;
  exports.Info = Info;
  exports.Debug = Debug;
  exports.panLinear = panLinear;
  exports.panLog = panLog;
  exports.panPow = panPow;
  exports.zoomLinear = zoomLinear;
  exports.zoomLog = zoomLog;
  exports.zoomPow = zoomPow;
  exports.array = array;
  exports.compare = compare;
  exports.constant = constant;
  exports.debounce = debounce;
  exports.error = error;
  exports.extend = extend;
  exports.extentIndex = extentIndex;
  exports.fastmap = fastmap;
  exports.field = field;
  exports.inherits = inherits;
  exports.isArray = isArray;
  exports.isBoolean = isBoolean;
  exports.isDate = isDate;
  exports.isFunction = isFunction;
  exports.isNumber = isNumber;
  exports.isObject = isObject;
  exports.isRegExp = isRegExp;
  exports.isString = isString;
  exports.key = key;
  exports.merge = merge;
  exports.pad = pad;
  exports.peek = peek;
  exports.repeat = repeat;
  exports.splitAccessPath = splitAccessPath;
  exports.stringValue = $;
  exports.toBoolean = toBoolean;
  exports.toDate = toDate;
  exports.toNumber = toNumber;
  exports.toString = toString;
  exports.toSet = toSet;
  exports.truncate = truncate;
  exports.visitArray = visitArray;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
