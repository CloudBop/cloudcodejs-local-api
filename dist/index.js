"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var express_1 = __importDefault(require("express"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var cells_1 = require("./routes/cells");
var serve = function (port, filename, dir, useProxy) {
    // console.log("serving traffic on port", port);
    // console.log("saving/fecthing cells from", filename);
    // console.log("that file is in dir", dir);
    var app = (0, express_1.default)();
    // create routes
    app.use((0, cells_1.createCellsRouter)(filename, dir));
    // if nothing found.... development mode
    if (useProxy) {
        app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: "http://localhost:3000",
            ws: true,
            logLevel: "silent",
            // Err_ssl_protocol_error solution
            changeOrigin: true,
        }));
    }
    else {
        // user production mode
        // get abs path
        var packagePath = require.resolve("@cloudcodejs/local-client/build/index.html");
        app.use(express_1.default.static(
        // express doesn't like symbolic link
        // "../node_modules/local-client/build"
        packagePath));
    }
    // catch async errors
    return new Promise(function (resolve, reject) {
        app.listen(port, resolve).on("error", reject);
    });
};
exports.serve = serve;
