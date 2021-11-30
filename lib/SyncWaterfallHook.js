const Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');

class SyncWaterfallHookCodeFactory extends HookCodeFactory {
  content({ onError, onResult, resultReturns, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: () => onError(),
      onResult: (i, result, next) => {
        let code = '';
        code = code + `if(${result} !== undefined) {\n`;
        code = code + `${this.args[0]} = ${result};\n`;
        code = code + `};\n`;
        code = code + next();
        return code;
      },
      onDone: () => onResult(this.args[0]),
      doneReturns: resultReturns,
      rethrowIfPossible,
    });
  }
}

const factory = new SyncWaterfallHookCodeFactory();

function SyncWaterfallHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncWaterfallHook;
  hook.compile = compile;
  return hook;
}

const compile = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

SyncWaterfallHook.prototype = null;

module.exports = SyncWaterfallHook;
