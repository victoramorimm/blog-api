import { DbLoadPublications } from '../../../data/usecases/load-publications/db-load-publications'
import { PublicationMongoRepository } from '../../../infra/db/mongodb/repositories/publication/publication-mongo-repository'

export const makeDbLoadPublications = (): DbLoadPublications => {
  return new DbLoadPublications(new PublicationMongoRepository())
}
