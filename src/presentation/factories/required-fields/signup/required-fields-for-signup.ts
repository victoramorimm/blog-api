import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import { HttpRequest, HttpResponse } from '../../../protocols'

export const makeRequiredFieldsValidationForSignUp = (
  httpRequest: HttpRequest
): HttpResponse => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of requiredFields) {
    if (!httpRequest.body[field]) {
      return badRequest(new MissingParamError(field))
    }
  }
}
