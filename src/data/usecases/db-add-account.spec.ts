import { AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError } from '../../presentation/errors'
import { badRequest } from '../../presentation/helpers/http'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { HttpRequest } from '../../presentation/protocols/http'
import { DbAddAccount } from './db-add-account'

export const makeFakeValidRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

type SutTypes = {
  sut: AddAccount
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()

  const sut = new DbAddAccount(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    const httpRequest = makeFakeValidRequest()

    await sut.add(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 400 if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)

    const httpRequest = makeFakeValidRequest()

    const httpResponse = await sut.add(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
