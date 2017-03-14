import matchers from './libs/matchers';

test('matches expected equal actual', () => {
    expect(matchers().is('foo').test('foo')).toBe(true);
    expect(matchers().is('foo').test('bar')).toBe(false);
});

test('matches expected not equal actual', () => {
    expect(matchers().not.is('foo').test('bar')).toBe(true);
    expect(matchers().not.is('foo').test('foo')).toBe(false);
    expect(matchers().not.not.is('foo').test('foo')).toBe(true);
});

