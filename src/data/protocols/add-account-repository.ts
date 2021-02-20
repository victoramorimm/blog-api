import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db'
import { AddAccountModel } from '../../domain/usecases/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountReturnedByDbModel>
}
