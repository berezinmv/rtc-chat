import * as http from "http";
import * as path from "path";
import * as express from "express";
import {configureSocket} from "./socket";

/**
 * Create express application
 */
const application = express();

/**
 * Configure static files serving
 */
application.use(express.static(path.resolve(__dirname, "public"), {index: "index.html"}));

/**
 * Create http server
 */
const server = http.createServer(application);

/**
 * Configure web sockets
 */
configureSocket(server);

server.listen(8080);
