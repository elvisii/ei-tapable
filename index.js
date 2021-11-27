const SyncHook = require('./lib/index');

const foo = {
  hooks: new SyncHook(['arg1', 'arg2']),
}

foo.hooks.tap('a', (arg1, arg2) => {
  console.log(arg1, arg2);
})

foo.hooks.intercept({
  call: () => {

  },
  register: (typeInfo) => {
    console.log(typeInfo);
    return typeInfo;
  }
})

foo.hooks.call(1, 2);