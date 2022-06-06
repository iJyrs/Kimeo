import { Db, MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

type MongoCredentials =
    | "USERNAME"
    | "PASSWORD";

export class Mongo {

    private static readonly CREDENTIALS: Record<MongoCredentials, string> = {
        USERNAME: "",
        PASSWORD: ""
    }

    private static instance: Mongo;

    private readonly client: MongoClient;
    public readonly database?: Db;

    private constructor() {
        // @ts-ignore
        let options: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
        this.client = new MongoClient("mongodb+srv://" + Mongo.CREDENTIALS.USERNAME + ":" + Mongo.CREDENTIALS.PASSWORD + "@ijyrs.dhhdn.mongodb.net/Kimeo?retryWrites=true&w=majority", options);

        this.database = this.client.db("Janus")
    }

    public async connect(): Promise<boolean> {
        return new Promise(async (resolve: Function) => {
            if (!await this.isConnected()) {
                this.client.connect((error) => {
                    error !== undefined ? resolve(false) : resolve(true);
                })
            }
        });
    }

    public async isConnected() {
        try {
            if (this.database !== undefined) {
                let ping = await this.database?.admin().ping();

                if (ping !== undefined) {
                    return ping["ok"] === 1;
                }
            }
        } catch (e) {
            return false;
        }

        return false;
    }

    public static getInstance(): Mongo {
        if (Mongo.instance === undefined) {
            Mongo.instance = new Mongo();
        }

        return Mongo.instance;
    }

}