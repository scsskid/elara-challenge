import express from "express"
import { AddressInfo } from "net"
// this is all it takes to enable async/await for express middleware
import "express-async-errors"
import logger from "loglevel"
// all the routes for my app are retrieved from the src/routes/index.js module
import { getRoutes } from "./routes"
import { json } from "body-parser"

function startServer({ port = 4000 } = {}) {
  const app = express()
  app.use(json())
  app.use(getRoutes())
  app.use(errorMiddleware)
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${(server.address() as AddressInfo).port}`)
      // this block of code turns `server.close` into a promise API
      const closeServer = () => {
        return new Promise((resolveClose) => {
          server.close(resolveClose)
        })
      }
      async function exitHandler() {
        await closeServer()
          .then(() => {
            logger.info("Server successfully closed")
          })
          .catch((e) => {
            logger.warn("Something went wrong closing the server", e.stack)
          })
      }
      // do something when app is closing
      process.on("exit", exitHandler)
      // catches ctrl+c event
      process.on("SIGINT", exitHandler.bind(null, { exit: true }))
      // catches "kill pid" (for example: nodemon restart)
      process.on("SIGUSR1", exitHandler.bind(null, { exit: true }))
      process.on("SIGUSR2", exitHandler.bind(null, { exit: true }))
      // catches uncaught exceptions
      process.on("uncaughtException", exitHandler.bind(null, { exit: true }))
      // resolve the whole promise with the express server
      resolve(server)
    })
  })
}
// here's our generic error handler for situations where we didn't handle
// errors properly
function errorMiddleware(
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (res.headersSent) {
    next(error)
  } else {
    logger.error(error)
    res.status(500)
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(process.env.NODE_ENV === "production" ? null : { stack: error.stack }),
    })
  }
}

export { startServer }
