export default class CSV {
    [header: string]: any[]|{(...args): any};
    constructor(csv: any = {}) {
        for (var header in csv) {
            this[header] = csv[header];
        }
    }

    headers(): string[] {
        return Object.keys(this);
    }

    static parser(value): any {
        if (value == "NaN") {
            return NaN;
        }
        return isNaN(value) ? value : parseFloat(value);
    }

    static trim(data: string): string {
        return data.replace(/^\s+|\s+$/g, "");
    }

    static from(input: string = "",
                parse: {(string: string): any} = this.parser,
                preprocess: {(data: string): string} = this.trim): Promise<CSV> {
        let csv = {};
        let headers: string[] = [];
        const steps = (...callbacks) => {
            return function (value, pos) {
                return callbacks.reduce((value, it) => it(value, pos), value);
            };
        };
        return read(input, (line: string, ln: number) => {
            const run = (handler) => {
                if (!/^\s*$/.test(line)) {//skip empty lines
                    line.split(/,/).forEach(handler);
                }
            };
            if (!headers.length) {
                //initializing headers
                run(steps(preprocess, header => {
                    csv[header] = [];
                    headers.push(header);
                }));
                return csv;
            }
            //adds data rows
            run(steps(preprocess, parse, (data, col) => {
                if (col >= headers.length) {
                    throw new Error(`headers index out of bounds at row ${ln}:max=${headers.length - 1}, col=${col}`);
                }
                csv[headers[col]].push(data);
            }));

        }).then(() => new CSV(csv));
    }

}


export interface Options {
    bufferSize?: number
    encoding?: string;
}
export function close(stream: any = {}) {
    [stream.close, stream.msClose]
        .filter(it => typeof it === "function")
        .some(it => it.call(stream))
}
export function blob(content: string): Blob {
    return new Blob([content]);
}
export function read<T>(input: string|Blob,
                        each: {(line: string, row: number): T|string}|undefined = line => line,
                        options: Options = {}): Promise<Array<T|string>> {

    if (typeof input === "string") {
        return read(blob(input), each, options);
    }

    return new Promise((resolve, reject) => {
        const it: FileReader = new FileReader();
        const results: Array<T|string> = [];
        const blob: Blob = input;
        const {bufferSize = 128 * 1024, encoding = "UTF-8"}=options;
        const CRLF = /\r?\n/;
        const endsWithLF = new RegExp(CRLF + "$");
        let pos = 0;
        let buff: any = "";
        let ln = 1;

        function notify(lines: string[]) {
            let n = lines.length;
            ln += n;
            return lines.map((line, i) => each(line, ln - n + i)).filter(it => it !== undefined);
        }

        function read() {
            it.onerror = event => reject(event.error);
            it.onload = () => {
                try {
                    let parts: string[] = `${buff}${it.result}`.split(CRLF);
                    buff = endsWithLF.test(it.result) ? "" : parts.pop();
                    results.push(...notify(parts));
                    if (pos < blob.size) {
                        read();
                        return;
                    }
                    //EOF
                    resolve(results.concat(notify([].concat(buff || []))));
                    close(blob);
                } catch (e) {
                    reject(e);
                }
            };
            it.readAsText(blob.slice(pos, pos += bufferSize), encoding);
        }

        read();
    }).catch(error => {
        close(input);
        throw error;
    });
}