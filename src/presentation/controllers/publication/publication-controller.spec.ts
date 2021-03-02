import { PublicationReturnedByDb } from '../../../domain/models/publication/publication-returned-by-db'
import { AddPublication } from '../../../domain/usecases/publication/add-publication'
import {
  MaximumOfCharacters,
  MissingParamError,
  ServerError
} from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http'
import { PublicationController } from './publication-controller'

const makeFakePublicationReturnedByDb = (): PublicationReturnedByDb => ({
  id: 'any_id',
  publication: 'any_publication'
})

const makeAddPublicationStub = (): AddPublication => {
  class AddPublicationStub implements AddPublication {
    async add(publication: string): Promise<PublicationReturnedByDb> {
      return await new Promise((resolve) =>
        resolve(makeFakePublicationReturnedByDb())
      )
    }
  }

  return new AddPublicationStub()
}

type SutTypes = {
  sut: PublicationController
  addPublicationStub: AddPublication
}

const makeSut = (): SutTypes => {
  const addPublicationStub = makeAddPublicationStub()

  const sut = new PublicationController(addPublicationStub)

  return {
    sut,
    addPublicationStub
  }
}

describe('Publication Controller', () => {
  test('Should return 400 if no publication is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {}
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('publication'))
    )
  })

  test('Should return 400 if publication has more than 500 characters', async () => {
    const { sut } = makeSut()

    const publicationWithMoreThan500Characters = new Array(501 + 1).join(' ')

    const httpRequest = {
      body: {
        publication: publicationWithMoreThan500Characters
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MaximumOfCharacters()))
  })

  test('Should call AddPublication with correct values', async () => {
    const { sut, addPublicationStub } = makeSut()

    const addSpy = jest.spyOn(addPublicationStub, 'add')

    const httpRequest = {
      body: {
        publication: 'any_publication'
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith('any_publication')
  })

  test('Should return 500 if AddPublication throws', async () => {
    const { sut, addPublicationStub } = makeSut()

    jest
      .spyOn(addPublicationStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpRequest = {
      body: {
        publication: 'any_publication'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        publication: 'any_publication'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      ok({
        id: 'any_id',
        publication: 'any_publication'
      })
    )
  })
})
