import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import { HttpRequest } from '../add-publication/add-publication-protocols'
import { LoadPublicationsController } from './load-publications-controller'

describe('LoadPublications Controller', () => {
  test('Should return 400 if no accountId is provided as param on url', async () => {
    const sut = new LoadPublicationsController()

    const httpRequest: HttpRequest = {
      params: {
        accountId: 'any_id'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })
})
