class Hook {
  constructor(args = [], name = undefined) {
    this.args = args;
    this.name = name;
    this.taps = [];
    this.interceptors = [];
    this.call = DELEGATE;
    this.x = undefined;
    this.compile = this.compile;
  }
  compile() {
    throw new Error('Abstract: should be overridden.');
  }
  createCall(type) {
    return this.compile({
      type,
      args: this.args,
      taps: this.taps,
      interceptors: this.interceptors,
    })
  }
  tap(options, cb) {
    this._tap('sync', options, cb);
  }
  _tap(type, options, cb) {
    if (typeof options === 'string') {
      options = {
        name: options.trim(),
      };
    } else if (typeof options !== 'object' || options === null) {
      throw new Error('Invalid tap option');
    }
    if (typeof options.name !== 'string' || options.name === '') {
    }
    options = Object.assign({ type, cb }, options);
    options = this.registerInterceptors(options);
    this._insert(options);
  }
  registerInterceptors(options) {
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        const newOptions = interceptor.registor(options);
        if (newOptions !== undefined) {
          options = newOptions;
        }
      }
    }
    return options;
  }
  intercept(interceptor) {
    this.interceptors.push(Object.assign({}, interceptor));
    const l = this.taps.length;
    if (interceptor.register) {
      for (let i = 0; i < l; i++) {
        const tap = this.taps[i];
        tap = interceptor.register(tap);
      }
    }
  }
  _insert(options) {
    let before;
    if (typeof options.before === 'string') {
      before = new Set([item.before]);
    } else if (Array.isArray(options.before)) {
      before = new Set(options.before);
    }
    let stage = 0;
    if (typeof options.stage === 'number') {
      stage = options.stage;
    }
    let i = this.taps.length;
    while (i > 0) {
      i--;
      const tapInfo = this.taps[i];
      this.taps[i + 1] = tapInfo; //向后移动已有tap
      const _name = tapInfo.name;
      const _stage = tapInfo.stage;
      if (before) {
        if (before.has(_name)) {
          before.delete(_name);
          continue;
        }
        if (before.size > 0) {
          continue;
        }
      }
      if (_stage > stage) {
        continue;
      }
      i++;
      break;
    }
    this.taps[i] = options;
  }
}

function DELEGATE(...args) {
  this.call = this.createCall('sync');
  return this.call(...args);
}

module.exports = Hook;
