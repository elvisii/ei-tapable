const Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');

function SyncHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncHook;
  hook.compile = compile;
  return hook;
}

class SyncHookCodeFactory extends HookCodeFactory {
  content({ onError, onDone, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: (i, error) => onError(error),
      onDone,
      rethrowIfPossible,
    })
  }
}

const factory = new SyncHookCodeFactory();
const compile = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};


SyncHook.prototype = null;
module.exports = SyncHook;
