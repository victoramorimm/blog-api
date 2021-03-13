import { LoadPublicationsRepository } from '../../../../../data/usecases/load-publications/db-load-publications-protocols'
import {
  PublicationReturnedByDbModel,
  AddPublicationRepository,
  MongoHelper
} from './publication-mongo-repository-protocols'

export class PublicationMongoRepository
  implements AddPublicationRepository, LoadPublicationsRepository {
  async add(
    publication: string,
    accountId: string
  ): Promise<PublicationReturnedByDbModel> {
    const publicationCollection = await MongoHelper.getCollection(
      'publications'
    )

    const result = await publicationCollection.insertOne({
      publication,
      accountId
    })

    const publicationReturnedByDb = result.ops[0]

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(
      publicationReturnedByDb
    )
  }

  async loadAll(): Promise<PublicationReturnedByDbModel[]> {
    const publicationsCollection = await MongoHelper.getCollection(
      'publications'
    )

    const publications = await publicationsCollection.find().toArray()

    if (publications || publications.length) {
      return MongoHelper.makeAdapterForDefaultIdReturnedByDb(publications)
    }

    return null
  }
}
