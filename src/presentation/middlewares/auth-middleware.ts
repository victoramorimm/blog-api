import {
  LoadAccountByToken,
  HttpRequest,
  HttpResponse,
  Middleware
} from './auth-middleware-protocols'
import { AccessDeniedError, ServerError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http'

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken)

        if (account) {
          return ok({ accountId: account.id })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
