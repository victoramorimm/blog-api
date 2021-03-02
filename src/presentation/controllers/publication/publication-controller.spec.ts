import { MaximumOfCharacters, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { PublicationController } from './publication-controller'

const makeSut = (): PublicationController => {
  return new PublicationController()
}

describe('Publication Controller', () => {
  test('Should return 400 if no publication is provided', async () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        publication: 'any_publication'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('publication'))
    )
  })

  test('Should return 400 if publication has more than 500 characters', async () => {
    const sut = makeSut()

    const publicationWithMoreThan500Characters = new Array(501 + 1).join(' ')

    const httpRequest = {
      body: {
        publication: publicationWithMoreThan500Characters
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MaximumOfCharacters()))
  })
})
