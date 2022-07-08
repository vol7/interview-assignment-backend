import Koa from 'koa'
import convert from 'koa-convert'
import devLogger from 'koa-logger'
import jsonLogger from 'koa-json-logger'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'

import config from 'config'
import errorMiddleware from 'middleware/error'
import modules from 'modules'
import 'lib/passport'

const app = new Koa()

if (process.env.NODE_ENV === 'production') {
  app.use(
    convert(
      jsonLogger({
        path: null
      })
    )
  )
} else {
  app.use(devLogger())
}

app.use(convert(cors()))
app.use(bodyParser())
app.use(errorMiddleware())
app.use(passport.initialize())

modules(app)

app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`)
})

export default app
