import { LoadPublications } from '../../../../domain/usecases/publication/load-publications'
import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import {
  HttpRequest,
  PublicationReturnedByDb
} from '../add-publication/add-publication-protocols'
import { LoadPublicationsController } from './load-publication-controller'

const makeFakePublicationArray = (): PublicationReturnedByDb[] => {
  return [
    {
      id: 'any_id',
      publication: 'any_publication'
    },
    {
      id: 'another_id',
      publication: 'another_publication'
    }
  ]
}

const makeLoadPublicationsStub = (): LoadPublications => {
  class LoadPublicationsStub implements LoadPublications {
    async load(accountId: string): Promise<PublicationReturnedByDb[]> {
      const fakePublicationArray = makeFakePublicationArray()

      return await new Promise((resolve) => resolve(fakePublicationArray))
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
  test('Should return 400 if no accountId is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      params: {}
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })

  test('Should call LoadPublications with correct value', async () => {
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
})
