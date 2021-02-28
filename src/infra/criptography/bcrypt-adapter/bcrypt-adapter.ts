import { Hasher } from '../../../data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'
import {
  HashComparer,
  HashComparerModel
} from '../../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)

    return hash
  }

  async compare(compareData: HashComparerModel): Promise<boolean> {
    const { value, valueToCompare } = compareData

    await bcrypt.compare(value, valueToCompare)

    return null
  }
}
