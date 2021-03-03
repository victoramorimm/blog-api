import { PublicationReturnedByDb } from '../../../domain/models/publication/publication-returned-by-db'
import { AddPublicationRepository } from '../../protocols/db/publication/add-publication-repository'
import { DbAddPublication } from './db-add-publication'

describe('DbAddPublication Usecase', () => {
  test('Should call AddPublicationRepository with correct value', async () => {
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

    const addPublicationRepositoryStub = new AddPublicationRepositoryStub()

    const addSpy = jest.spyOn(addPublicationRepositoryStub, 'add')

    const sut = new DbAddPublication(addPublicationRepositoryStub)

    await sut.add('any_publication')

    expect(addSpy).toHaveBeenCalledWith('any_publication')
  })
})
