let forceUpdate = Symbol("forceUpdate");
export class ComponentPeer {
    private updated: boolean = false;

    get showing() {
        return this.updated;
    }

    [forceUpdate]() {
        this.updated = true;
    }
}

export default class Component extends ComponentPeer {
    update() {
        this[forceUpdate]();
    }
}
