import { SignUpController } from './signup-controller'
import { Hasher, EmailValidator, HttpRequest } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http'
import { AddAccount } from '../../../domain/usecases/add-account'

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

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(value: any): Promise<any> {
      // Mover para um factory o fakeAccount creation
      const fakeAccount = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

type SutTypes = {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  hasherStub: Hasher
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()

  const hasherStub = makeHasherStub()

  const addAccountStub = makeAddAccountStub()

  const sut = new SignUpController(
    emailValidatorStub,
    hasherStub,
    addAccountStub
  )

  return {
    sut,
    emailValidatorStub,
    hasherStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequestWithoutName()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequestWithoutEmail()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequestWithoutPassword()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequestWithoutPasswordConfirmation()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    )
  })

  test('Should return 400 if password and passwordConfirmation are different', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequestWithPasswordConfirmationFailing()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    )
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    const httpRequest = makeFakeValidRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 400 if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)

    const httpRequest = makeFakeValidRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeValidRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const httpRequest = makeFakeValidRequest()

    await sut.handle(httpRequest)

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should return 500 if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeValidRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeFakeValidRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeValidRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
