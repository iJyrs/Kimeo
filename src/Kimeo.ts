import { Mongo } from "./utils/Mongo";
import * as express from "express";
import Logger from "./utils/console/Logger";

export default class Kimeo {

    private static instance: Kimeo;

    constructor() {
        const app = express();

        Mongo.getInstance().connect().then((connected) => {
            connected ? Logger.info("Connected to MongoDB database...") : Logger.warning("Unable to connect to MongoDB database...");

            const LOADING_MS = 0; // TODO: Actually time how long it takes to start the server.

            app.listen(80, () => {
                Logger.info("Done! ("+LOADING_MS+"ms)")
            })
        })
    }

    static getInstance(): Kimeo {
        if(Kimeo.instance === null) {
            Kimeo.instance = new Kimeo();
        }

        return Kimeo.instance;
    }

}