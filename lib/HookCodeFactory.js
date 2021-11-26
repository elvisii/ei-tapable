class HookCodeFactory {
  constructor() {
    this.options = undefined;
    this.args = undefined;
  }
  setup(instance, options) {
    instance.x = options.taps.map((t) => t.cb);
  }
  create(options) {
    this.init(options);
    let fn;
    const type = options.type;
    switch (type) {
      case 'sync':
        fn = new Function(
          this.getArgs(),
          this.header() +
            this.contentWithInterceptors({
              onError: (error) => `throw ${error};\n`,
              onResult: (result) => `return ${result};\n`,
              resultReturns: true,
              onDone: () => '',
              rethrowIfPossible: true,
            })
        );
        break;

      default:
        break;
    }
    this.destory();
    return fn;
  }
  header() {
    let code = '';
    code = code + 'var context;\n';
    code = code + 'var x = this.x;\n';
    if (this.options.interceptors.length > 0) {
      code = code + 'var taps = this.taps;\n';
      code = code + 'var interceptors = this.interceptors;\n';
    }
    return code;
  }
  init(options) {
    this.options = options;
    this.args = options.args.slice();
  }
  contentWithInterceptors(options) {
    const interceptors = this.options.interceptors;
    if (interceptors.length > 0) {
      const onError = options.onError;
      const onResult = options.onResult;
      const onDone = options.onDone;
      let code = '';
      for (let i = 0; i < interceptors.length; i++) {
        const interceptor = interceptors[i];
        if (interceptor.call) {
          code =
            code +
            `${this.getInterceptor(i)}.call(${this.getArgs({
              before: interceptor.context ? 'context' : undefined,
            })});\n`;
        }
      }
      code =
        code +
        this.content(
          Object.assign(options, {
            onResult:
              onResult &&
              ((result) => {
                let code = '';
                const l = this.options.interceptors.length;
                for (let i = 0; i < l; i++) {
                  const interceptor = this.options.interceptors[i];
                  if (interceptor.result) {
                    code =
                      code + `${this.getInterceptor(i)}.result(${result});\n`;
                  }
                }
                code = code + onResult(result);
                return code;
              }),
          })
        );
      return code;
    } else {
      return this.content(options);
    }
  }
  callTapsSeries({
    onError,
    onResult,
    resultReturns,
    onDone,
    doneReturns,
    rethrowIfPossible,
  }) {
    const taps = this.options.taps;
    if (taps.length === 0) onDone();
    let code = '';
    let current = onDone;
    for (let i = taps.length - 1; i >= 0; i--) {
      const done = current;
      const doneBreak = (skipDone) => {
        if (skipDone) return '';
        return onDone();
      };
      const content = this.callTap(i, {
        onError: (error) => onError(i, error, done, doneBreak),
        onResult:
          onResult &&
          ((result) => {
            return onResult(i, result, done, doneBreak);
          }),
        onDone: !onResult && done,
      });
      current = () => content;
    }
    code = code + current();
    return code;
  }
  callTap(tapIndex, { onError, onResult, onDone, resultReturns }) {
    let code = '';
    let hasTapCached = false;
    for (let i = 0; i < this.options.interceptors.length; i++) {
      const interceptor = this.options.interceptors[i];
      if (interceptor.tap) {
        code =
          code +
          `${this.getTap(tapIndex)}.tap(${this.getArgs(
            interceptor.context ? 'context, ' : undefined
          )}_tap${tapIndex});\n`;
      }
    }
    code = code + `var fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
    const tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        if (onResult) {
          code =
            code +
            `var result${tapIndex} = fn${tapIndex}(${this.getArgs({
              before: tap.context ? 'context' : undefined,
            })});\n`;
        } else {
          code =
            code +
            `fn${tapIndex}(${this.getArgs({
              before: tap.context ? 'context' : undefined,
            })});\n`;
        }
        if (onResult) {
          code = code + onResult(`result${tapIndex}`);
        }
        if (onDone) {
          code = code + onDone();
        }
        break;

      default:
        break;
    }
    return code;
  }
  destory() {
    this.options = undefined;
    this.args = undefined;
  }
  getInterceptor(i) {
    return `interceptors${i};\n`;
  }
  getTap(i) {
    return `taps[${i}];\n`;
  }
  getTapFn(i) {
    return `x[${i}]`;
  }
  getArgs({ before, after } = {}) {
    let args = this.args;
    if (before) {
      args = [before].concat(args);
    }
    if (after) {
      args = args.concat(after);
    }
    if (args.length === 0) {
      return '';
    } else {
      return args.join(', ');
    }
  }
}

module.exports = HookCodeFactory;
