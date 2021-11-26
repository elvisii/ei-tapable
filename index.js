const SyncHook = require('./lib/index');

const foo = {
  hooks: new SyncHook(['test']),
}

foo.hooks.tap('a', (param) => {
  console.log(param);
})

foo.hooks.call('test');