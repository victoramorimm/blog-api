/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makePublicationController } from '../factories/controllers/publication-factory'

export default (router: Router): void => {
  router.post('/publication', adaptRoute(makePublicationController()))
}
