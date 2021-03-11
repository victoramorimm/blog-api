import { PublicationReturnedByDbModel } from '../../models/publication-returned-by-db-model'
import { LoadPublicationsRepository } from '../../protocols/db/publication/load-publications-repository'
import { DbLoadPublications } from './db-load-publications'

describe('DbLoadPublications Usecase', () => {
  test('Should call LoadPublicationsRepository with correct accountId', async () => {
    class LoadPublicationsRepositoryStub implements LoadPublicationsRepository {
      async loadAll(
        accountId: string
      ): Promise<PublicationReturnedByDbModel[]> {
        const fakePublications: PublicationReturnedByDbModel[] = [
          {
            id: 'any_id',
            accountId: 'any_id',
            publication: 'any_publication'
          },
          {
            id: 'other_id',
            accountId: 'other_id',
            publication: 'other_publication'
          }
        ]

        return await new Promise((resolve) => resolve(fakePublications))
      }
    }

    const loadPublicationsRepositoryStub = new LoadPublicationsRepositoryStub()

    const loadAllSpy = jest.spyOn(loadPublicationsRepositoryStub, 'loadAll')

    const sut = new DbLoadPublications(loadPublicationsRepositoryStub)

    await sut.load('any_id')

    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })
})
