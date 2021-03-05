import { AccountReturnedByDbModel } from '../../../../../data/models/account-returned-by-db-model'
import { AddAccountModel } from '../../../../../data/models/add-account-model'
import { MongoHelper } from '../../helpers/mongo-helper'
import { makeAdaptationOfAccountIdReturnedByDb } from './adaptation-of-account-id-factory'

export const makeAdditionOfAccountOnDb = async (
  accountData: AddAccountModel
): Promise<AccountReturnedByDbModel> => {
  const publicationCollection = await MongoHelper.getCollection('publications')

  const result = await publicationCollection.insertOne(accountData)

  return await makeAdaptationOfAccountIdReturnedByDb(result)
}
