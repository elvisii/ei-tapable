const SyncHook = require('../lib/SyncHook');

describe('SyncHook', () => {
  it('should allow to create sync hooks', async () => {
    const h0 = new SyncHook();
    const mock0 = jest.fn();
    h0.tap('A', mock0);
    h0.call();
    expect(mock0).toHaveBeenCalled();

    const h1 = new SyncHook(['test']);
    const h2 = new SyncHook(['test', 'arg1']);
    const h3 = new SyncHook(['tsst', 'arg1', 'arg2']);

    const mock1 = jest.fn();
    const mock2 = jest.fn();
    const mock3 = jest.fn();

    h1.tap('B', mock1);
    h2.tap('C', mock2);
    h3.tap('D', mock3);
    h1.call('1');
    h2.call('1', 2);
    h3.call('1', 2, 3);

    expect(mock1).toHaveBeenLastCalledWith('1');
    expect(mock2).toHaveBeenLastCalledWith('1', 2);
    expect(mock3).toHaveBeenLastCalledWith('1', 2, 3);
  });
  it('should sync execute hooks', () => {
    const hook = new SyncHook(['arg1']);

    const mockFn1 = jest.fn(() => 'A');
    hook.tap('A', mockFn1);

    const mockFn2 = jest.fn(() => 'B');
    hook.tap('B', mockFn2);

    hook.call('1');

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
  it('should allow to intercept calls', () => {
    const h0 = new SyncHook(['arg1', 'arg2']);

    const mock0 = jest.fn();
    const mockCall = jest.fn();
    const mockRegister = jest.fn((x) => {
      return {
        type: 'sync',
        name: 'ei',
        cb: mock0,
      };
    });

    const mock1 = jest.fn();
    h0.tap('Test1', mock1);

    h0.intercept({
      call: mockCall,
      register: mockRegister,
    });

    const mock2 = jest.fn();
    h0.tap('Test2', mock2);

    h0.call(1, 2);

    expect(mockCall).toHaveBeenLastCalledWith(1, 2);
    expect(mockRegister).toHaveBeenLastCalledWith({
      name: 'Test2',
      type: 'sync',
      cb: mock2,
    });
  });
});
