import { LoadPublications } from '../../../../domain/usecases/publication/load-publications'
import { MissingParamError, ServerError } from '../../../errors'
import { badRequest, ok, serverError } from '../../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../add-publication/add-publication-protocols'

export class LoadPublicationsController implements Controller {
  constructor(private readonly loadPublications: LoadPublications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest.params

      if (accountId) {
        const publications = await this.loadPublications.load(accountId)

        return ok(publications)
      }

      return badRequest(new MissingParamError('accountId'))
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
