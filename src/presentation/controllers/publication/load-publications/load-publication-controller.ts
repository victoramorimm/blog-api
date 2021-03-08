import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../add-publication/add-publication-protocols'

export class LoadPublicationController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = badRequest(new MissingParamError('userId'))

    return await new Promise((resolve) => resolve(error))
  }
}
