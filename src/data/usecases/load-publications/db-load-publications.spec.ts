import {
  PublicationReturnedByDbModel,
  LoadPublicationsRepository
} from './db-load-publications-protocols'
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
    async loadAll(): Promise<PublicationReturnedByDbModel[]> {
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
  test('Should call LoadPublicationsRepository', async () => {
    const { sut, loadPublicationsRepositoryStub } = makeSut()

    const loadAllSpy = jest.spyOn(loadPublicationsRepositoryStub, 'loadAll')

    await sut.load()

    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return null if LoadPublicationsRepository returns null', async () => {
    const { sut, loadPublicationsRepositoryStub } = makeSut()

    jest
      .spyOn(loadPublicationsRepositoryStub, 'loadAll')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const publications = await sut.load()

    expect(publications).toBeNull()
  })

  test('Should throw if LoadPublicationsRepository throws', async () => {
    const { sut, loadPublicationsRepositoryStub } = makeSut()

    jest
      .spyOn(loadPublicationsRepositoryStub, 'loadAll')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const publications = sut.load()

    await expect(publications).rejects.toThrow()
  })

  test('Should return publications on success', async () => {
    const { sut } = makeSut()

    const publications = await sut.load()

    expect(publications).toEqual(makeFakePublicationsReturnedByRepository())
  })

  test('Should return an empty array when the length is 0', async () => {
    const { sut, loadPublicationsRepositoryStub } = makeSut()

    jest
      .spyOn(loadPublicationsRepositoryStub, 'loadAll')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])))

    const publications = await sut.load()

    expect(publications).toEqual([])
  })
})
