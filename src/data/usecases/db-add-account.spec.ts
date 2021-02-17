import { DbAddAccount } from './db-add-account'
import { Hasher } from '../../domain/protocols/hasher'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { EmailValidator } from '../../presentation/protocols/email-validator'

export const makeFakeAddAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
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

    const fakeAccountData = makeFakeAddAccountData()

    await sut.add(fakeAccountData)

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)

    const fakeAccountData = makeFakeAddAccountData()

    const account = await sut.add(fakeAccountData)

    expect(account).toBeNull()
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeAccountData = makeFakeAddAccountData()

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const fakeAccountData = makeFakeAddAccountData()

    await sut.add(fakeAccountData)

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeAccountData = makeFakeAddAccountData()

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })
})