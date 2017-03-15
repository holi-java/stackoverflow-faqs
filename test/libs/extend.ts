import {copy, isFunction, fail, Function, when} from './core';
export interface Class {
    (...args): void;
}
export const EMPTY = () => ({});
export type SuperReference=Class&{[name: string]: any};
export type OverridingCallback= {(_super: SuperReference): any};

export default function extend(klass: Class|any, overridings: OverridingCallback = EMPTY): Class {
    let superclass: any = klass.prototype;

    function _super(stage: Stage, _this?: any) {
        function requireContext(callback) {
            return when(() => _this !== undefined).then(callback)
                .unless(() => fail("call `_super` outside the class!"));
        }

        let disabled: boolean = false;
        const cotr = requireContext(when(() => disabled).then(stage.fail).unless((...args) => {
            disabled = true;
            superclass.constructor.apply(_this, args);
        }));

        return copy(cotr, [superclass], intercept(it => requireContext((...args) => it.apply(_this, args))));
    }


    function subclass() {
        let $stage = stage();
        let $super = _super($stage, this);
        let overridden = overridings($super) || {};
        let {constructor:cotr} = overridden;
        cotr = cotr != Object && isFunction(cotr) ? cotr : $super;
        cotr.apply(copy(this, [overridden], intercept(it => $stage.on(Stages.METHOD, it))), arguments);
    }

    copy(subclass.prototype, [superclass, overridings(_super(stage()))]);
    return subclass;
}

const enum Stages{ METHOD, COTR }
interface Stage {
    on<T>(stage: Stages, callback: Function<T>): Function<T>;
    fail(): never;
}

const ERRORS = {
    [Stages.METHOD]: "call `_super()` outside the constructor!",
    [Stages.COTR]: "call `_super()` more than once in constructor!"
};

function stage(): Stage {
    let current = Stages.COTR;
    return {
        on: function (stage, callback) {
            return (...args) => {
                current = stage;
                return callback(args);
            };
        },
        fail: () => fail(ERRORS[current])
    };
}


export function intercept<T>(callback: Function<T>): Function<T> {
    return it => !isFunction(it) ? it : callback(it);
}