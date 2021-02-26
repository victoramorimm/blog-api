import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http'
import { EmailValidator, HttpRequest } from '../../protocols'
import { LoginController } from './login-controller'

export const makeFakeRequestWithoutEmail = (): HttpRequest => ({
  body: {
    password: 'any_password'
  }
})

export const makeFakeRequestWithoutPassword = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com'
  }
})

export const makeFakeValidRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

export const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

export const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate(
      authenticationData: AuthenticationModel
    ): Promise<void> {}
  }

  return new AuthenticationStub()
}

type SutTypes = {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()

  const authenticationStub = makeAuthenticationStub()

  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequestWithoutEmail())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequestWithoutPassword())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    await sut.handle(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 400 if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValue(false)

    const httpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authenticate = jest.spyOn(authenticationStub, 'authenticate')

    await sut.handle(makeFakeValidRequest())

    expect(authenticate).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if Authentication returns null', async () => {
    const { sut, authenticationStub } = makeSut()

    jest
      .spyOn(authenticationStub, 'authenticate')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
  })
})
