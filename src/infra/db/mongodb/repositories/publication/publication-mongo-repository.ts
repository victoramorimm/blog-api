import {
  PublicationReturnedByDbModel,
  AddPublicationRepository,
  MongoHelper
} from './publication-mongo-repository-protocols'

export class PublicationMongoRepository implements AddPublicationRepository {
  async add(publication: string): Promise<PublicationReturnedByDbModel> {
    const publicationCollection = await MongoHelper.getCollection(
      'publications'
    )

    const result = await publicationCollection.insertOne({ publication })

    const publicationReturnedByDb = result.ops[0]

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(
      publicationReturnedByDb
    )
  }
}
