issue("declare dynamic properties in typescript"
    ,"http://stackoverflow.com/questions/42847862/describe-property-object-in-typescript-interface/42849021#42849021");

interface ISome<K extends string> {
    primary: string;
    secondary: {
        [P in K]: {
            value: string;
            optional?: string;
        }
    };
}


let foo: ISome<"foo"> = {
    primary:"foo",
    secondary:{
        foo:{
            value:"foo"
        }
    }
};

let bar: ISome<"bar"> = {
    primary:"bar",
    secondary:{
        bar:{
            value:"bar",
            optional:"<optional>"
        }
    }
};

let foobar: ISome<"foo"|"bar"> = {
    primary:"foo",
    secondary:{
        foo:{
            value:"foo"
        },
        bar:{
            value:"bar",
            optional:"<optional>"
        }
    }
};

// interesting things that use with any|never types
let anything:ISome<any|never>={
    primary:"foo",
    secondary:{}
};
