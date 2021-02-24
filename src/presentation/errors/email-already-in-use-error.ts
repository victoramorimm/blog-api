export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('The e-mail provided is already in use')
    this.name = 'EmailAlreadyInUseError'
  }
}
