import { PublicationReturnedByDb } from '../../models/publication/publication-returned-by-db'

export interface LoadPublications {
  load: () => Promise<PublicationReturnedByDb[]>
}
