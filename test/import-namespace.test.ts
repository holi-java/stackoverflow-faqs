//Note: you can compile current .ts and its dependencies into a single file,via `tsc --outFile`.
///<reference path="./stubs/domain.ts"/>
issue("How to import namespace?", "http://stackoverflow.com/questions/42775323/constructor-error-using-namespace-in-typescript/42777564#42777564")
import domain=require("./stubs/domain");

test('ref class constructor in namespace', () => {
    let UserConstructor = domain.User;
    let user: domain.User = new UserConstructor('bob', 13);

    expect(user.name).toBe('bob');
    expect(user.age).toBe(13);
});