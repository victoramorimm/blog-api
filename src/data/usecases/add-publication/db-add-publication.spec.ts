import { PublicationReturnedByDb } from '../../../domain/models/publication/publication-returned-by-db'
import { AddPublication } from '../../../domain/usecases/publication/add-publication'
import { AddPublicationRepository } from '../../protocols/db/publication/add-publication-repository'
import { DbAddPublication } from './db-add-publication'

const makeAddPublicationRepositoryStub = (): AddPublicationRepository => {
  class AddPublicationRepositoryStub implements AddPublicationRepository {
    async add(publication: string): Promise<PublicationReturnedByDb> {
      const fakePublicationReturnedByDb = {
        id: 'any_id',
        publication: 'any_publication'
      }

      return await new Promise((resolve) =>
        resolve(fakePublicationReturnedByDb)
      )
    }
  }

  return new AddPublicationRepositoryStub()
}

type SutTypes = {
  sut: AddPublication
  addPublicationRepositoryStub: AddPublicationRepository
}

const makeSut = (): SutTypes => {
  const addPublicationRepositoryStub = makeAddPublicationRepositoryStub()

  const sut = new DbAddPublication(addPublicationRepositoryStub)

  return {
    sut,
    addPublicationRepositoryStub
  }
}

describe('DbAddPublication Usecase', () => {
  test('Should call AddPublicationRepository with correct value', async () => {
    const { sut, addPublicationRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addPublicationRepositoryStub, 'add')

    await sut.add('any_publication')

    expect(addSpy).toHaveBeenCalledWith('any_publication')
  })

  test('Should throw if AddPublicationRepository throws', async () => {
    const { sut, addPublicationRepositoryStub } = makeSut()

    jest
      .spyOn(addPublicationRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const publication = sut.add('any_publication')

    await expect(publication).rejects.toThrow()
  })

  test('Should return a publication on success', async () => {
    const { sut } = makeSut()

    const publication = await sut.add('any_publication')

    expect(publication).toEqual({
      id: 'any_id',
      publication: 'any_publication'
    })
  })
})
