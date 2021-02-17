import { Hasher } from '../../domain/protocols/hasher'
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

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return 'hashed_value'
    }
  }

  return new HasherStub()
}

type SutTypes = {
  sut: AddAccount
  emailValidatorStub: EmailValidator
  hasherStub: Hasher
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()

  const hasherStub = makeHasherStub()

  const sut = new DbAddAccount(emailValidatorStub, hasherStub)

  return {
    sut,
    emailValidatorStub,
    hasherStub
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

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeValidRequest()

    const promise = sut.add(httpRequest)

    await expect(promise).rejects.toThrow()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const httpRequest = makeFakeValidRequest()

    await sut.add(httpRequest)

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
})
