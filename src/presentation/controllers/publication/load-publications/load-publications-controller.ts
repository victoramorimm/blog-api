import {
  LoadPublications,
  HttpRequest,
  HttpResponse,
  Controller,
  PublicationReturnedByDb
} from './load-publications-controller-protocols'
import { MissingParamError, ServerError } from '../../../errors'
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError
} from '../../../helpers/http'

export class LoadPublicationsController implements Controller {
  constructor(private readonly loadPublications: LoadPublications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest.params

      if (accountId) {
        const publications: PublicationReturnedByDb[] = await this.loadPublications.load(
          accountId
        )

        if (!publications) {
          return notFound()
        }

        return publications.length ? ok(publications) : noContent()
      }

      return badRequest(new MissingParamError('accountId'))
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
