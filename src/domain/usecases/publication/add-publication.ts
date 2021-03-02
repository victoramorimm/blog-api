import { PublicationReturnedByDb } from '../../models/publication/publication-returned-by-db'

export interface AddPublication {
  add: (publication: string) => Promise<PublicationReturnedByDb>
}
