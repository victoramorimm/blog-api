import { LoadPublications } from '../../../../domain/usecases/publication/load-publications'
import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../add-publication/add-publication-protocols'

export class LoadPublicationsController implements Controller {
  constructor(private readonly loadPublications: LoadPublications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { accountId } = httpRequest.params

    if (accountId) {
      await this.loadPublications.load(accountId)
    }

    const error = badRequest(new MissingParamError('accountId'))

    return await new Promise((resolve) => resolve(error))
  }
}
