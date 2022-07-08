import glob from 'glob'
import Router from 'koa-router'
import path from 'path'

// This loops through all routers in the "modules" folder and mounts them as sub-routers in the koa app
// It allows us to easily create new modules without having to constantly update a central imports list
export default app => {
  glob(path.join(__dirname, '/*'), { ignore: '**/index.js' }, (err, matches) => {
    if (err) throw err

    matches.forEach(mod => {
      const router = require(`${mod}/router`)

      const routes = router.default
      const { baseUrl } = router
      const instance = new Router({ prefix: baseUrl })

      routes.forEach(config => {
        const { method = '', route = '', handlers = [] } = config
        const lastHandler = handlers.pop()
        instance[method.toLowerCase()](route, ...handlers, lastHandler)
        app.use(instance.routes()).use(instance.allowedMethods())
      })
    })
  })
}
