import {
  LoadPublicationsRepository,
  LoadPublications,
  PublicationReturnedByDb
} from './db-load-publications-protocols'

export class DbLoadPublications implements LoadPublications {
  constructor(
    private readonly loadPublicationsRepository: LoadPublicationsRepository
  ) {}

  async load(): Promise<PublicationReturnedByDb[]> {
    const publications = await this.loadPublicationsRepository.loadAll()

    if (publications) {
      return publications
    }
    return null
  }
}
