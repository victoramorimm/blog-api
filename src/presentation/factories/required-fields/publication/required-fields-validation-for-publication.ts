import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import { HttpRequest, HttpResponse } from '../../../protocols'

export const makeRequiredFieldsValidationForPublication = (
  httpRequest: HttpRequest
): HttpResponse => {
  const requiredFields = ['publication']

  for (const field of requiredFields) {
    if (!httpRequest.body[field]) {
      return badRequest(new MissingParamError(field))
    }
  }
}
