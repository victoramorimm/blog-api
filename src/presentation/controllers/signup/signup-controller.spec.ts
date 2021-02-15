import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { HttpRequest } from '../../protocols/http'
import { SignUpController } from './signup-controller'

export const makeFakeRequestWithoutName = (): HttpRequest => ({
  body: {
    email: 'any_email@mail',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

export const makeFakeRequestWithoutEmail = (): HttpRequest => ({
  body: {
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

export const makeFakeRequestWithoutPassword = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    passwordConfirmation: 'any_password'
  }
})

export const makeFakeRequestWithoutPasswordConfirmation = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

export const makeFakeRequestWithPasswordConfirmationFailing = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'different_password'
  }
})

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const sut = new SignUpController()

    const httpRequest = makeFakeRequestWithoutName()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('name')
    })
  })

  test('Should return 400 if no email is provided', async () => {
    const sut = new SignUpController()

    const httpRequest = makeFakeRequestWithoutEmail()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('email')
    })
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = new SignUpController()

    const httpRequest = makeFakeRequestWithoutPassword()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('password')
    })
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const sut = new SignUpController()

    const httpRequest = makeFakeRequestWithoutPasswordConfirmation()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('passwordConfirmation')
    })
  })

  test('Should return 400 if password and passwordConfirmation are different', async () => {
    const sut = new SignUpController()

    const httpRequest = makeFakeRequestWithPasswordConfirmationFailing()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('passwordConfirmation')
    })
  })
})
