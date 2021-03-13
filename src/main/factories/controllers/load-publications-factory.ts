import { LoadPublicationsController } from '../../../presentation/controllers/publication/load-publications/load-publications-controller'
import { makeDbLoadPublications } from '../usecases/db-load-publications'

export const makeLoadPublicationsController = (): LoadPublicationsController => {
  return new LoadPublicationsController(makeDbLoadPublications())
}
