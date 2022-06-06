import { randomBytes } from "crypto";
import { hash } from "bcrypt";
import {sign} from "jsonwebtoken";
import UUID from "../utils/etc/UUID";
import { Mongo } from "../utils/Mongo";

export class User {

    static readonly TOKEN_EXPIRATION_RATE = 86400;

    uuid: UUID;
    username: string;
    email: string;
    permissions: string[] = [];

    password: string;
    access_secret: string;
    refresh_secret: string;

    constructor(uuid: UUID, username: string, email: string, permissions: string[], password: string, access_secret: string, refresh_secret: string) {
        this.uuid = uuid;
        this.username = username;
        this.email = email;
        this.permissions = permissions;
        this.password = password;

        this.access_secret = access_secret;
        this.refresh_secret = refresh_secret;
    }

    hasPermission(str: string): boolean {
        for (let i = 0; i < this.permissions.length; i++) {
            if (this.permissions[i] == str || this.permissions[i] == "*") return true;
        }

        return false;
    }

    refresh_token(): string { return sign({ uuid: this.uuid.v }, this.refresh_secret); }
    generateAccessToken() { return sign({ uuid: this.uuid.v }, this.access_secret, { expiresIn: User.TOKEN_EXPIRATION_RATE }); }

    async invokeSecrets() {
        this.access_secret = randomBytes(36).toString("base64");
        this.refresh_secret = randomBytes(36).toString("base64");

        await Mongo.getInstance().database?.collection("Janus").updateOne({ uuid: this.uuid.v }, { $set: { access_secret: this.access_secret, refresh_secret: this.refresh_secret } });
    }

    static async create(username: string, email: string, password: string, permissions: string[] = []): Promise<User | undefined> {
        if (UserRegex.username_regex.test(username) && UserRegex.email_regex.test(email) && UserRegex.password_regex.test(password)) {
            password = await hash(password, 10);

            let uuid: UUID = new UUID(); let access_secret = randomBytes(36).toString("base64"); let refresh_secret = randomBytes(36).toString("base64");

            if (!await User.exist({ uuid: uuid.v }) && !await User.exist({username: username})) {
                await Mongo.getInstance().database?.collection("Janus").insertOne({
                    uuid: uuid.v,
                    username: username,
                    email: email,
                    permissions: permissions,
                    password: password,
                    access_secret: access_secret,
                    refresh_secret: refresh_secret
                });

                return new User(uuid, username, email, permissions, password, access_secret, refresh_secret);
            }
        }

        return undefined;
    }

    static async search(query: Partial<UserQueryParams>): Promise<User[]> {
        let rawUsers: any = (await Mongo.getInstance().database?.collection("Janus").find(query)).toArray();
        let usersArr: User[] = [];

        if (rawUsers !== undefined) {
            if (rawUsers.length !== 0) {
                for (let i = 0; i < rawUsers.length; i++) {
                    let rawUser = rawUsers[i];

                    usersArr.push(new User(new UUID(rawUser.uuid), rawUser.username, rawUser.email, rawUser.permissions, rawUser.password, rawUser.access_secret, rawUser.refresh_secret));
                }

                return usersArr;
            }
        }

        return [];
    }

    static async exist(query: Partial<UserQueryParams>): Promise<boolean> {
        return (await User.search(query)).length !== 0;
    }

    static async delete(query: Partial<UserQueryParams>): Promise<boolean> {
        let res = await Mongo.getInstance().database?.collection("Janus").deleteOne(query);

        if (res !== undefined) {
            return res.deletedCount === 1;
        } else return false;
    }
}

type UserQueryParams = {

    uuid: string;
    username: string;
    email: string;

}

export class UserRegex {

    static readonly email_regex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static readonly username_regex: RegExp = /^[a-zA-Z0-9_.]{0,16}$/;
    static readonly password_regex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

}