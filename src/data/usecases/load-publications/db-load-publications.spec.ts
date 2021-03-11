import { PublicationReturnedByDbModel } from '../../models/publication-returned-by-db-model'
import { LoadPublicationsRepository } from '../../protocols/db/publication/load-publications-repository'
import { DbLoadPublications } from './db-load-publications'

const makeFakePublicationsReturnedByRepository = (): PublicationReturnedByDbModel[] => {
  return [
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
}

const makeFakeLoadPublicationsRepositoryStub = (): LoadPublicationsRepository => {
  class LoadPublicationsRepositoryStub implements LoadPublicationsRepository {
    async loadAll(accountId: string): Promise<PublicationReturnedByDbModel[]> {
      const fakePublications: PublicationReturnedByDbModel[] = makeFakePublicationsReturnedByRepository()

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

  test('Should return null if LoadPublicationsRepository returns null', async () => {
    const { sut, loadPublicationsRepositoryStub } = makeSut()

    jest
      .spyOn(loadPublicationsRepositoryStub, 'loadAll')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const publications = await sut.load('any_id')

    expect(publications).toBeNull()
  })

  test('Should return publications on success', async () => {
    const { sut } = makeSut()

    const publications = await sut.load('any_id')

    expect(publications).toEqual(makeFakePublicationsReturnedByRepository())
  })
})
