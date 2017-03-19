issue("sort object keys",
    "http://stackoverflow.com/questions/42882979/how-to-sort-json-data-using-javascript/42883102#42883102")

describe("sort object keys", () => {
    function by(columns) {
        columns = typeof columns == "string" ? columns.split(",") : columns;

        function compare(a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        }

        return function (a, b) {
            for (var i in columns) {
                var p = columns[i];
                var it = compare(a[p], b[p]);
                if (it) {
                    return it;
                }
            }
            return 0;
        }
    }

    function sort(o, comparator) {
        return Object.keys(o).sort().reduce(function (o, key) {
            var it = o[key];
            delete o[key];
            o[key] = it.sort ? it.sort(comparator) : it;
            return o;
        }, o);
    }

    test("sort keys", () => {
        let o = {b: 2, a: 1};

        expect(Object.keys(o)).toEqual(["b", "a"]);
        expect(sort(o, null)).toEqual({a: 1, b: 2});
        expect(Object.keys(o)).toEqual(["a", "b"]);
    });

    test("sort values", () => {
        let o = {b: [{value: 2}, {value: 1}], a: [{value: 4}, {value: 3}]};

        expect(Object.keys(o)).toEqual(["b", "a"]);
        expect(sort(o, by("value"))).toEqual({b: [{value: 1}, {value: 2}], a: [{value: 3}, {value: 4}]});
        expect(Object.keys(o)).toEqual(["a", "b"]);
    });
});