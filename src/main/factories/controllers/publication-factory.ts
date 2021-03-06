import { PublicationController } from '../../../presentation/controllers/publication/publication-controller'
import { Controller } from '../../../presentation/protocols'
import { makeDbAddPublication } from '../usecases/db-add-publication-factory'

export const makePublicationController = (): Controller => {
  return new PublicationController(makeDbAddPublication())
}
