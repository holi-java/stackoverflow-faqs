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


test('describe string value', () => {
    expect(matchers().is('foo').description).toMatch(/<"foo">/);
});

test('describe number value', () => {
    expect(matchers().is(1).description).toMatch(/<1>/);
});

test('describe date value', () => {
    let now = new Date();
    expect(matchers().is(now).description).toMatch(`"${now}"`);
});

test('describe boolean value', () => {
    expect(matchers().is(true).description).toMatch(/<true>/);
    expect(matchers().is(false).description).toMatch(/<false>/);
});

test('describe function', () => {
    function foo() {
    }

    expect(matchers().is(foo).description).toMatch(/<\[Function foo\]>/);
});

test('describe array', () => {
    expect(matchers().is(["foo", 2, true]).description).toMatch(/<\["foo", 2, true\]>/);
    expect(matchers().is([1, ["foo"]]).description).toMatch(/<\[1, \["foo"\]\]>/);
});

test('description modifiers', () => {
    expect(matchers().is('foo').description).toMatch(/^be/);
    expect(matchers().not.is('foo').description).toMatch(/^not be/);
    expect(matchers().not.not.is('foo').description).toMatch(/^be/);
});