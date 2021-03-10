import {
  AddPublication,
  Controller,
  HttpRequest,
  HttpResponse,
  makeRequiredFieldsValidationForPublication
} from './add-publication-protocols'
import { MaximumOfCharacters, ServerError } from '../../../errors'
import { badRequest, ok, serverError } from '../../../helpers/http'

export class AddPublicationController implements Controller {
  constructor(private readonly addPublication: AddPublication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParamError = makeRequiredFieldsValidationForPublication(
        httpRequest
      )

      if (missingParamError) {
        return missingParamError
      }

      const { publication } = httpRequest.body

      if (publication.length > 500) {
        return badRequest(new MaximumOfCharacters())
      }

      const accountId = httpRequest.accountId

      const publicationReturnedByDb = await this.addPublication.add(
        publication,
        accountId
      )

      return ok(publicationReturnedByDb)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
