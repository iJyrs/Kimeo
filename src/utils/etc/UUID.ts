import { randomUUID } from "crypto";

export default class UUID {

    readonly v: string;

    constructor(v?: string) {
        if (v !== undefined) {
            if (/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(v)) {
                this.v = v;
            } else throw new Error("Invalid UUID entered... (Failed Regex Check)")
        } else this.v = randomUUID();
    }

    toString() {
        return this.v;
    }

}