import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

const insertAccountOnMemoryDb = async (): Promise<any> => {
  await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  })
}

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

  test('Should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()

    await insertAccountOnMemoryDb()

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeNull()
  })
})
