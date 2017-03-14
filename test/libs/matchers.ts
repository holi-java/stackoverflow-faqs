function matchers(): Matchers {
    function assert(condition: boolean): Matchers {
        function of(matcher) {
            return condition ? matcher : matchers.not(matcher);
        }

        return {
            get not(): Matchers {
                return assert(!condition);
            },
            is<T>(expected: T): Matcher<T>{
                return of(matchers.is(expected));
            }
        };
    }

    return assert(true);
}

export interface Matchers {
    readonly not: Matchers;
    is<T>(expected: T): Matcher<T>;
}
export interface Matcher<T> {
    readonly description: string;
    test(item: any): boolean;
}

namespace matchers {
    function array(value: any): Array<any> {
        return Array.prototype.slice.call(value);
    }

    function stringify(value: any): string {
        let type = typeof value;
        if (type === "number" || type === "boolean") {
            return `${value}`;
        }
        if (type == "function") {
            return `[Function ${value.name}]`;
        }
        if (type !== "string" && value && value.length != undefined) {//array-like
            return `[${array(value).map(stringify).join(', ')}]`;
        }
        return `"${value}"`;
    }

    export function is<T>(expected: T): Matcher<T> {
        return {
            get description() {
                return `be <${stringify(expected)}>`
            },
            test(actual: T): boolean{
                return expected === actual;
            }
        };
    }

    export function not<T>(that: Matcher<T>): Matcher<T> {
        return {
            get description() {
                return `not ${that.description}`;
            },
            test(actual: T): boolean{
                return !that.test(actual);
            }
        };
    }
}

export default matchers;