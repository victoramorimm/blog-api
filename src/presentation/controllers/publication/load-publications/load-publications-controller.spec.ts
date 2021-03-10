import { LoadPublications } from '../../../../domain/usecases/publication/load-publications'
import { MissingParamError, ServerError } from '../../../errors'
import { badRequest, serverError } from '../../../helpers/http'
import {
  HttpRequest,
  PublicationReturnedByDb
} from '../add-publication/add-publication-protocols'
import { LoadPublicationsController } from './load-publications-controller'

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
    async load(accountId: string): Promise<PublicationReturnedByDb[]> {
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
  test('Should return 400 if no accountId is provided as param on url', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      params: {
        accountId: 'any_id'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })

  test('Should call LoadPublications with correct accountId', async () => {
    const { sut, loadPublicationsStub } = makeSut()

    const loadSpy = jest.spyOn(loadPublicationsStub, 'load')

    const httpRequest: HttpRequest = {
      params: {
        accountId: 'any_id'
      }
    }

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if LoadPublications throws', async () => {
    const { sut, loadPublicationsStub } = makeSut()

    jest
      .spyOn(loadPublicationsStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpRequest: HttpRequest = {
      params: {
        accountId: 'any_id'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
