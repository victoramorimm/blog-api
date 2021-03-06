import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('Publication Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const publicationCollection = await MongoHelper.getCollection(
      'publications'
    )

    await publicationCollection.deleteMany({})
  })

  test('Should return 200 on publication', async () => {
    await request(app)
      .post('/api/publication')
      .send({
        publication: 'Publicação teste'
      })
      .expect(200)
  })
})
