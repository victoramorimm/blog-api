import { MongoHelper } from '../../helpers/mongo-helper'
import { PublicationMongoRepository } from './publication-mongo-repository'

describe('Publication Mongo Repository', () => {
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

  test('Should return a publication on add success', async () => {
    const sut = new PublicationMongoRepository()

    const publication = await sut.add('any_publication')

    expect(publication).toBeTruthy()
    expect(publication.id).toBeTruthy()
    expect(publication.publication).toBe('any_publication')
  })
})
