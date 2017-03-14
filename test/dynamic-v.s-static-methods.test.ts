@issue("Dynamic methods v.s Static methods",
    "http://stackoverflow.com/questions/42775103/typescript-function-type-vs-declaring-a-method-signature/42778347#42778347")
class Superclass {
    calls: string[] = [];

    method1() {
        this.calls.push('method1');
    }

    method3 = function () {
        this.calls.push('method3');
    };
}
class Subclass extends Superclass {
    method1() {
        super.method1();
    }
}

test("methods as property can't be enumerated as prototype", () => {
    expect(Object.keys(Superclass.prototype)).not.toContain('method3');
    expect(Object.keys(new Superclass())).toContain('method3');
});

test("methods as prototype can be enumerated as prototype", () => {
    expect(Object.keys(Superclass.prototype)).toContain('method1');
    expect(Object.keys(new Superclass())).not.toContain('method1');
});

test("methods as property also can be inherited in subclass", () => {
    let it = new Subclass();
    it.method3();//works fine
    expect(it.calls).toEqual(["method3"]);
});

test("methods as property can't be overridded so you can't call `super`", () => {
    let foo: Superclass = new class extends Superclass {
        method1() {
            this.superCalling("method1");
        }

        method3 = function callSuperMethod() {
            this.superCalling("method3");
        };

        superCalling(method: string) {
            let $super = Superclass.prototype;
            $super[method].call(this);
        }
    };
    foo.method1();
    expect(foo.calls).toEqual(['method1']);

    expect(() => foo.method3()).toThrow("Cannot read property 'call' of undefined");
    expect(foo.calls).toEqual(['method1']);
});
