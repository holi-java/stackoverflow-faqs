import * as React from 'react';
issue("Static Property V.S Instance Property Inheritance"
    , "http://stackoverflow.com/questions/42869737/how-to-reference-static-properties-on-this-constructor-inside-base-class-code/42869898#42869898");
declare global {
    interface Function {
        style: any
    }
}
describe('static inheritance', () => {

    class StyleableComponent<P, S> extends React.Component<P, S> {
        protected classes: any;
        static style: any;

        constructor(props?: P, context?: any, public style: any = "default") {
            super(props, context);
        }

        someMethod() {
            //dangerous if subclass not define static style property
            //todo:the 1st approach
            // let style = Object.getPrototypeOf(this).constructor.style;
            // return style;
            //todo:the 2nd approach
            // let cotr: any = this.constructor;
            // return cotr.style;
            //todo:the 3nd approach,you must declare style in Function interface
            return this.constructor.style;
        }
    }


    class Foo extends StyleableComponent<any, any> {
        static style = "foo";

        constructor(props?: any, context?: any) {
            super(props, context, Foo.style);
        }
    }

    class Bar extends StyleableComponent<any, any> {
    }

    test('access style from subclass', function () {
        let foo = new Foo();

        expect(foo.someMethod()).toBe(Foo.style);
    });


    test('return undefined if subclass not define style', function () {
        let bar = new Bar();

        expect(bar.someMethod()).toBeUndefined();
    });

    test('replace static style with instance property', function () {
        let foo = new Foo();
        let bar = new Bar();
        let baz = new Bar(null, null, "baz");

        expect(foo.style).toBe("foo");
        expect(bar.style).toBe("default");
        expect(baz.style).toBe("baz");
    });
});