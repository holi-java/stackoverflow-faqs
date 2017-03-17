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
        const declaration = () => {
            class Bar {
                @lazy bar: string = "bar";
            }
        };

        expect(declaration).toThrowError(/@lazy can't be set as a property `bar` on Bar class/);
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

        const assertInitializerTo = it => {
            let initializer: any = Bar.prototype.ref;
            let initializer2: any = Foo.prototype.ref;
            expect(typeof initializer).toBe("function");
            expect(initializer.call(it)).toBe(it);
            expect(initializer2.call(it)).toBe(it);
        };

        assertInitializerTo(this);
        let bar = new Bar();
        assertInitializerTo({});
        expect(bar.value).toEqual("bar");
        expect(bar.value).toBe(bar.value);
        expect(bar.ref).toBe(bar);
        assertInitializerTo(this);
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
            get ref(): any {
                calls++;
                //todo:a typescript bug:should be call `super.ref` getter  instead of super.ref() correctly in typescript,but it can't
                return (<any>super["ref"]).call(this);
            };
        }

        let bar = new Bar();

        expect(bar.ref).toBe(bar);
        expect(calls).toBe(1);
    });
});