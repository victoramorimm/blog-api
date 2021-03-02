import { MaximumOfCharacters, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class PublicationController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { publication } = httpRequest.body

    if (publication.length > 500) {
      return badRequest(new MaximumOfCharacters())
    }

    return badRequest(new MissingParamError('publication'))
  }
}
