import {when} from "./libs/core";


test('types', () => {
    expect(typeof when(() => false)).toBe("function");
});

test('matches', () => {
    expect(when(() => true).then(() => "success")()).toBe("success");
});

test('failed', () => {
    expect(when(() => false).unless(() => "failed")()).toBe("failed");
});

test('call callback once', () => {
    expect(when(() => false).then(fail).unless(() => "bar")()).toBe("bar");
});

test('call callback bind context', () => {
    let condition = when(() => true).then(function () {
        return this.toUpperCase();
    });
    expect(condition.call("foo")).toBe("FOO");
});
