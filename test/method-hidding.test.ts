import Component from "./stubs/libs";
issue("How to prevent a method from being called on derived class?"
    , "http://stackoverflow.com/questions/42954794/in-typescript-how-to-prevent-a-method-from-being-called-on-derived-class/42954946#42954946");
describe('method hiding', () => {
    class Button extends Component {
        render() {
            //now subclass can't access forceUpdate method
            this.update();
        }
    }

    test("outside classes can't access symbol method", () => {
        let forceUpdate = Symbol('forceUpdate');
        expect(Symbol.keyFor(forceUpdate)).toBeUndefined();

        let button = new Button();
        expect(button[forceUpdate]).toBeUndefined();

        expect(button.showing).toBe(false);
        button.render();
        expect(button.showing).toBe(true);
    });
});