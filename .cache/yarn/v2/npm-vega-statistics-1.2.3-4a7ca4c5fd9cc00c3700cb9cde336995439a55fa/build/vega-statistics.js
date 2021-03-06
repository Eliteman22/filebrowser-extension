(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
  (factory((global.vega = {}),global.d3));
}(this, (function (exports,d3Array) { 'use strict';

  function bin(_) {
    // determine range
    var maxb = _.maxbins || 20,
        base = _.base || 10,
        logb = Math.log(base),
        div  = _.divide || [5, 2],
        min  = _.extent[0],
        max  = _.extent[1],
        span = max - min,
        step, level, minstep, precision, v, i, n, eps;

    if (_.step) {
      // if step size is explicitly given, use that
      step = _.step;
    } else if (_.steps) {
      // if provided, limit choice to acceptable step sizes
      v = span / maxb;
      for (i=0, n=_.steps.length; i < n && _.steps[i] < v; ++i);
      step = _.steps[Math.max(0, i-1)];
    } else {
      // else use span to determine step size
      level = Math.ceil(Math.log(maxb) / logb);
      minstep = _.minstep || 0;
      step = Math.max(
        minstep,
        Math.pow(base, Math.round(Math.log(span) / logb) - level)
      );

      // increase step size if too many bins
      while (Math.ceil(span/step) > maxb) { step *= base; }

      // decrease step size if allowed
      for (i=0, n=div.length; i<n; ++i) {
        v = step / div[i];
        if (v >= minstep && span / v <= maxb) step = v;
      }
    }

    // update precision, min and max
    v = Math.log(step);
    precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
    eps = Math.pow(base, -precision - 1);
    if (_.nice || _.nice === undefined) {
      v = Math.floor(min / step + eps) * step;
      min = min < v ? v - step : v;
      max = Math.ceil(max / step) * step;
    }

    return {
      start: min,
      stop:  max,
      step:  step
    };
  }

  function numbers(array, f) {
    var numbers = [],
        n = array.length,
        i = -1, a;

    if (f == null) {
      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
    } else {
      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
    }
    return numbers;
  }

  function number(x) {
    return x === null ? NaN : +x;
  }

  exports.random = Math.random;

  function setRandom(r) {
    exports.random = r;
  }

  function bootstrapCI(array, samples, alpha, f) {
    if (!array.length) return [undefined, undefined];

    var values = numbers(array, f),
        n = values.length,
        m = samples,
        a, i, j, mu;

    for (j=0, mu=Array(m); j<m; ++j) {
      for (a=0, i=0; i<n; ++i) {
        a += values[~~(exports.random() * n)];
      }
      mu[j] = a / n;
    }

    return [
      d3Array.quantile(mu.sort(d3Array.ascending), alpha/2),
      d3Array.quantile(mu, 1-(alpha/2))
    ];
  }

  function quartiles(array, f) {
    var values = numbers(array, f);

    return [
      d3Array.quantile(values.sort(d3Array.ascending), 0.25),
      d3Array.quantile(values, 0.50),
      d3Array.quantile(values, 0.75)
    ];
  }

  function integer(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }

    var dist = {},
        a, b, d;

    dist.min = function(_) {
      if (arguments.length) {
        a = _ || 0;
        d = b - a;
        return dist;
      } else {
        return a;
      }
    };

    dist.max = function(_) {
      if (arguments.length) {
        b = _ || 0;
        d = b - a;
        return dist;
      } else {
        return b;
      }
    };

    dist.sample = function() {
      return a + Math.floor(d * exports.random());
    };

    dist.pdf = function(x) {
      return (x === Math.floor(x) && x >= a && x < b) ? 1 / d : 0;
    };

    dist.cdf = function(x) {
      var v = Math.floor(x);
      return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
    };

    dist.icdf = function(p) {
      return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p * d) : NaN;
    };

    return dist.min(min).max(max);
  }

  function gaussian(mean, stdev) {
    var mu,
        sigma,
        next = NaN,
        dist = {};

    dist.mean = function(_) {
      if (arguments.length) {
        mu = _ || 0;
        next = NaN;
        return dist;
      } else {
        return mu;
      }
    };

    dist.stdev = function(_) {
      if (arguments.length) {
        sigma = _ == null ? 1 : _;
        next = NaN;
        return dist;
      } else {
        return sigma;
      }
    };

    dist.sample = function() {
      var x = 0, y = 0, rds, c;
      if (next === next) {
        x = next;
        next = NaN;
        return x;
      }
      do {
        x = exports.random() * 2 - 1;
        y = exports.random() * 2 - 1;
        rds = x * x + y * y;
      } while (rds === 0 || rds > 1);
      c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
      next = mu + y * c * sigma;
      return mu + x * c * sigma;
    };

    dist.pdf = function(x) {
      var exp = Math.exp(Math.pow(x-mu, 2) / (-2 * Math.pow(sigma, 2)));
      return (1 / (sigma * Math.sqrt(2*Math.PI))) * exp;
    };

    // Approximation from West (2009)
    // Better Approximations to Cumulative Normal Functions
    dist.cdf = function(x) {
      var cd,
          z = (x - mu) / sigma,
          Z = Math.abs(z);
      if (Z > 37) {
        cd = 0;
      } else {
        var sum, exp = Math.exp(-Z*Z/2);
        if (Z < 7.07106781186547) {
          sum = 3.52624965998911e-02 * Z + 0.700383064443688;
          sum = sum * Z + 6.37396220353165;
          sum = sum * Z + 33.912866078383;
          sum = sum * Z + 112.079291497871;
          sum = sum * Z + 221.213596169931;
          sum = sum * Z + 220.206867912376;
          cd = exp * sum;
          sum = 8.83883476483184e-02 * Z + 1.75566716318264;
          sum = sum * Z + 16.064177579207;
          sum = sum * Z + 86.7807322029461;
          sum = sum * Z + 296.564248779674;
          sum = sum * Z + 637.333633378831;
          sum = sum * Z + 793.826512519948;
          sum = sum * Z + 440.413735824752;
          cd = cd / sum;
        } else {
          sum = Z + 0.65;
          sum = Z + 4 / sum;
          sum = Z + 3 / sum;
          sum = Z + 2 / sum;
          sum = Z + 1 / sum;
          cd = exp / sum / 2.506628274631;
        }
      }
      return z > 0 ? 1 - cd : cd;
    };

    // Approximation of Probit function using inverse error function.
    dist.icdf = function(p) {
      if (p <= 0 || p >= 1) return NaN;
      var x = 2*p - 1,
          v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
          a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
          b = Math.log(1 - (x*x)) / v,
          s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
      return mu + sigma * Math.SQRT2 * s;
    };

    return dist.mean(mean).stdev(stdev);
  }

  // TODO: support for additional kernels?
  function kde(support, bandwidth) {
    var kernel = gaussian(),
        dist = {},
        n = 0;

    dist.data = function(_) {
      if (arguments.length) {
        support = _;
        n = _ ? _.length : 0;
        return dist.bandwidth(bandwidth);
      } else {
        return support;
      }
    };

    dist.bandwidth = function(_) {
      if (!arguments.length) return bandwidth;
      bandwidth = _;
      if (!bandwidth && support) bandwidth = estimateBandwidth(support);
      return dist;
    };

    dist.sample = function() {
      return support[~~(exports.random() * n)] + bandwidth * kernel.sample();
    };

    dist.pdf = function(x) {
      for (var y=0, i=0; i<n; ++i) {
        y += kernel.pdf((x - support[i]) / bandwidth);
      }
      return y / bandwidth / n;
    };

    dist.cdf = function(x) {
      for (var y=0, i=0; i<n; ++i) {
        y += kernel.cdf((x - support[i]) / bandwidth);
      }
      return y / n;
    };

    dist.icdf = function() {
      throw Error('KDE icdf not supported.');
    };

    return dist.data(support);
  }

  // Scott, D. W. (1992) Multivariate Density Estimation:
  // Theory, Practice, and Visualization. Wiley.
  function estimateBandwidth(array) {
    var n = array.length,
        q = quartiles(array),
        h = (q[2] - q[0]) / 1.34;
    return 1.06 * Math.min(Math.sqrt(d3Array.variance(array)), h) * Math.pow(n, -0.2);
  }

  function mixture(dists, weights) {
    var dist = {}, m = 0, w;

    function normalize(x) {
      var w = [], sum = 0, i;
      for (i=0; i<m; ++i) { sum += (w[i] = (x[i]==null ? 1 : +x[i])); }
      for (i=0; i<m; ++i) { w[i] /= sum; }
      return w;
    }

    dist.weights = function(_) {
      if (arguments.length) {
        w = normalize(weights = (_ || []));
        return dist;
      }
      return weights;
    };

    dist.distributions = function(_) {
      if (arguments.length) {
        if (_) {
          m = _.length;
          dists = _;
        } else {
          m = 0;
          dists = [];
        }
        return dist.weights(weights);
      }
      return dists;
    };

    dist.sample = function() {
      var r = exports.random(),
          d = dists[m-1],
          v = w[0],
          i = 0;

      // first select distribution
      for (; i<m-1; v += w[++i]) {
        if (r < v) { d = dists[i]; break; }
      }
      // then sample from it
      return d.sample();
    };

    dist.pdf = function(x) {
      for (var p=0, i=0; i<m; ++i) {
        p += w[i] * dists[i].pdf(x);
      }
      return p;
    };

    dist.cdf = function(x) {
      for (var p=0, i=0; i<m; ++i) {
        p += w[i] * dists[i].cdf(x);
      }
      return p;
    };

    dist.icdf = function() {
      throw Error('Mixture icdf not supported.');
    };

    return dist.distributions(dists).weights(weights);
  }

  function uniform(min, max) {
    if (max == null) {
      max = (min == null ? 1 : min);
      min = 0;
    }

    var dist = {},
        a, b, d;

    dist.min = function(_) {
      if (arguments.length) {
        a = _ || 0;
        d = b - a;
        return dist;
      } else {
        return a;
      }
    };

    dist.max = function(_) {
      if (arguments.length) {
        b = _ || 0;
        d = b - a;
        return dist;
      } else {
        return b;
      }
    };

    dist.sample = function() {
      return a + d * exports.random();
    };

    dist.pdf = function(x) {
      return (x >= a && x <= b) ? 1 / d : 0;
    };

    dist.cdf = function(x) {
      return x < a ? 0 : x > b ? 1 : (x - a) / d;
    };

    dist.icdf = function(p) {
      return (p >= 0 && p <= 1) ? a + p * d : NaN;
    };

    return dist.min(min).max(max);
  }

  exports.bin = bin;
  exports.bootstrapCI = bootstrapCI;
  exports.quartiles = quartiles;
  exports.setRandom = setRandom;
  exports.randomInteger = integer;
  exports.randomKDE = kde;
  exports.randomMixture = mixture;
  exports.randomNormal = gaussian;
  exports.randomUniform = uniform;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
