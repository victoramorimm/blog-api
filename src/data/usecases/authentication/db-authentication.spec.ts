import { Authentication } from '../../../domain/usecases/authentication'
import { AccountReturnedByDbModel } from '../../models/account-returned-by-db-model'
import { Encrypter } from '../../protocols/criptography/encrypter'
import {
  HashComparer,
  HashComparerModel
} from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

export const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
      const fakeAccount = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
      }

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(hashComparerData: HashComparerModel): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

export const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(encryptData: any): Promise<string> {
      return await new Promise((resolve) => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

type SutTypes = {
  sut: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()

  const hashComparerStub = makeHashComparerStub()

  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

  const secret = 'any_secret'

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    secret
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    await sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValue(new Promise((resolve) => resolve(null)))

    const accessToken = await sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(accessToken).toBeNull()
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValue(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    await expect(promise).rejects.toThrow()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const hashSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(hashSpy).toHaveBeenCalledWith({
      value: 'any_password',
      valueToCompare: 'hashed_password'
    })
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accessToken = await sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(accessToken).toBeNull()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValue(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(encryptSpy).toHaveBeenCalledWith('any_id', 'any_secret')
  })
})
