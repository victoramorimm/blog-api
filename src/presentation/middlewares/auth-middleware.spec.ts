import { LoadAccountByToken } from '../../domain/usecases/account/load-account-by-token'
import { AccountReturnedByDbModel } from '../controllers/signup/signup-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

export const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

export const makeFakeAccountReturnedByLoadAccountByToken = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(token: string): Promise<AccountReturnedByDbModel> {
      const fakeAccount = makeFakeAccountReturnedByLoadAccountByToken()

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new LoadAccountByTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()

  const sut = new AuthMiddleware(loadAccountByTokenStub)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(makeFakeHttpRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
