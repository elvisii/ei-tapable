const SyncHook = require('../lib/SyncHook');

describe('SyncHook', () => {
  it('should allow to create sync hooks', async () => {
    const h0 = new SyncHook();
    const mock0 = jest.fn();
    h0.tap('A', mock0);
    h0.call();
    expect(mock0).toHaveBeenCalled();
  });
});
