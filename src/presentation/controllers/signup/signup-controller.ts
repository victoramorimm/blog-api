import { HttpRequest, HttpResponse } from '../../protocols/http'

export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 400
    }
  }
}
