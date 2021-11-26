# ei-tapable

Just a little publish-subscribe events library

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


