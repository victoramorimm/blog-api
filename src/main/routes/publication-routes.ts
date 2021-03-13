/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadPublicationsController } from '../factories/controllers/load-publications-factory'
import { makePublicationController } from '../factories/controllers/publication-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware())

  router.post(
    '/publication',
    adminAuth,
    adaptRoute(makePublicationController())
  )

  router.get(
    '/publication',
    adminAuth,
    adaptRoute(makeLoadPublicationsController())
  )
}
