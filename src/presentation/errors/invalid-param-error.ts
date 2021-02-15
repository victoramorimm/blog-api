export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`The following param is invalid: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
