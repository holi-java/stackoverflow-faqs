import CSV from "./libs/csv";
issue("Parsing a file/a string to CSV"
    , "http://stackoverflow.com/questions/42809177/csv-to-json-in-typescript");
function parse(csv, expectation) {
    return (done) => {
        CSV.from(csv).then(expectation).then(done).catch(done.fail);
    };
}
test('empty', parse("", (csv) => {
    expect(JSON.stringify(csv)).toEqual("{}");
}));

test('single header only', parse("name", csv => {
    expect(JSON.stringify(csv)).toEqual('{"name":[]}');
}));

test('access as property', parse("name", csv => {
    let cols: any[] = <any[]> csv.name;
    expect(cols).toEqual([]);
}));

test('multi headers only', parse("name,age", csv => {
    expect(csv).toEqual({"name": [], "age": []});
}));

test('multi headers only', parse("name,age", csv => {
    expect(csv.headers()).toEqual(["name", "age"]);
}));

test('1 col & 1 data row', parse("name\nbob", csv => {
    expect(csv).toEqual({"name": ["bob"]});
}));

test('1 col & 2 data rows', parse("name\nbob\njohn", csv => {
    expect(csv).toEqual({"name": ["bob", "john"]});
}));

test('2 col & 1 data row', parse("name,mail\nbob,bob@example.com", csv => {
    expect(csv).toEqual({"name": ["bob"], "mail": ["bob@example.com"]});
}));

test('convert a number-like col to number', parse("age\n1", csv => {
    expect(csv).toEqual({"age": [1]});
}));

test('data trimmed', parse(" age \n 1 ", csv => {
    expect(csv).toEqual({"age": [1]});
}));

test('convert a `NaN` col to number', parse("age\nNaN", csv => {
    expect(NaN).toEqual(NaN);//exercise jest toEqual api
    expect(csv).toEqual({age: [NaN]});
}));

test('skips empty lines', parse("\nage\n\n13\nfoo\n", csv => {
    expect(csv).toEqual({age: [13, "foo"]});
}));


test('show row number in csv when occur errors', done => {
    CSV.from("age\n1,3").then(<any>done.fail).catch(e => {
        expect(e.message).toMatch(/row 2/);
        done();
    }).catch(done.fail);
});