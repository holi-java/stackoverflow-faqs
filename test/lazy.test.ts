import lazy from "./libs/lazy";
issue("In TypeScript, is there a syntax for declaring a field as lazy?",
    "http://stackoverflow.com/questions/42845543/in-typescript-is-there-a-syntax-for-declaring-a-field-as-lazy/42846277#42846277")
describe("@lazy", () => {
    class Foo {
        @lazy get value() {
            return new String("bar");
        }

        @lazy
        get fail(): string {
            throw new Error("never be initialized!");
        }

        @lazy get ref() {
            return this;
        }
    }


    it("initializing once", () => {
        let foo = new Foo();

        expect(foo.value).toEqual("bar");
        expect(foo.value).toBe(foo.value);
    });

    it("could be set @lazy fields", () => {
        //you must to set object to any
        //because typescript will infer it by static ways
        let foo: any = new Foo();
        foo.value = "foo";

        expect(foo.value).toEqual("foo");
    });

    it("can't annotated with fields", () => {
        function lazyOnProperty() {
            class Bar {
                @lazy bar: string = "bar";
            }
        }

        expect(lazyOnProperty).toThrowError(/@lazy can't be set as a property `bar` on Bar class/);
    });

    it("get initializer via prototype", () => {
        expect(typeof Foo.prototype.value).toBe("function");
    });

    it("calling initializer will be create an instance at a time", () => {
        let initializer: any = Foo.prototype.value;

        expect(initializer.call(this)).toEqual("bar");
        expect(initializer.call(this)).not.toBe(initializer.call(this));
    });

    it("ref this correctly", () => {
        let foo = new Foo();
        let ref: any = Foo.prototype.ref;

        expect(this).not.toBe(foo);
        expect(foo.ref).toBe(foo);
        expect(ref.call(this)).toBe(this);
    });

    it("discard the initializer if set fields with other value", () => {
        let foo: any = new Foo();
        foo.fail = "failed";

        expect(foo.fail).toBe("failed");
    });

    it("inherit @lazy field correctly", () => {
        class Bar extends Foo {
        }

        const assertInitializerCallingWithCorrespondingContext = it => {
            let initializer: any = Bar.prototype.ref;
            let initializer2: any = Foo.prototype.ref;
            expect(typeof initializer).toBe("function");
            expect(initializer.call(it)).toBe(it);
            expect(initializer2.call(it)).toBe(it);
        };

        assertInitializerCallingWithCorrespondingContext(this);
        let bar = new Bar();
        assertInitializerCallingWithCorrespondingContext({});
        expect(bar.value).toEqual("bar");
        expect(bar.value).toBe(bar.value);
        expect(bar.ref).toBe(bar);
        assertInitializerCallingWithCorrespondingContext(this);
    });


    it("overriding @lazy field to discard super.initializer", () => {
        class Bar extends Foo {
            get fail() {
                return "error";
            };
        }

        let bar = new Bar();

        expect(bar.fail).toBe("error");
    });

    it("calling super @lazy fields", () => {
        let calls = 0;
        class Bar extends Foo {
            get ref() {
                calls++;
                return super.ref;
            };
        }

        let bar = new Bar();

        expect(bar.ref).toBe(bar);
        expect(calls).toBe(1);
    });

    it("throws errors if @lazy a getter that existing a setter", () => {
        function lazyOnPropertyWithinSetter() {
            class Bar {
                @lazy
                get bar() {
                    return;
                }

                set bar(value) {
                }
            }
        }

        expect(lazyOnPropertyWithinSetter).toThrow(/@lazy can't be annotated with get bar\(\) existing a setter on Bar class/);
    });
});