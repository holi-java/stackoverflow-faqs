export type Function<T>={(...args: any[]): T;};
export type Resolver={(it: any): any};
export function copy(target: any, sources: any[], resolve: Resolver = it => it) {
    sources.forEach(source => {
        for (let p in source) {
            target[p] = resolve(source[p]);
        }
    });
    return target;
}
export function fail(error): never {
    throw error;
}

export function isFunction(it): boolean {
    return typeof it == 'function';
}


export type Predicate=() => boolean;
export interface Condition {
    (...args: any[]): any;
    then(callback: Function<any>): this;
    unless(callback: Function<any>): this;
}
export function when(predicate: Predicate): Condition {
    let $callback, $error;
    $callback = $error = () => {};

    function condition(...args) {
        let execution = predicate() ? $callback : $error;
        return execution.apply(this, args);
    }

    return copy(condition, [{
        then(callback){
            $callback = callback;
            return this;
        },
        unless(callback){
            $error = callback;
            return this;
        }
    }]);
}