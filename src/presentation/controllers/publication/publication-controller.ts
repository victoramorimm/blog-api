import { AddPublication } from '../../../domain/usecases/publication/add-publication'
import { MaximumOfCharacters, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class PublicationController implements Controller {
  constructor(private readonly addPublication: AddPublication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { publication } = httpRequest.body

    if (publication.length > 500) {
      return badRequest(new MaximumOfCharacters())
    }

    await this.addPublication.add(publication)

    return badRequest(new MissingParamError('publication'))
  }
}
