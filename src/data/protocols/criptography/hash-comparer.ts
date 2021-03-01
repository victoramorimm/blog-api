export interface HashComparerModel {
  value: string
  valueToCompare: string
}

export interface HashComparer {
  compare: (hashComparerData: HashComparerModel) => Promise<boolean>
}
