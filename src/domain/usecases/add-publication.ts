import { PublicationReturnedByDb } from '../models/publication-returned-by-db'

export interface AddPublication {
  add: (publication: string) => Promise<PublicationReturnedByDb>
}
