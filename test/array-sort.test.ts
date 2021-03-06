import {by} from "./libs/array";

issue("array sort multi columns",
    "http://stackoverflow.com/questions/42872483/how-to-sort-a-very-large-data-array-by-multiple-parameter-in-javascript/42872724#42872724")
describe("array sort multi columns", () => {

    test("sort with single column", () => {
        let array = [{a: 1}, {a: 3}, {a: 2}];

        expect(array.sort(by("a"))).toEqual([{a: 1}, {a: 2}, {a: 3}]);
    });

    test("sort column with null values", () => {
        let array = [{a: 1}, {a: null}];

        expect(array.sort(by("a"))).toEqual([{a: null}, {a: 1}]);
        expect(array.sort(by("a"))).toEqual([{a: null}, {a: 1}]);
    });

    test("sort string type column", () => {
        let array = [{a: "foo"}, {a: "bar"}];

        expect(array.sort(by("a"))).toEqual([{a: "bar"}, {a: "foo"}]);
    });

    test("sort by string columns", () => {
        let array = [{a: 1, b: 2}, {a: 1, b: 1}];

        expect(array.sort(by("a,b"))).toEqual([{a: 1, b: 1}, {a: 1, b: 2}]);
    });

    test("sort by array columns", () => {
        let array = [{a: 1, b: 2}, {a: 1, b: 1}];

        expect(array.sort(by(["a", "b"]))).toEqual([{a: 1, b: 1}, {a: 1, b: 2}]);
    });
});

