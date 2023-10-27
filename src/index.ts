import 'express-async-errors'
import express from 'express'

import { appDataSource } from './data-source'
import { errorMiddleware } from './middlewares/errorMiddleware'
import routes from './routes'

appDataSource.initialize().then(() => {
  const app = express()

  app.use(express.json())

  app.use('/api', routes)

  app.use(errorMiddleware)

  return app.listen(process.env.PORT)
})
