import 'express-async-errors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

// import swaggerDocument from '../public/swagger.json'
import { appDataSource } from './data-source'
import { errorMiddleware } from './middlewares/errorMiddleware'
import routes from './routes'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1', // YOU NEED THIS
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
}

const specs = swaggerJsdoc(swaggerOptions)

appDataSource.initialize().then(() => {
  const app = express()

  app.use(express.json())

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

  app.use('/api', routes)

  app.use(errorMiddleware)

  return app.listen(process.env.PORT)
})
