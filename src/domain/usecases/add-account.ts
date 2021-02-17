import { AccountReturnedByDbModel } from '../models/account-returned-by-db'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (accountData: AddAccountModel) => Promise<AccountReturnedByDbModel>
}
