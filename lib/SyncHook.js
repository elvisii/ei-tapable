const Hook = require("./Hook");

function SyncHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncHook;
  hook.compile = compile;
  return hook;
}

const compile = function(options) {

}

SyncHook.prototype = null;
module.exports = SyncHook;