const SyncWaterfallHook = require("../lib/SyncWaterfallHook")

describe('SyncWaterfallHook', () => {
  it('shoud allow to create sync hooks', () => {
    const hook = new SyncWaterfallHook(['arg1', 'arg2']);
    
    const mock0 = jest.fn(x => x + ',0');
    const mock1 = jest.fn(x => x + ',1');
    const mock2 = jest.fn(x => x + ',2');

    hook.tap('A', mock0);
    hook.tap('B', mock1);
    hook.tap('C', mock2);

    const returnValue0 = hook.call('sync', 'a');
    expect(returnValue0).toBe('sync,0,1,2');

    expect(mock0).toHaveBeenLastCalledWith('sync', 'a');
    expect(mock1).toHaveBeenLastCalledWith('sync,0', 'a');
    expect(mock2).toHaveBeenLastCalledWith('sync,0,1', 'a');
  })
})