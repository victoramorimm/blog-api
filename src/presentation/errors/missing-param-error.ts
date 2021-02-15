export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing the following param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
