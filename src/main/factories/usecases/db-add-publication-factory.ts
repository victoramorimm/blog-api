import { DbAddPublication } from '../../../data/usecases/add-publication/db-add-publication'
import { PublicationMongoRepository } from '../../../infra/db/mongodb/repositories/publication/publication-mongo-repository'

export const makeDbAddPublication = (): DbAddPublication => {
  return new DbAddPublication(new PublicationMongoRepository())
}
