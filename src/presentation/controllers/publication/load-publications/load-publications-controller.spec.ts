import { LoadPublicationsController } from './load-publications-controller'
import {
  LoadPublications,
  HttpRequest,
  PublicationReturnedByDb
} from './load-publications-controller-protocols'
import { ServerError } from '../../../errors'
import { noContent, ok, serverError, notFound } from '../../../helpers/http'

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    accountId: 'any_id'
  }
})

const makeFakePublicationsReturnedByDb = (): PublicationReturnedByDb[] => {
  return [
    {
      id: 'any_id',
      publication: 'any_publication',
      accountId: 'any_id'
    },
    {
      id: 'other_id',
      publication: 'other_publication',
      accountId: 'other_id'
    }
  ]
}

const makeLoadPublicationsStub = (): LoadPublications => {
  class LoadPublicationsStub implements LoadPublications {
    async load(): Promise<PublicationReturnedByDb[]> {
      const fakePublications: PublicationReturnedByDb[] = makeFakePublicationsReturnedByDb()

      return fakePublications
    }
  }

  return new LoadPublicationsStub()
}

type SutTypes = {
  sut: LoadPublicationsController
  loadPublicationsStub: LoadPublications
}

const makeSut = (): SutTypes => {
  const loadPublicationsStub = makeLoadPublicationsStub()

  const sut = new LoadPublicationsController(loadPublicationsStub)

  return {
    sut,
    loadPublicationsStub
  }
}

describe('LoadPublications Controller', () => {
  test('Should call LoadPublications', async () => {
    const { sut, loadPublicationsStub } = makeSut()

    const loadSpy = jest.spyOn(loadPublicationsStub, 'load')

    const httpRequest: HttpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 500 if LoadPublications throws', async () => {
    const { sut, loadPublicationsStub } = makeSut()

    jest
      .spyOn(loadPublicationsStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpRequest: HttpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if LoadPublications returns null', async () => {
    const { sut, loadPublicationsStub } = makeSut()

    jest
      .spyOn(loadPublicationsStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpRequest: HttpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound())
  })

  test('Should return 204 if publications length is 0', async () => {
    const { sut, loadPublicationsStub } = makeSut()

    jest
      .spyOn(loadPublicationsStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])))

    const httpRequest: HttpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakePublicationsReturnedByDb()))
  })
})
