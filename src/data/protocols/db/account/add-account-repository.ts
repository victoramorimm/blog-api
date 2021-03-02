import { AccountReturnedByDbModel } from '../../../../domain/models/account/account-returned-by-db'
import { AddAccountModel } from '../../../../domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountReturnedByDbModel>
}
