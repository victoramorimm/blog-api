import { PublicationReturnedByDbModel } from '../../../../../data/models/publication-returned-by-db-model'
import { AddPublicationRepository } from '../../../../../data/protocols/db/publication/add-publication-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

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
