export interface HttpRequest {
  body?: any
  headers?: any
  params?: any
}

export interface HttpResponse {
  body: any
  statusCode: number
}
