import { SignUpController } from './signup-controller'
import {
  HttpRequest,
  AddAccount,
  AddAccountModel,
  AccountReturnedByDbModel,
  EmailValidator
} from './signup-protocols'
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  EmailAlreadyInUseError
} from '../../errors'
import { badRequest, ok, serverError, forbidden } from '../../helpers/http'

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

export const makeFakeValidRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccountReturnedByAddAccount = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
      const fakeAccount = makeFakeAccountReturnedByAddAccount()

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()

  const emailValidatorStub = makeEmailValidatorStub()

  const sut = new SignUpController(addAccountStub, emailValidatorStub)

  return {
    sut,
    addAccountStub,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequestWithoutName())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

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

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(
      makeFakeRequestWithoutPasswordConfirmation()
    )

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    )
  })

  test('Should return 400 if password and passwordConfirmation are different', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(
      makeFakeRequestWithPasswordConfirmationFailing()
    )

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    )
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    await sut.handle(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 400 if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeValidRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()

    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUseError()))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeValidRequest())

    const fakeAccount = makeFakeAccountReturnedByAddAccount()

    expect(httpResponse).toEqual(ok(fakeAccount))
  })
})
