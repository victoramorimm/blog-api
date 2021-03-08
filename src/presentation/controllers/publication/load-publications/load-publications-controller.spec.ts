import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http'
import { LoadPublicationController } from './load-publication-controller'

describe('LoadPublications Controller', () => {
  test('Should return 400 if no userId is provided', async () => {
    const sut = new LoadPublicationController()

    const httpRequest = {}

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('userId')))
  })
})
