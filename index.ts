import Logger from "./src/utils/console/Logger";
const pJ = require("./package.json");
Logger.info("Starting Kimeo@v"+pJ.version+"...");

import Kimeo from "./src/Kimeo";

Kimeo.getInstance();

/**
 * TODO:
 *  - Middleware 4 Auth
 *  - Basic Authentication
 *     - CRUD Operations
 *     - Token Based Auth
 */