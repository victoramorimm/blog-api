import { PublicationMongoRepository } from './publication-mongo-repository'
import { MongoHelper } from './publication-mongo-repository-protocols'

export const makeSut = (): PublicationMongoRepository => {
  return new PublicationMongoRepository()
}

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
    const sut = makeSut()

    const publication = await sut.add('any_publication', 'any_id')

    expect(publication).toBeTruthy()
    expect(publication.id).toBeTruthy()
    expect(publication.publication).toBe('any_publication')
    expect(publication.accountId).toBe('any_id')
  })
})
