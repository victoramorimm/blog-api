import { AddPublicationController } from './add-publication-controller'
import {
  PublicationReturnedByDb,
  AddPublication,
  HttpRequest
} from './add-publication-protocols'
import {
  MaximumOfCharacters,
  MissingParamError,
  ServerError
} from '../../../errors'
import { badRequest, ok, serverError } from '../../../helpers/http'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    publication: 'any_publication'
  }
})

const makeAddPublicationBiggerThan500Characters = (): string => {
  return new Array(501 + 1).join(' ')
}

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
  sut: AddPublicationController
  addPublicationStub: AddPublication
}

const makeSut = (): SutTypes => {
  const addPublicationStub = makeAddPublicationStub()

  const sut = new AddPublicationController(addPublicationStub)

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

    const httpRequest = {
      body: {
        publication: makeAddPublicationBiggerThan500Characters()
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MaximumOfCharacters()))
  })

  test('Should call AddPublication with correct values', async () => {
    const { sut, addPublicationStub } = makeSut()

    const addSpy = jest.spyOn(addPublicationStub, 'add')

    const httpRequest = makeFakeHttpRequest()

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

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakePublicationReturnedByDb()))
  })
})
