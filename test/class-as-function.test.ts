issue("create class as function",
    "http://stackoverflow.com/questions/42953277/typescript-class-implementing-interface-with-anonymous-function#42953277")
describe('class as function', () => {
    //must be declared as any,because typescript infer constructor must use `new` keywords.
    let foo: any = class {
        constructor(alpha: number) {
            if (this != null) {
                throw new Error(`${Object.getPrototypeOf(this).constructor.name} can't be instantiate.`);
            }
            return `alpha:${alpha}`;
        }

        static initialize?(nodes: any[]) {

        }
    };

    test('call as function', () => {
        let nodes = [];
        let spy = spyOn(foo, 'initialize');
        expect(foo(.3)).toBe("alpha:0.3");

        foo.initialize(nodes);
        expect(spy).toBeCalledWith(nodes);
    });

    test("can't new instance", () => {
        expect(() => new foo()).toThrowError();
    });
});