import { AddPublicationController } from '../../../presentation/controllers/publication/add-publication/add-publication-controller'
import { makeDbAddPublication } from '../usecases/db-add-publication-factory'

export const makePublicationController = (): AddPublicationController => {
  return new AddPublicationController(makeDbAddPublication())
}
