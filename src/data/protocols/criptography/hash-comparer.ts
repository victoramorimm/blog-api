export interface HashComparer {
  compare: (value: string, valueToCompare: string) => Promise<boolean>
}
