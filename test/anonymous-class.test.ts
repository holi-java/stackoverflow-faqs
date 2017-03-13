@issue("How to create anonymous class?",
    "http://stackoverflow.com/questions/42766986/typescript-anonymous-class")
abstract class Task implements Runnable {
    constructor(readonly name: string) {
    }

    abstract run(): void;
}

interface Runnable {
    run(): void;
}

test('anonymous class extends superclass by `class extends ?`', () => {
    let stub = jest.fn();
    let AntTask: {new(name: string): Task} = class extends Task {
        //anonymous class auto inherit its superclass constructor if you don't declare a constructor here.
        run() {
            stub();
        }
    };

    let antTask: Task = new AntTask("ant");
    antTask.run();

    expect(stub).toHaveBeenCalled();
    expect(antTask instanceof Task).toBe(true);
    expect(antTask.name).toBe("ant");
});

test('anonymous class implements interface by `class ?`', () => {
    let stub = jest.fn();
    let TestRunner: {new(): Runnable} = class {
        run = stub
    };

    let runner: Runnable = new TestRunner();
    runner.run();

    expect(stub).toHaveBeenCalled();
});
