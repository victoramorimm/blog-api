import {
  LoadPublicationsRepository,
  LoadPublications,
  PublicationReturnedByDb
} from './db-load-publications-protocols'

export class DbLoadPublications implements LoadPublications {
  constructor(
    private readonly loadPublicationsRepository: LoadPublicationsRepository
  ) {}

  async load(accountId: string): Promise<PublicationReturnedByDb[]> {
    const publications = await this.loadPublicationsRepository.loadAll(
      accountId
    )

    if (publications) {
      return publications
    }
    return null
  }
}
