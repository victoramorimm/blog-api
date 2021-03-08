import { PublicationController } from '../../../presentation/controllers/publication/publication-controller'
import { makeDbAddPublication } from '../usecases/db-add-publication-factory'

export const makePublicationController = (): PublicationController => {
  return new PublicationController(makeDbAddPublication())
}
