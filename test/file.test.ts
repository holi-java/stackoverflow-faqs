import {read, blob} from "./libs/csv";

test("read file", (done) => {
    read("foobar").then((contents) => {
        expect(contents).toEqual(["foobar"]);
        done();
    }).catch(done.fail);
});

test("read file with buffer size", (done) => {
    read("foo\nbar", undefined, {bufferSize: 4}).then((contents) => {
        expect(contents).toEqual(["foo", "bar"]);
        done();
    }).catch(done.fail);
});

test("read multiline", (done) => {
    read("foo\nbar\nbaz").then((contents) => {
        expect(contents).toEqual(["foo", "bar", "baz"]);
        done();
    }).catch(done.fail);
});

test("read line with \r\n", (done) => {
    read("foo\r\nbar\nbaz").then((contents) => {
        expect(contents).toEqual(["foo", "bar", "baz"]);
        done();
    }).catch(done.fail);
});

test("raise error when reading file failed", (done) => {
    let it = blob("");
    it.slice = () => {
        throw new Error("stream closed!");
    };
    read(it).then(<any>done.fail).catch((error) => {
        expect(error.message).toEqual("stream closed!");
        done();
    }).catch(done.fail);
});

test("mapping results in each", (done) => {
    let contents: string[] = [];
    let each = (line: string, row) => {
        contents.push(`${line}-${row}`);
        return `${line}-${row}`;
    };
    read(blob("foo-bar\nfuzz-buzz"), each, {bufferSize: 1}).then((result) => {
        expect(contents).toEqual(result);
        expect(contents).toEqual(["foo-bar-1", "fuzz-buzz-2"]);
        done();
    }).catch(done.fail);
});


test("skip undefined results in each", (done) => {
    let each = (line: string, row) => {
        return undefined;
    };
    read(blob("foo-bar\nfuzz-buzz"), each, {bufferSize: 1}).then((result) => {
        expect(result).toEqual([]);
        done();
    }).catch(done.fail);
});


