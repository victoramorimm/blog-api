import { PublicationReturnedByDb } from '../../../domain/models/publication/publication-returned-by-db'
import { AddPublication } from '../../../domain/usecases/publication/add-publication'
import { AddPublicationRepository } from '../../protocols/db/publication/add-publication-repository'

export class DbAddPublication implements AddPublication {
  constructor(
    private readonly addPublicationRepository: AddPublicationRepository
  ) {}

  async add(data: string): Promise<PublicationReturnedByDb> {
    const publication = await this.addPublicationRepository.add(data)

    return publication
  }
}
