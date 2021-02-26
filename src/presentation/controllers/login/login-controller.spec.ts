import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
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

type SutTypes = {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
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
})
