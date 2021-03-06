import { LoadAccountByToken } from '../../domain/usecases/account/load-account-by-token'
import { AccessDeniedError, ServerError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

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
