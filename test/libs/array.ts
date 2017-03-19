export function by(columns) {
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