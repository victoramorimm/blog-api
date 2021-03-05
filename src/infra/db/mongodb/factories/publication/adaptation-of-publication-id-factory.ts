import { InsertOneWriteOpResult } from 'mongodb'
import { PublicationReturnedByDb } from '../../../../../data/models/publication-returned-by-db'
import { MongoHelper } from '../../helpers/mongo-helper'

export const makeAdaptationOfPublicationIdReturnedByDb = async (
  result: InsertOneWriteOpResult<any>
): Promise<PublicationReturnedByDb> => {
  const publicationReturnedByDb = result.ops[0]

  return MongoHelper.makeAdapterForDefaultIdReturnedByDb(
    publicationReturnedByDb
  )
}
