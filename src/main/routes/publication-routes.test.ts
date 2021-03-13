import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { Collection } from 'mongodb'
import jwt from 'jsonwebtoken'
import env from '../config/env'

let publicationCollection: Collection

export const insertPublicationsOnInMemoryDb = async (): Promise<any> => {
  return await publicationCollection.insertMany([
    {
      publication: 'any_publication',
      accountId: 'any_id'
    },
    {
      publication: 'other_publication',
      accountId: 'any_id'
    }
  ])
}

let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Victor Amorim',
    email: 'victorvmrgamer@gmail.com',
    password: '123'
  })

  const id = result.ops[0]._id

  const accessToken = jwt.sign({ id }, env.jwtSecret)

  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

describe('Publication Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    publicationCollection = await MongoHelper.getCollection('publications')

    await publicationCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  describe('POST /publication', () => {
    test('Should return 403 on add publication without accessToken', async () => {
      await request(app)
        .post('/api/publication')
        .send({
          publication: 'Publicação teste'
        })
        .expect(403)
    })

    test('Should return 200 on add publication with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      await request(app)
        .post('/api/publication')
        .set('x-access-token', accessToken)
        .send({
          publication: 'Publicação teste'
        })
        .expect(200)
    })
  })

  describe('GET /publication', () => {
    test('Should return 403 on load publications without accessToken', async () => {
      await request(app).get('/api/publication').expect(403)
    })

    test('Should return 204 on load publications with valid accessToken and none publication', async () => {
      const accessToken = await makeAccessToken()

      await request(app)
        .get('/api/publication')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 200 on load publications with valid accessToken and some publications', async () => {
      const accessToken = await makeAccessToken()

      await insertPublicationsOnInMemoryDb()

      await request(app)
        .get('/api/publication')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
