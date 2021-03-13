import { Collection } from 'mongodb'
import { PublicationMongoRepository } from './publication-mongo-repository'
import { MongoHelper } from './publication-mongo-repository-protocols'

let publicationCollection: Collection

export const insertPublicationsOnInDbMemory = async (): Promise<any> => {
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
    publicationCollection = await MongoHelper.getCollection('publications')

    await publicationCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return a publication on add success', async () => {
      const sut = makeSut()

      const publication = await sut.add('any_publication', 'any_id')

      expect(publication).toBeTruthy()
      expect(publication.id).toBeTruthy()
      expect(publication.publication).toBe('any_publication')
      expect(publication.accountId).toBe('any_id')
    })
  })

  describe('loadAll()', () => {
    test('Should load all publications on loadAll success', async () => {
      const sut = makeSut()

      await insertPublicationsOnInDbMemory()

      const publications = await sut.loadAll('any_id')

      expect(publications).toBeTruthy()
      expect(publications[0].publication).toBe('any_publication')
      expect(publications[1].publication).toBe('other_publication')
    })

    test('Should return null if loadAll fails', async () => {
      const sut = makeSut()

      const publications = await sut.loadAll('any_id')

      expect(publications).toBeNull()
    })
  })
})
