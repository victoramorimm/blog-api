import { AccountMongoRepository } from './account-mongo-repository'
import {
  AddAccountModel,
  MongoHelper
} from './account-mongo-repository-protocols'
import { Collection } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  const insertAccountOnMemoryDb = async (): Promise<any> => {
    return await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  }

  const insertAccountWithAccessTokenOnMemoryDb = async (): Promise<any> => {
    return await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      accessToken: 'any_token'
    })
  }

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await insertAccountOnMemoryDb()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeNull()
    })
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()

      const account = await sut.add(makeFakeAccountData())

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })
  })

  describe('updateToken()', () => {
    test('Should update the account accessToken on updateToken success', async () => {
      const sut = makeSut()

      const result = await insertAccountOnMemoryDb()

      const accountReturnedByMemoryOnDb = result.ops[0]

      const { _id } = accountReturnedByMemoryOnDb

      await sut.updateAccessToken({
        id: _id,
        accessToken: 'any_token'
      })

      const account = await accountCollection.findOne({ _id })

      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success', async () => {
      const sut = makeSut()

      await insertAccountWithAccessTokenOnMemoryDb()

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('any_token')

      expect(account).toBeNull()
    })
  })
})
