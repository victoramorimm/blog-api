import { PublicationReturnedByDb } from '../../../domain/models/publication/publication-returned-by-db'
import { LoadPublications } from '../../../domain/usecases/publication/load-publications'
import { LoadPublicationsRepository } from '../../protocols/db/publication/load-publications-repository'

export class DbLoadPublications implements LoadPublications {
  constructor(
    private readonly loadPublicationsRepository: LoadPublicationsRepository
  ) {}

  async load(accountId: string): Promise<PublicationReturnedByDb[]> {
    return await this.loadPublicationsRepository.loadAll(accountId)
  }
}
