const SyncHook = require('../lib/SyncHook');

describe('SyncHook', () => {
  it('should allow to create sync hooks', async () => {
    const h0 = new SyncHook();
    const h1 = new SyncHook(['test']);
    
    const mock0 = jest.fn();
  });
});
