# ei-tapable

🌈Just a little publish-subscribe events library

### GitHub

[GitHub - ei-tapable](https://github.com/elvisii/ei-tapable.git)

### NPM

[![NPM version][npm-image]][npm-url]
[![Build Status](https://app.travis-ci.com/elvisii/ei-tapable.svg?branch=main)](https://app.travis-ci.com/elvisii/ei-tapable)
![npm](https://img.shields.io/npm/dw/ei-tapable)

[NPM - ei-tapable](https://github.com/elvisii/ei-tapable.git)


## install

```shell
npm install --save ei-tapable
```

## Usage

```javascript
const {
  SyncHook
} = require('ei-tapable')

class Foo {
  constructor() {
    this.hooks = {
      tests: new SyncHook(['arg1']),
    }
  }
}
```

we can now use these hooks:

```js
const foo = new Foo();
foo.hooks.tests.tap('xxxxPlugin', (arg1) => {
  console.log(arg1); // foo
})
```

need to call them: 
```js
foo.hooks.tests.call('foo');
```
### Hook types

* __Sync__. A sync hook can only be tapped with synchronous functions (using `myhook.tap()`)

### Interceptor

hook offer an additional interceptor API:

```js
foo.hooks.intercept({
  call: (arg1, arg2) => {
    console.log(arg1, arg2);
  },
  register: ({type, name, cb} /* tapInfo */) => {
    return {
      type,
      name, 
      cb
    } // maybe return a new typeInfo object
  }
})
```

**call**: `(...args) => void` Adding `call` to your interceptor will trigger when hooks are triggered. You can access to hooks arguments.

**tap**: `(tap: Tap) => void` Adding `tap` to your interceptor will trigger when a plugin taps into a hook. Provided is the `Tap` object. `Tap` object can't be changed.

**register**: `(tap: Tap) => Tap | undefined` Adding `register` to your interceptor will trigger for each added `Tap` and allows to modify it.


[npm-url]: https://www.npmjs.com/package/ei-tapable
[npm-image]: https://img.shields.io/npm/v/ei-tapable.svg