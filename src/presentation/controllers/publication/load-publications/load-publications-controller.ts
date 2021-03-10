import { LoadPublications } from '../../../../domain/usecases/publication/load-publications'
import { MissingParamError, ServerError } from '../../../errors'
import { badRequest, noContent, ok, serverError } from '../../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  PublicationReturnedByDb
} from '../add-publication/add-publication-protocols'

export class LoadPublicationsController implements Controller {
  constructor(private readonly loadPublications: LoadPublications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest.params

      if (accountId) {
        const publications: PublicationReturnedByDb[] = await this.loadPublications.load(
          accountId
        )

        return publications.length ? ok(publications) : noContent()
      }

      return badRequest(new MissingParamError('accountId'))
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
