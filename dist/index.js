"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// import swaggerDocument from '../public/swagger.json'
const data_source_1 = require("./data-source");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const routes_1 = __importDefault(require("./routes"));
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'Garajão API',
            version: '1.0.0',
            description: 'API para controle de portões de garagem',
        },
        basePath: '/',
        tags: [{ name: 'Authorization' }, { name: 'Users' }, { name: 'Gates' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/**/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
data_source_1.appDataSource.initialize().then(() => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    app.use('/api', routes_1.default);
    app.use(errorMiddleware_1.errorMiddleware);
    return app.listen(process.env.PORT);
});
