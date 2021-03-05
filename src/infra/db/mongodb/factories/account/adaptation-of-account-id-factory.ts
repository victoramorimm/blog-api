import { InsertOneWriteOpResult } from 'mongodb'
import { AccountReturnedByDbModel } from '../../../../../data/models/account-returned-by-db-model'
import { MongoHelper } from '../../helpers/mongo-helper'

export const makeAdaptationOfAccountIdReturnedByDb = async (
  result: InsertOneWriteOpResult<any>
): Promise<AccountReturnedByDbModel> => {
  const accountReturnedByDb = result.ops[0]

  return MongoHelper.makeAdapterForDefaultIdReturnedByDb(accountReturnedByDb)
}
