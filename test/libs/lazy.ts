export default function lazy(target, name, {get:initializer, enumerable, configurable}: PropertyDescriptor={}): any {
    if (initializer === undefined) {
        throw `@lazy can't be set as a property \`${name}\` on ${target.constructor.name} class, using a getter instead!`;
    }
    const {defineProperty, getPrototypeOf}=Object;

    function set(that, value) {
        if (value === undefined) {
            value = that;
            that = this;
        }
        defineProperty(that, name, {
            enumerable: enumerable,
            configurable: configurable,
            value: value
        });
        return value;
    }

    const {constructor}=target;
    return {
        get(){
            if (this === target) {
                return initializer;
            }
            //note:subclass.prototype.foo when foo exists in superclass nor subclass,this will be called
            if (this.constructor !== constructor && getPrototypeOf(this).constructor === constructor) {
                return initializer;
            }
            return set(this, initializer.call(this));
        },
        set
    };
}