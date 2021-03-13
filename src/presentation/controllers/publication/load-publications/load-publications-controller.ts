import {
  LoadPublications,
  HttpRequest,
  HttpResponse,
  Controller,
  PublicationReturnedByDb
} from './load-publications-controller-protocols'
import { ServerError } from '../../../errors'
import { noContent, notFound, ok, serverError } from '../../../helpers/http'

export class LoadPublicationsController implements Controller {
  constructor(private readonly loadPublications: LoadPublications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const publications: PublicationReturnedByDb[] = await this.loadPublications.load()

      if (!publications) {
        return notFound()
      }

      return publications.length ? ok(publications) : noContent()
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
