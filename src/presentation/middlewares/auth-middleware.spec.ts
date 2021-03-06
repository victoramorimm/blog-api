import { LoadAccountByToken } from '../../domain/usecases/account/load-account-by-token'
import { AccountReturnedByDbModel } from '../controllers/signup/signup-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(token: string): Promise<AccountReturnedByDbModel> {
        const fakeAccount = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password'
        }

        return await new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const sut = new AuthMiddleware(loadAccountByTokenStub)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(token: string): Promise<AccountReturnedByDbModel> {
        const fakeAccount = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password'
        }

        return await new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    const sut = new AuthMiddleware(loadAccountByTokenStub)

    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
