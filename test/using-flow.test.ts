//import Flow module
import Flow = require("./libs/flow");

//using global Flow
///<reference path="./libs/flow.d.ts"/>
///<reference path="./libs/flow.js"/>


issue("How to use a global library in typescript?",
    "http://stackoverflow.com/questions/42770601/how-to-use-flow-js-with-typescript-and-react/42772006#42772006")
test('create Flow instance', () => {
    var flow = new Flow({
        target: '/api/photo/redeem-upload-token',
        query: {upload_token: 'my_token'}
    });

    expect(flow.support).toBe(true);
});