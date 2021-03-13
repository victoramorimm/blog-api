import { PublicationReturnedByDbModel } from '../../../models/publication-returned-by-db-model'

export interface LoadPublicationsRepository {
  loadAll: () => Promise<PublicationReturnedByDbModel[]>
}
