declare class Flow {
    constructor(args: any);

    [property: string]: any;
}
type FlowConstructor={new(args: any): Flow};
//for global library
declare global {
    let Flow: FlowConstructor;
}
//for amd module:
//import Flow=require('./libs/Flow');
export =Flow;
