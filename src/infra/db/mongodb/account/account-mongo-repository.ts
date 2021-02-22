import { AccountReturnedByDbModel } from '../../../../data/models/account-returned-by-db-model'
import { LoadAccountByEmailRepository } from '../../../../data/usecases/db-add-account-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements LoadAccountByEmailRepository {
  async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
  }
}
