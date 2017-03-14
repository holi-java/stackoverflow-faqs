function matchers(): Matchers {
    function assert(condition: boolean): Matchers {
        function of(matcher) {
            return condition ? matcher : matchers.not(matcher);
        }

        return {
            get not() {
                return assert(!condition);
            },
            is<T>(expected: T): Matcher<T>{
                return of(matchers.is(expected));
            }
        };
    }

    return assert(true);
}

interface Matchers {
    readonly not: Matchers;
    is<T>(expected: T): Matcher<T>;
}
export interface Matcher<T> {
    test(item: any): boolean;
}

namespace matchers {


    export function is<T>(expected: T): Matcher<T> {
        return {
            test(actual: T): boolean{
                return expected === actual;
            }
        };
    }

    export function not<T>(that: Matcher<T>): Matcher<T> {
        return {
            test(actual: T): boolean{
                return !that.test(actual);
            }
        };
    }
}

export default matchers;