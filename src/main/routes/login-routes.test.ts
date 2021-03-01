import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { AuthenticationModel } from '../../domain/usecases/authentication'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

const makeFakeAuthenticationData = (): AuthenticationModel => ({
  email: 'victorvmrgamer@gmail.com',
  password: '123456'
})

let accountCollection: Collection

describe('Login Routes', () => {
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

  test('Should return 200 on login', async () => {
    const password = await hash('123456', 12)

    await accountCollection.insertOne({
      name: 'Victor Amorim',
      email: 'victorvmrgamer@gmail.com',
      password
    })

    await request(app)
      .post('/api/login')
      .send(makeFakeAuthenticationData())
      .expect(200)
  })

  test('Should return 401 on login', async () => {
    await request(app)
      .post('/api/login')
      .send(makeFakeAuthenticationData())
      .expect(401)
  })
})
