import { AddPublication } from '../../../domain/usecases/publication/add-publication'
import {
  MaximumOfCharacters,
  MissingParamError,
  ServerError
} from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class PublicationController implements Controller {
  constructor(private readonly addPublication: AddPublication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { publication } = httpRequest.body

      if (!publication) {
        return badRequest(new MissingParamError('publication'))
      }

      if (publication.length > 500) {
        return badRequest(new MaximumOfCharacters())
      }

      const publicationReturnedByDb = await this.addPublication.add(publication)

      return ok(publicationReturnedByDb)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
