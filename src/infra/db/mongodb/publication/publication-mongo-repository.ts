import { PublicationReturnedByDb } from '../../../../data/models/publication-returned-by-db'
import { AddPublicationRepository } from '../../../../data/protocols/db/publication/add-publication-repository'
import { makeAdditionOfPublicationOnDb } from '../factories/publication/addition-of-publication-on-db-factory'

export class PublicationMongoRepository implements AddPublicationRepository {
  async add(publication: string): Promise<PublicationReturnedByDb> {
    return await makeAdditionOfPublicationOnDb(publication)
  }
}
