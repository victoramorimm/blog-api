import { PublicationReturnedByDbModel } from '../../models/publication-returned-by-db-model'
import { LoadPublicationsRepository } from '../../protocols/db/publication/load-publications-repository'
import { DbLoadPublications } from './db-load-publications'

const makeFakeLoadPublicationsRepositoryStub = (): LoadPublicationsRepository => {
  class LoadPublicationsRepositoryStub implements LoadPublicationsRepository {
    async loadAll(accountId: string): Promise<PublicationReturnedByDbModel[]> {
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

  return new LoadPublicationsRepositoryStub()
}

type SutTypes = {
  sut: DbLoadPublications
  loadPublicationsRepositoryStub: LoadPublicationsRepository
}

const makeSut = (): SutTypes => {
  const loadPublicationsRepositoryStub = makeFakeLoadPublicationsRepositoryStub()

  const sut = new DbLoadPublications(loadPublicationsRepositoryStub)

  return {
    sut,
    loadPublicationsRepositoryStub
  }
}

describe('DbLoadPublications Usecase', () => {
  test('Should call LoadPublicationsRepository with correct accountId', async () => {
    const { sut, loadPublicationsRepositoryStub } = makeSut()

    const loadAllSpy = jest.spyOn(loadPublicationsRepositoryStub, 'loadAll')

    await sut.load('any_id')

    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })
})
