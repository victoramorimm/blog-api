import { InsertOneWriteOpResult } from 'mongodb'
import { PublicationReturnedByDbModel } from '../../../../../data/models/publication-returned-by-db-model'
import { MongoHelper } from '../../helpers/mongo-helper'

export const makeAdaptationOfPublicationIdReturnedByDb = async (
  result: InsertOneWriteOpResult<any>
): Promise<PublicationReturnedByDbModel> => {
  const publicationReturnedByDb = result.ops[0]

  return MongoHelper.makeAdapterForDefaultIdReturnedByDb(
    publicationReturnedByDb
  )
}
