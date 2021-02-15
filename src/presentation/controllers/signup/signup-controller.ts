import { MissingParamError } from '../../errors/missing-param-error'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'

const makeRequiredFieldsValidation = (
  httpRequest: HttpRequest
): HttpResponse => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of requiredFields) {
    if (!httpRequest.body[field]) {
      return {
        statusCode: 400,
        body: new MissingParamError(field)
      }
    }
  }
}

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = makeRequiredFieldsValidation(httpRequest)

    return httpResponse
  }
}
