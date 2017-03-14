issue("Can't get the Reflect metadata correctly in .ts files of the primitive types",
    'http://stackoverflow.com/questions/42771431/typescript-reflect-getmetadata-designtype-returns-object-instead-of-date-withou/42774585#42774585')

import 'reflect-metadata';
import 'core-js/es7/reflect';

class Condition {
    constructor(readonly value: any, readonly match: boolean) {
    }

    test(that: any): boolean {
        return (this.value == that) == this.match;
    }
}
class DeclaredType {
    static get not() {
        return this.matcher().not;
    }

    static matcher(condition: boolean = true) {
        return {
            get not() {
                return DeclaredType.matcher(!condition)
            },
            is(value: any){
                return new Condition(value, condition);
            }
        };
    }

    static is(expectedType: any): Condition {
        return this.matcher().is(expectedType);
    }
}

function Test(matcher: Condition) {

    return function (target: any, key: string): void {
        let type = Reflect.getOwnMetadata('design:type', target, key);

        test(`${target.constructor.name} ${key}'s type should be \`${matcher.value.name}\`!`, () => {
            expect(matcher.test(type)).toBe(true);
        });
    }
}


function Foo() {

}
interface Foo {
}

class MyDate extends Date {

}
class ReflectMetadataTest {
    // this test always false even if you compile .ts it into .js file
    @Test(DeclaredType.not.is(Foo/*ref function*/)) foo: Foo/*ref interface*/;

    //this test is true when you c om pile .ts it into .js file
    @Test(DeclaredType.not.is(Date)) Date: Date;
    @Test(DeclaredType.not.is(String)) String: String;
    @Test(DeclaredType.not.is(Number)) Number: Number;
    @Test(DeclaredType.not.is(Boolean)) Boolean: Boolean;

    //this test is always true both in .ts & .js
    @Test(DeclaredType.is(String)) string: string;
    @Test(DeclaredType.is(Number)) number: number;
    @Test(DeclaredType.is(Boolean)) boolean: boolean;
    @Test(DeclaredType.is(MyDate)) myDate: MyDate;
    @Test(DeclaredType.is(ReflectMetadataTest)) test: ReflectMetadataTest;
}