import request from 'supertest'
import { AddAccountModel } from '../../data/models/add-account-model'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

export const makeFakeAccountData = (): AddAccountModel => ({
  name: 'Victor Amorim',
  email: 'victorvmrgamer@gmail.com',
  password: '123456',
  passwordConfirmation: '123456'
})

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return 200 on signup', async () => {
    await request(app)
      .post('/api/signup')
      .send(makeFakeAccountData())
      .expect(200)
  })
})
