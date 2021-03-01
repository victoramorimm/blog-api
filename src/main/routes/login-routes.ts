/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
