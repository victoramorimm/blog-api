import { PublicationReturnedByDb } from '../../../../../data/models/publication-returned-by-db'
import { MongoHelper } from '../../helpers/mongo-helper'
import { makeAdaptationOfPublicationIdReturnedByDb } from './adaptation-of-publication-id-factory'

export const makeAdditionOfPublicationOnDb = async (
  publication: string
): Promise<PublicationReturnedByDb> => {
  const publicationCollection = await MongoHelper.getCollection('publications')

  const result = await publicationCollection.insertOne({ publication })

  return await makeAdaptationOfPublicationIdReturnedByDb(result)
}
