import { PublicationReturnedByDb } from '../../../domain/models/publication/publication-returned-by-db'
import { AddPublication } from '../../../domain/usecases/publication/add-publication'
import { AddPublicationRepository } from '../../protocols/db/publication/add-publication-repository'

export class DbAddPublication implements AddPublication {
  constructor(
    private readonly addPublicationRepository: AddPublicationRepository
  ) {}

  async add(publication: string, accountId): Promise<PublicationReturnedByDb> {
    const publicationReturnedByDb: PublicationReturnedByDb = await this.addPublicationRepository.add(
      publication,
      accountId
    )

    return publicationReturnedByDb
  }
}
