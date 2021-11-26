const SyncHook = require('../lib/SyncHook');

describe('SyncHook', () => {
  it('should allow to create sync hooks', async () => {
    const h0 = new SyncHook();
    const mock0 = jest.fn();
    h0.tap('A', mock0);
    h0.call();
    expect(mock0).toHaveBeenCalled();

    const h1 = new SyncHook(['test']);
    const h2 = new SyncHook(['test', 'arg1'])
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    h1.tap('B', mock1);
    h2.tap('C', mock2);
    h1.call('1');
    h2.call('1', 2)
    expect(mock1).toHaveBeenLastCalledWith('1');
    expect(mock2).toHaveBeenLastCalledWith('1', 2)
  });
});
