import { PublicationReturnedByDb } from '../../../../domain/models/publication/publication-returned-by-db'

export interface AddPublicationRepository {
  add: (
    publication: string,
    accountId: string
  ) => Promise<PublicationReturnedByDb>
}
