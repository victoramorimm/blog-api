import { PublicationReturnedByDb } from '../../../../../data/models/publication-returned-by-db'
import { AddPublicationRepository } from '../../../../../data/protocols/db/publication/add-publication-repository'
import { makeAdaptationOfPublicationIdReturnedByDb } from '../../factories/publication/adaptation-of-publication-id-factory'
import { MongoHelper } from '../../helpers/mongo-helper'

export class PublicationMongoRepository implements AddPublicationRepository {
  async add(publication: string): Promise<PublicationReturnedByDb> {
    const publicationCollection = await MongoHelper.getCollection(
      'publications'
    )

    const result = await publicationCollection.insertOne({ publication })

    return await makeAdaptationOfPublicationIdReturnedByDb(result)
  }
}
