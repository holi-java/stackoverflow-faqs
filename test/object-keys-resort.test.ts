issue("sort object keys",
    "http://stackoverflow.com/questions/42882979/how-to-sort-json-data-using-javascript/42883102#42883102")

describe("sort object keys", () => {
    function sort(o) {
        return Object.keys(o).sort().reduce(function (o, key) {
            let it = o[key];
            delete o[key];
            o[key] = it;
            return o;
        }, o);
    }

    test("sort keys", () => {
        let o = {b: 2, a: 1};

        expect(Object.keys(o)).toEqual(["b", "a"]);
        expect(sort(o)).toEqual({a: 1, b: 2});
        expect(Object.keys(o)).toEqual(["a", "b"]);
    });
});