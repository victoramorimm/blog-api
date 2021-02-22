import { AccountReturnedByDbModel } from '../../../../data/models/account-returned-by-db-model'
import { AddAccountModel } from '../../../../data/models/add-account-model'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '../../../../data/usecases/db-add-account-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements LoadAccountByEmailRepository, AddAccountRepository {
  async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    if (account) {
      return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
    }

    return null
  }

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const account = result.ops[0]

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
  }
}
