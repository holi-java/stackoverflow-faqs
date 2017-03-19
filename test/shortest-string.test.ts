issue("get the shortest string in array"
    , "http://stackoverflow.com/questions/42883366/how-to-tell-if-a-mixed-array-contains-string-elements/42883474#42883474");

describe("shortest string in array", () => {
    function shortest(array: any[]) {
        return array.filter(it => typeof it === "string")
                .reduce((a, b) => a.length <= b.length ? a : b, 0) || "";
    }

    test("compare undefined always return false", () => {
        let it: any = undefined;
        expect(it <= 0).toBe(false);
        expect(it >= 0).toBe(false);
    });


    test("return empty string if array is empty", () => {
        expect(shortest([])).toBe("");
    });

    test("return string if array contains single string item", () => {
        expect(shortest(["foo"])).toBe("foo");
    });

    test("return shortest string if array contains multi-items", () => {
        expect(shortest(["bc", "a"])).toBe("a");
        expect(shortest(["a", "bc"])).toBe("a");
    });

    test("return the first shortest string", () => {
        expect(shortest(["a", "b", "bc"])).toBe("a");
    });

    test("array contains other type items", () => {
        expect(shortest(["bc", 1, null, "a"])).toBe("a");
    });

    test("array contains no strings", () => {
        expect(shortest([1, null, true])).toBe("");
    });
});