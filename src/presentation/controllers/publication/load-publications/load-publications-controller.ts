import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../add-publication/add-publication-protocols'

export class LoadPublicationsController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('accountId'))
  }
}
