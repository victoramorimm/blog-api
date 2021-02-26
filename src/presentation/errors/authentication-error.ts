export class AuthenticationError extends Error {
  constructor() {
    super('The e-mail or password provided is invalid')

    this.name = 'AuthenticationError'
  }
}
