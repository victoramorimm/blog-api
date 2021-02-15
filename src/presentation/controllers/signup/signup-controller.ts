interface HttpResponse {
  statusCode: number
}

export class SignUpController {
  async handle(httpRequest): Promise<HttpResponse> {
    return {
      statusCode: 400
    }
  }
}
