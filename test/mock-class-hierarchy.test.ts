import extend from './libs/extend';

class Superclass {
    constructor(public name: string = "bar") {
    }

    foo() {
        return "bar";
    }

    getName() {
        return this.name;
    }
}


test('methods inherited', () => {
    let Subclass = extend(Superclass);
    let it: any = new Subclass();
    expect(it.foo()).toBe('bar');
});

test('properties inherited', () => {
    let Subclass = extend(Superclass);
    let it: any = new Subclass();

    expect(it.name).toBe('bar');
});

test('pass arguments to constructor', () => {
    let Subclass = extend(Superclass);
    let it: any = new Subclass("foo");

    expect(it.name).toBe('foo');
});

test('constructor is self', () => {
    let Subclass = extend(Superclass);
    expect(Subclass.prototype.constructor).toBe(Subclass);
});

test('using my own constructor', () => {
    let Subclass = extend(Superclass, (_super) => {
        return {
            constructor(){
                _super("foo");
            }
        };
    });
    let it: any = new Subclass();

    expect(it.name).toBe('foo');
});

test('call super methods using `_super`', () => {
    let Subclass = extend(Superclass, (_super) => {
        return {
            foo(){
                return `[${_super.foo()}]`;
            }
        };
    });
    let it: any = new Subclass();

    expect(it.foo()).toBe('[bar]');
});

test('call super methods which parent method is calling `this`', () => {
    let Subclass = extend(Superclass, (_super) => {
        return {
            getName() {
                return `[${_super.getName()}]`;
            }
        };
    });
    let it: any = new Subclass("foo");

    expect(it.name).toBe("foo");
    expect(it.getName()).toBe('[foo]');
});

test('report error when calling _super not in classes', () => {
    expect(() => extend(Superclass, (_super) => _super()))
        .toThrow("call `_super` outside the class!");
});

test('report error when calling _super() in method', () => {
    let Subclass = extend(Superclass, (_super) => {
        return {
            foo(){
                _super();
            }
        };
    });
    let it = new Subclass();
    expect(() => it.foo()) .toThrowError("call `_super()` outside the constructor!");
});

test('report error when calling _super() more than once in constructor', () => {
    let Subclass = extend(Superclass, (_super) => {
        return {
            constructor(){
                _super();
                _super();
            }
        };
    });
    expect(() => new Subclass()) .toThrowError("call `_super()` more than once in constructor!");
});
